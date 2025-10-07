#!/usr/bin/env python3
"""
Wheel of Fortune v2.1 API Testing
Tests the new wheel API endpoints with FSM and server-side validation
- 7-day cooldown between spins
- Transactional prize distribution (WheelSpin + Coupon + AuditLog)
"""

import requests
import json
import time
import threading
from datetime import datetime, timedelta
import sys

# Configuration
BASE_URL = "http://localhost:3000"

# Test users from the request
TEST_USERS = {
    "demo": {"email": "demo@panda.com", "password": "demo123"},
    "admin": {"email": "admin@panda.com", "password": "admin123"}
}

class WheelTester:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'User-Agent': 'Wheel-Tester/2.1'
        })
        
    def log(self, message, level="INFO"):
        """Log test messages with timestamp"""
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def authenticate_user(self, user_key):
        """Authenticate user via NextAuth and get session cookies"""
        user = TEST_USERS[user_key]
        self.log(f"Authenticating user: {user['email']}")
        
        try:
            # Step 1: Get CSRF token
            csrf_response = self.session.get(f"{BASE_URL}/api/auth/csrf")
            if csrf_response.status_code == 200:
                csrf_data = csrf_response.json()
                csrf_token = csrf_data.get('csrfToken')
                self.log(f"Got CSRF token: {csrf_token[:20]}...")
            else:
                self.log("Failed to get CSRF token", "ERROR")
                return False
            
            # Step 2: Visit the login page to get proper session setup
            login_page = self.session.get(f"{BASE_URL}/auth/login")
            if login_page.status_code != 200:
                self.log(f"Failed to access login page: {login_page.status_code}", "ERROR")
                return False
            
            # Step 3: Authenticate via NextAuth credentials endpoint
            auth_data = {
                "email": user["email"],
                "password": user["password"],
                "csrfToken": csrf_token,
                "redirect": "false",
                "json": "true"
            }
            
            auth_response = self.session.post(
                f"{BASE_URL}/api/auth/signin/credentials",
                data=auth_data,
                allow_redirects=False
            )
            
            self.log(f"Auth response status: {auth_response.status_code}")
            
            # Step 4: Check if we got redirected to callback
            if auth_response.status_code in [200, 302]:
                try:
                    response_data = auth_response.json()
                    if response_data.get('url'):
                        # Follow the callback URL
                        callback_response = self.session.get(response_data['url'], allow_redirects=True)
                        self.log(f"Callback response status: {callback_response.status_code}")
                except:
                    pass
            
            # Step 5: Verify session by checking session endpoint
            session_response = self.session.get(f"{BASE_URL}/api/auth/session")
            if session_response.status_code == 200:
                try:
                    session_data = session_response.json()
                    if session_data and session_data.get('user'):
                        self.log(f"✅ Successfully authenticated {user['email']}")
                        self.log(f"Session user: {session_data['user'].get('email')}")
                        return True
                except:
                    pass
            
            # Check for session cookies as fallback
            cookies = self.session.cookies.get_dict()
            session_cookies = [k for k in cookies.keys() if 'next-auth' in k and 'session' in k]
            
            if session_cookies:
                self.log(f"✅ Successfully authenticated {user['email']} (via cookies)")
                self.log(f"Session cookies: {session_cookies}")
                return True
            else:
                self.log(f"❌ Authentication failed for {user['email']} - no valid session", "ERROR")
                self.log(f"Available cookies: {list(cookies.keys())}")
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
                self.log(f"Error response: {response.text[:200]}...", "ERROR")
                
            return response
            
        except Exception as e:
            self.log(f"API request error: {e}", "ERROR")
            return None
    
    def test_wheel_status_unauthorized(self):
        """Test wheel status without authorization"""
        self.log("\n=== TEST: Wheel Status - Unauthorized ===")
        
        # Clear any existing session
        self.session.cookies.clear()
        
        response = self.make_api_request("GET", "/api/wheel/status")
        
        if response and response.status_code == 401:
            try:
                data = response.json()
                self.log("✅ Unauthorized access correctly blocked")
                self.log(f"Response: {data}")
                return True
            except:
                self.log("✅ Unauthorized access blocked (401 status)")
                return True
        else:
            self.log(f"❌ Unauthorized access not blocked (status: {response.status_code if response else 'None'})", "ERROR")
            return False
    
    def test_wheel_status_authorized(self, user_key, expected_state=None):
        """Test wheel status with authorization"""
        self.log(f"\n=== TEST: Wheel Status - Authorized ({user_key}) ===")
        
        if not self.authenticate_user(user_key):
            return None
            
        response = self.make_api_request("GET", "/api/wheel/status")
        
        if not response:
            self.log("Failed to make wheel status request", "ERROR")
            return None
            
        if response.status_code == 200:
            try:
                data = response.json()
                self.log("✅ Wheel status retrieved successfully")
                self.log(f"Can spin: {data.get('canSpin')}")
                self.log(f"State: {data.get('state')}")
                self.log(f"Message: {data.get('message', 'N/A')}")
                
                if 'nextSpinDate' in data:
                    self.log(f"Next spin date: {data['nextSpinDate']}")
                if 'timeLeft' in data:
                    self.log(f"Time left: {data['timeLeft']}")
                if 'lastPrize' in data:
                    self.log(f"Last prize: {data['lastPrize']}")
                
                # Validate expected state if provided
                if expected_state and data.get('state') != expected_state:
                    self.log(f"❌ Expected state '{expected_state}', got '{data.get('state')}'", "ERROR")
                    return None
                
                return data
            except Exception as e:
                self.log(f"Failed to parse wheel status response: {e}", "ERROR")
                return None
        else:
            self.log(f"❌ Wheel status failed: {response.status_code}", "ERROR")
            try:
                error_data = response.json()
                self.log(f"Error details: {error_data}", "ERROR")
            except:
                self.log(f"Error response: {response.text}", "ERROR")
            return None
    
    def test_wheel_spin_unauthorized(self):
        """Test wheel spin without authorization"""
        self.log("\n=== TEST: Wheel Spin - Unauthorized ===")
        
        # Clear any existing session
        self.session.cookies.clear()
        
        response = self.make_api_request("POST", "/api/wheel/spin")
        
        if response and response.status_code == 401:
            try:
                data = response.json()
                self.log("✅ Unauthorized spin correctly blocked")
                self.log(f"Response: {data}")
                return True
            except:
                self.log("✅ Unauthorized spin blocked (401 status)")
                return True
        else:
            self.log(f"❌ Unauthorized spin not blocked (status: {response.status_code if response else 'None'})", "ERROR")
            return False
    
    def test_wheel_spin_authorized(self, user_key, expect_success=True):
        """Test wheel spin with authorization"""
        self.log(f"\n=== TEST: Wheel Spin - Authorized ({user_key}) ===")
        
        if not self.authenticate_user(user_key):
            return None
            
        response = self.make_api_request("POST", "/api/wheel/spin")
        
        if not response:
            self.log("Failed to make wheel spin request", "ERROR")
            return None
        
        try:
            data = response.json()
        except:
            self.log(f"Failed to parse spin response: {response.text}", "ERROR")
            return None
            
        if expect_success:
            if response.status_code == 200 and data.get('success'):
                self.log("✅ Wheel spin successful")
                self.log(f"Prize: {data.get('prize', {}).get('name', 'N/A')}")
                self.log(f"Prize description: {data.get('prize', {}).get('description', 'N/A')}")
                self.log(f"Next spin date: {data.get('nextSpinDate', 'N/A')}")
                
                if data.get('coupon'):
                    self.log(f"Coupon code: {data['coupon'].get('code', 'N/A')}")
                    self.log(f"Coupon expires: {data['coupon'].get('expiresAt', 'N/A')}")
                else:
                    self.log("No coupon generated (might be non-discount prize)")
                
                return data
            else:
                self.log(f"❌ Expected successful spin, got: {response.status_code} - {data.get('error', 'Unknown')}", "ERROR")
                return None
        else:
            # Expecting failure (cooldown)
            if response.status_code == 429 and data.get('error') == 'COOLDOWN_ACTIVE':
                self.log("✅ Cooldown correctly enforced")
                self.log(f"Error: {data.get('error')}")
                self.log(f"Message: {data.get('message', 'N/A')}")
                self.log(f"Next spin date: {data.get('nextSpinDate', 'N/A')}")
                return data
            else:
                self.log(f"❌ Expected cooldown error, got: {response.status_code} - {data.get('error', 'Unknown')}", "ERROR")
                return None
    
    def test_race_condition_protection(self, user_key):
        """Test race condition protection with simultaneous requests"""
        self.log(f"\n=== TEST: Race Condition Protection ({user_key}) ===")
        
        if not self.authenticate_user(user_key):
            return False
        
        # Create a shared session for both requests
        session1 = requests.Session()
        session2 = requests.Session()
        
        # Copy cookies from authenticated session
        for cookie in self.session.cookies:
            session1.cookies.set_cookie(cookie)
            session2.cookies.set_cookie(cookie)
        
        # Set headers
        headers = {'Content-Type': 'application/json'}
        session1.headers.update(headers)
        session2.headers.update(headers)
        
        results = []
        
        def make_spin_request(session, request_id):
            try:
                response = session.post(f"{BASE_URL}/api/wheel/spin", json={})
                results.append({
                    'id': request_id,
                    'status': response.status_code,
                    'data': response.json() if response.status_code in [200, 429] else None
                })
            except Exception as e:
                results.append({
                    'id': request_id,
                    'status': 'error',
                    'error': str(e)
                })
        
        # Start two simultaneous requests
        thread1 = threading.Thread(target=make_spin_request, args=(session1, 1))
        thread2 = threading.Thread(target=make_spin_request, args=(session2, 2))
        
        thread1.start()
        thread2.start()
        
        thread1.join()
        thread2.join()
        
        # Analyze results
        successful_spins = [r for r in results if r.get('status') == 200 and r.get('data', {}).get('success')]
        cooldown_responses = [r for r in results if r.get('status') == 429]
        
        self.log(f"Request results: {len(results)} total")
        self.log(f"Successful spins: {len(successful_spins)}")
        self.log(f"Cooldown responses: {len(cooldown_responses)}")
        
        for result in results:
            self.log(f"Request {result['id']}: Status {result['status']}")
            if result.get('data'):
                self.log(f"  Success: {result['data'].get('success', 'N/A')}")
                self.log(f"  Error: {result['data'].get('error', 'None')}")
        
        # Should have at most 1 successful spin
        if len(successful_spins) <= 1:
            self.log("✅ Race condition protection working")
            return True
        else:
            self.log(f"❌ Race condition detected: {len(successful_spins)} successful spins", "ERROR")
            return False
    
    def test_next_spin_date_calculation(self, spin_result):
        """Test that nextSpinDate is correctly calculated (current date + 7 days)"""
        self.log("\n=== TEST: Next Spin Date Calculation ===")
        
        if not spin_result or not spin_result.get('nextSpinDate'):
            self.log("No spin result or nextSpinDate to test", "ERROR")
            return False
        
        try:
            next_spin_str = spin_result['nextSpinDate']
            # Parse the date (assuming ISO format)
            next_spin_date = datetime.fromisoformat(next_spin_str.replace('Z', '+00:00'))
            current_date = datetime.now()
            
            # Calculate expected date (7 days from now, allowing some tolerance)
            expected_min = current_date + timedelta(days=6, hours=23)  # 6d 23h
            expected_max = current_date + timedelta(days=7, hours=1)   # 7d 1h
            
            self.log(f"Current date: {current_date}")
            self.log(f"Next spin date: {next_spin_date}")
            self.log(f"Expected range: {expected_min} to {expected_max}")
            
            if expected_min <= next_spin_date <= expected_max:
                self.log("✅ Next spin date correctly calculated (7 days)")
                return True
            else:
                self.log("❌ Next spin date calculation incorrect", "ERROR")
                return False
                
        except Exception as e:
            self.log(f"Error parsing next spin date: {e}", "ERROR")
            return False
    
    def run_comprehensive_tests(self):
        """Run all wheel API tests"""
        self.log("🎡 Starting Wheel of Fortune v2.1 API Tests")
        self.log(f"Base URL: {BASE_URL}")
        
        test_results = {}
        
        # Test 1: Unauthorized access to status endpoint
        self.log("\n" + "="*60)
        test_results["status_unauthorized"] = self.test_wheel_status_unauthorized()
        
        # Test 2: Unauthorized access to spin endpoint
        self.log("\n" + "="*60)
        test_results["spin_unauthorized"] = self.test_wheel_spin_unauthorized()
        
        # Test 3: Check initial status for demo user (should be READY if never spun)
        self.log("\n" + "="*60)
        demo_status = self.test_wheel_status_authorized("demo")
        test_results["demo_status_check"] = demo_status is not None
        
        # Test 4: First spin for demo user (should succeed if canSpin is true)
        spin_result = None
        if demo_status and demo_status.get('canSpin'):
            self.log("\n" + "="*60)
            spin_result = self.test_wheel_spin_authorized("demo", expect_success=True)
            test_results["demo_first_spin"] = spin_result is not None and spin_result.get('success')
            
            # Test 5: Verify next spin date calculation
            if spin_result:
                self.log("\n" + "="*60)
                test_results["next_spin_date"] = self.test_next_spin_date_calculation(spin_result)
        else:
            self.log("\n" + "="*60)
            self.log("Demo user cannot spin (cooldown active), testing cooldown response")
            cooldown_result = self.test_wheel_spin_authorized("demo", expect_success=False)
            test_results["demo_cooldown_spin"] = cooldown_result is not None and cooldown_result.get('error') == 'COOLDOWN_ACTIVE'
        
        # Test 6: Check status after spin (should show COOLDOWN)
        self.log("\n" + "="*60)
        post_spin_status = self.test_wheel_status_authorized("demo", expected_state="COOLDOWN")
        test_results["post_spin_status"] = post_spin_status is not None
        
        # Test 7: Try to spin again during cooldown (should fail with 429)
        self.log("\n" + "="*60)
        cooldown_spin = self.test_wheel_spin_authorized("demo", expect_success=False)
        test_results["cooldown_enforcement"] = cooldown_spin is not None and cooldown_spin.get('error') == 'COOLDOWN_ACTIVE'
        
        # Test 8: Race condition protection
        self.log("\n" + "="*60)
        test_results["race_condition"] = self.test_race_condition_protection("admin")
        
        # Summary
        self.log("\n" + "="*60)
        self.log("🎯 WHEEL API TEST SUMMARY")
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
            self.log("🎉 All wheel API tests passed! System is working correctly.")
            return True
        else:
            self.log("⚠️ Some tests failed. Please check the logs above.")
            return False

def main():
    """Main test execution"""
    tester = WheelTester()
    
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