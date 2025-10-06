#!/usr/bin/env python3
"""
QR System Testing for PANDA Lounge
Tests the QR generation and validation system with comprehensive security checks.
"""

import requests
import json
import time
import sqlite3
from datetime import datetime
import sys

# Configuration
BASE_URL = "http://localhost:3000"
DB_PATH = "/app/prisma/dev.db"

# Test users from seed data
TEST_USERS = {
    "demo": {"email": "demo@panda.com", "password": "demo123", "role": "guest"},
    "staff": {"email": "staff@panda.com", "password": "staff123", "role": "staff"},
    "admin": {"email": "admin@panda.com", "password": "admin123", "role": "admin"}
}

class QRSystemTester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'QR-System-Tester/1.0'
        })
        self.auth_tokens = {}
        
    def log(self, message, level="INFO"):
        """Log test messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def authenticate_user(self, user_key):
        """Authenticate user and get session cookies"""
        user = TEST_USERS[user_key]
        self.log(f"Authenticating user: {user['email']}")
        
        # First, get the CSRF token by visiting the login page
        try:
            login_page = self.session.get(f"{BASE_URL}/auth/login")
            if login_page.status_code != 200:
                self.log(f"Failed to access login page: {login_page.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"Error accessing login page: {e}", "ERROR")
            return False
            
        # Try to authenticate via NextAuth credentials endpoint
        auth_data = {
            "email": user["email"],
            "password": user["password"],
            "redirect": "false",
            "json": "true"
        }
        
        try:
            # Use NextAuth credentials signin endpoint
            auth_response = self.session.post(
                f"{BASE_URL}/api/auth/signin/credentials",
                data=auth_data,
                allow_redirects=False
            )
            
            self.log(f"Auth response status: {auth_response.status_code}")
            self.log(f"Auth response headers: {dict(auth_response.headers)}")
            
            # Check if we got session cookies
            cookies = self.session.cookies.get_dict()
            self.log(f"Session cookies: {list(cookies.keys())}")
            
            if 'next-auth.session-token' in cookies or 'next-auth.csrf-token' in cookies:
                self.log(f"Successfully authenticated {user['email']}")
                return True
            else:
                self.log(f"Authentication failed for {user['email']} - no session cookies", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Authentication error for {user['email']}: {e}", "ERROR")
            return False
    
    def make_api_request(self, method, endpoint, data=None):
        """Make authenticated API request"""
        url = f"{BASE_URL}{endpoint}"
        
        try:
            if method.upper() == "POST":
                response = self.session.post(url, json=data)
            elif method.upper() == "GET":
                response = self.session.get(url)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            self.log(f"{method} {endpoint} -> {response.status_code}")
            
            # Log response details for debugging
            if response.status_code >= 400:
                self.log(f"Error response: {response.text}", "ERROR")
                
            return response
            
        except Exception as e:
            self.log(f"API request error: {e}", "ERROR")
            return None
    
    def check_database_records(self, table_name, condition=None):
        """Check database records for validation"""
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            if condition:
                query = f"SELECT * FROM {table_name} WHERE {condition}"
            else:
                query = f"SELECT * FROM {table_name}"
                
            cursor.execute(query)
            records = cursor.fetchall()
            
            # Get column names
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = [col[1] for col in cursor.fetchall()]
            
            conn.close()
            
            self.log(f"Database query: {query}")
            self.log(f"Found {len(records)} records in {table_name}")
            
            # Convert to dict format for easier reading
            result = []
            for record in records:
                result.append(dict(zip(columns, record)))
                
            return result
            
        except Exception as e:
            self.log(f"Database error: {e}", "ERROR")
            return []
    
    def test_qr_generation(self, user_key, qr_type="visit"):
        """Test QR code generation"""
        self.log(f"\n=== TEST: QR Generation ({user_key} -> {qr_type}) ===")
        
        if not self.authenticate_user(user_key):
            return None
            
        # Generate QR code
        qr_data = {"type": qr_type}
        response = self.make_api_request("POST", "/api/qr/generate", qr_data)
        
        if not response:
            self.log("Failed to make QR generation request", "ERROR")
            return None
            
        if response.status_code == 200:
            result = response.json()
            self.log(f"✅ QR generated successfully")
            self.log(f"Token: {result.get('token', 'N/A')[:50]}...")
            self.log(f"Expires at: {result.get('expiresAt', 'N/A')}")
            return result
        else:
            self.log(f"❌ QR generation failed: {response.status_code}", "ERROR")
            try:
                error_data = response.json()
                self.log(f"Error details: {error_data}", "ERROR")
            except:
                self.log(f"Error response: {response.text}", "ERROR")
            return None
    
    def test_qr_validation(self, validator_user_key, qr_token):
        """Test QR code validation"""
        self.log(f"\n=== TEST: QR Validation ({validator_user_key}) ===")
        
        if not self.authenticate_user(validator_user_key):
            return None
            
        # Validate QR code
        validation_data = {"token": qr_token}
        response = self.make_api_request("POST", "/api/qr/validate", validation_data)
        
        if not response:
            self.log("Failed to make QR validation request", "ERROR")
            return None
            
        if response.status_code == 200:
            result = response.json()
            self.log(f"✅ QR validation successful")
            self.log(f"Valid: {result.get('valid', False)}")
            self.log(f"User: {result.get('user', {}).get('email', 'N/A')}")
            self.log(f"Event ID: {result.get('event_id', 'N/A')}")
            return result
        else:
            self.log(f"❌ QR validation failed: {response.status_code}")
            try:
                error_data = response.json()
                self.log(f"Error: {error_data.get('error', 'Unknown')}")
                self.log(f"Message: {error_data.get('message', 'N/A')}")
            except:
                self.log(f"Error response: {response.text}", "ERROR")
            return None
    
    def test_signature_tampering(self, original_token):
        """Test QR code signature tampering protection"""
        self.log(f"\n=== TEST: Signature Tampering Protection ===")
        
        if not original_token:
            self.log("No token provided for tampering test", "ERROR")
            return False
            
        # Tamper with the signature (change last few characters)
        parts = original_token.split('.')
        if len(parts) != 2:
            self.log("Invalid token format for tampering test", "ERROR")
            return False
            
        tampered_signature = parts[1][:-3] + "XXX"  # Change last 3 characters
        tampered_token = f"{parts[0]}.{tampered_signature}"
        
        self.log(f"Original token: {original_token[:50]}...")
        self.log(f"Tampered token: {tampered_token[:50]}...")
        
        # Try to validate tampered token
        if not self.authenticate_user("staff"):
            return False
            
        validation_data = {"token": tampered_token}
        response = self.make_api_request("POST", "/api/qr/validate", validation_data)
        
        if response and response.status_code == 400:
            try:
                error_data = response.json()
                if error_data.get('error') == 'INVALID_SIGNATURE':
                    self.log("✅ Signature tampering correctly detected")
                    return True
                else:
                    self.log(f"❌ Unexpected error: {error_data.get('error')}", "ERROR")
                    return False
            except:
                self.log("❌ Failed to parse error response", "ERROR")
                return False
        else:
            self.log(f"❌ Signature tampering not detected (status: {response.status_code if response else 'None'})", "ERROR")
            return False
    
    def test_expired_qr(self):
        """Test expired QR code handling"""
        self.log(f"\n=== TEST: Expired QR Code ===")
        
        if not self.authenticate_user("demo"):
            return False
            
        # Generate QR with negative TTL (expired)
        qr_data = {"type": "visit", "ttlMinutes": -1}
        response = self.make_api_request("POST", "/api/qr/generate", qr_data)
        
        if not response or response.status_code != 200:
            self.log("Failed to generate expired QR", "ERROR")
            return False
            
        result = response.json()
        expired_token = result.get('token')
        
        if not expired_token:
            self.log("No token in expired QR response", "ERROR")
            return False
            
        # Try to validate expired token
        if not self.authenticate_user("staff"):
            return False
            
        validation_data = {"token": expired_token}
        response = self.make_api_request("POST", "/api/qr/validate", validation_data)
        
        if response and response.status_code == 400:
            try:
                error_data = response.json()
                if error_data.get('error') == 'EXPIRED':
                    self.log("✅ Expired QR correctly rejected")
                    return True
                else:
                    self.log(f"❌ Unexpected error: {error_data.get('error')}", "ERROR")
                    return False
            except:
                self.log("❌ Failed to parse error response", "ERROR")
                return False
        else:
            self.log(f"❌ Expired QR not detected (status: {response.status_code if response else 'None'})", "ERROR")
            return False
    
    def test_permission_check(self):
        """Test permission checks for QR validation"""
        self.log(f"\n=== TEST: Permission Check (Guest trying to validate) ===")
        
        # First generate a QR as demo user
        qr_result = self.test_qr_generation("demo", "visit")
        if not qr_result:
            self.log("Failed to generate QR for permission test", "ERROR")
            return False
            
        token = qr_result.get('token')
        if not token:
            self.log("No token in QR generation result", "ERROR")
            return False
            
        # Try to validate as guest (demo user)
        if not self.authenticate_user("demo"):
            return False
            
        validation_data = {"token": token}
        response = self.make_api_request("POST", "/api/qr/validate", validation_data)
        
        if response and response.status_code == 403:
            try:
                error_data = response.json()
                self.log(f"✅ Permission check working: {error_data.get('error', 'Access denied')}")
                return True
            except:
                self.log("✅ Permission check working (403 status)")
                return True
        else:
            self.log(f"❌ Permission check failed (status: {response.status_code if response else 'None'})", "ERROR")
            return False
    
    def run_comprehensive_tests(self):
        """Run all QR system tests"""
        self.log("🚀 Starting QR System Comprehensive Tests")
        self.log(f"Base URL: {BASE_URL}")
        self.log(f"Database: {DB_PATH}")
        
        test_results = {}
        
        # Test 1: QR Generation (demo user)
        self.log("\n" + "="*60)
        qr_result = self.test_qr_generation("demo", "visit")
        test_results["qr_generation"] = qr_result is not None
        
        if qr_result:
            token = qr_result.get('token')
            
            # Test 2: QR Validation (staff user)
            self.log("\n" + "="*60)
            validation_result = self.test_qr_validation("staff", token)
            test_results["qr_validation"] = validation_result is not None and validation_result.get('valid', False)
            
            # Test 3: Anti-replay test (try to validate same token again)
            self.log("\n" + "="*60)
            self.log("=== TEST: Anti-Replay Protection ===")
            replay_result = self.test_qr_validation("staff", token)
            if replay_result is None or not replay_result.get('valid', True):
                self.log("✅ Anti-replay protection working")
                test_results["anti_replay"] = True
            else:
                self.log("❌ Anti-replay protection failed", "ERROR")
                test_results["anti_replay"] = False
            
            # Test 4: Signature tampering
            self.log("\n" + "="*60)
            test_results["signature_tampering"] = self.test_signature_tampering(token)
        else:
            test_results["qr_validation"] = False
            test_results["anti_replay"] = False
            test_results["signature_tampering"] = False
        
        # Test 5: Expired QR
        self.log("\n" + "="*60)
        test_results["expired_qr"] = self.test_expired_qr()
        
        # Test 6: Permission check
        self.log("\n" + "="*60)
        test_results["permission_check"] = self.test_permission_check()
        
        # Check database records
        self.log("\n" + "="*60)
        self.log("=== DATABASE VALIDATION EVENTS ===")
        validation_events = self.check_database_records("QRValidationEvent")
        for event in validation_events[-5:]:  # Show last 5 events
            self.log(f"Event: {event.get('qr_type')} | Success: {event.get('success')} | Error: {event.get('error_message', 'None')}")
        
        # Summary
        self.log("\n" + "="*60)
        self.log("🎯 TEST SUMMARY")
        self.log("="*60)
        
        passed = 0
        total = len(test_results)
        
        for test_name, result in test_results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            self.log(f"{test_name.replace('_', ' ').title()}: {status}")
            if result:
                passed += 1
        
        self.log(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            self.log("🎉 All tests passed! QR system is working correctly.")
            return True
        else:
            self.log("⚠️ Some tests failed. Please check the logs above.")
            return False

def main():
    """Main test execution"""
    tester = QRSystemTester()
    
    try:
        success = tester.run_comprehensive_tests()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n⚠️ Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Test execution failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()