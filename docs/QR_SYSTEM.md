# 🔐 QR System Documentation

## Overview

PANDA Lounge використовує захищену систему QR-кодів для підтвердження візитів та валідації промокодів. Система базується на підписаних токенах з TTL та захистом від replay-атак.

---

## 🏗️ Architecture

### Security Features

1. **HMAC-SHA256 Signature** - кожен QR код підписаний криптографічно
2. **TTL (Time To Live)** - автоматичне закінчення терміну дії (за замовчуванням 60 хв)
3. **Nonce** - унікальний ідентифікатор для кожного QR
4. **Anti-Replay Protection** - запобігає повторному використанню
5. **Role-Based Validation** - різні ролі мають різні права валідації

### QR Payload Structure

```typescript
{
  sub: string,      // Subject (призначення QR)
  type: string,     // 'visit' | 'promo' | 'referral' | 'staff_check'
  userId: string,   // ID користувача
  nonce: string,    // Унікальний ID (32 hex chars)
  iat: number,      // Issued at (Unix timestamp)
  exp: number       // Expires at (Unix timestamp)
}
```

### Token Format

```
<base64url_payload>.<base64url_signature>
```

Приклад:
```
eyJzdWIiOiJWaXNpdCBjb25maXJtYXRpb24iLCJ0eXBlIjoidmlzaXQiLCJ1c2VySWQiOiJjbHhvYWhucTQwMDAw...yM2VlNThhZmI4Mzg
```

---

## 📋 API Endpoints

### 1. Generate QR Code

**POST** `/api/qr/generate`

Generates a signed QR code for authenticated user.

#### Request

```json
{
  "type": "visit",              // Required: 'visit' | 'promo' | 'referral' | 'staff_check'
  "subject": "Visit QR",        // Optional: custom description
  "ttlMinutes": 60              // Optional: custom TTL (default from env)
}
```

#### Response (Success)

```json
{
  "success": true,
  "token": "eyJzdWIiOiJWaXNpdC...",
  "qrCodeDataUrl": "data:image/png;base64,...",
  "expiresAt": "2025-10-06T22:30:00.000Z",
  "type": "visit"
}
```

#### Response (Error)

```json
{
  "error": "Invalid QR type. Must be one of: visit, promo, referral, staff_check"
}
```

#### Authentication

Required: Yes (JWT session)

#### Permissions

- All authenticated users can generate `visit`, `promo`, `referral` types
- Only `admin` role can generate `staff_check` type

---

### 2. Validate QR Code

**POST** `/api/qr/validate`

Validates a QR code and logs the event (Staff/Admin only).

#### Request

```json
{
  "token": "eyJzdWIiOiJWaXNpdC..."
}
```

#### Response (Valid)

```json
{
  "valid": true,
  "payload": {
    "sub": "Visit confirmation",
    "type": "visit",
    "userId": "clxo...",
    "nonce": "a3f2...",
    "iat": 1696614000,
    "exp": 1696617600
  },
  "user": {
    "id": "clxo...",
    "name": "Demo User",
    "email": "demo@panda.com",
    "phone": "+380509876543",
    "role": "guest",
    "totalVisits": 15,
    "lastVisit": "2025-10-05T18:30:00.000Z"
  },
  "message": "✅ Візит підтверджено",
  "event_id": "evt_abc123"
}
```

#### Response (Invalid)

```json
{
  "valid": false,
  "error": "EXPIRED",
  "message": "QR код прострочений"
}
```

#### Error Codes

- `INVALID_FORMAT` - Невірний формат токена
- `INVALID_SIGNATURE` - Підпис не співпадає (можлива підробка)
- `EXPIRED` - QR код прострочений
- `ALREADY_USED` - QR код вже використано (replay attack detected)
- `REPLAY_ATTACK` - Спроба повторного використання
- `INSUFFICIENT_PERMISSIONS` - Недостатньо прав для валідації
- `USER_NOT_FOUND` - Користувач не знайдений

#### Authentication

Required: Yes (JWT session)

#### Permissions

- `staff` - can validate `visit` and `promo` types
- `admin` - can validate all types

---

### 3. Get QR Statistics

**GET** `/api/qr/stats`

Get validation statistics and recent events (Staff/Admin only).

#### Query Parameters

- `userId` (optional) - Filter by user ID
- `validatorId` (optional) - Filter by validator ID (admin only, staff see own automatically)
- `startDate` (optional) - Filter from date (ISO 8601)
- `endDate` (optional) - Filter to date (ISO 8601)

#### Response

```json
{
  "success": true,
  "stats": {
    "total": 150,
    "successful": 142,
    "failed": 8,
    "success_rate": "94.67",
    "by_type": [
      { "type": "visit", "count": 120 },
      { "type": "promo", "count": 22 },
      { "type": "referral", "count": 8 }
    ]
  },
  "recent": [
    {
      "id": "evt_123",
      "type": "visit",
      "subject": "Visit confirmation",
      "success": true,
      "error": null,
      "validated_at": "2025-10-06T20:15:00.000Z",
      "user": {
        "id": "user_456",
        "name": "Demo User",
        "email": "demo@panda.com"
      },
      "validator": {
        "id": "staff_789",
        "name": "Staff Member",
        "role": "staff"
      }
    }
  ]
}
```

---

## 🎨 UI Components

### QRDisplay Component

Location: `/app/components/QRDisplay.tsx`

**Usage:**

```tsx
import QRDisplay from '@/app/components/QRDisplay'

<QRDisplay type="visit" />
```

**Props:**

- `type` - QR type ('visit' | 'promo' | 'referral' | 'staff_check')

**Features:**

- Auto-generates QR on mount
- Real-time countdown timer
- Download QR as PNG
- Refresh QR button
- Visual expiration indicator
- Security badge (HMAC-SHA256)

---

### QRScanner Component

Location: `/app/components/QRScanner.tsx`

**Usage:**

```tsx
import QRScanner from '@/app/components/QRScanner'

<QRScanner />
```

**Features:**

- Manual token input
- Real-time validation
- Detailed user info display
- Visit statistics
- Error explanations
- Instructions for staff

---

## 🛣️ Pages

### User QR Page

**URL:** `/profile/qr`

**Access:** All authenticated users

**Features:**

- Display personal QR code
- Auto-refresh on expiration
- Download QR image
- Usage instructions
- Security information

---

### Staff Scanner Page

**URL:** `/scan`

**Access:** Staff and Admin only

**Features:**

- QR code scanner
- Token validation
- User information display
- Validation history
- Real-time feedback

---

## 🔧 Environment Variables

Add to `.env`:

```bash
# QR Code Security
QR_SECRET="your-secret-key-here"  # Min 32 bytes recommended
QR_TTL_MINUTES="60"                # Default TTL in minutes
```

**Generate secure secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🗄️ Database Schema

### QRValidationEvent Model

```prisma
model QRValidationEvent {
  id             String   @id @default(cuid())
  qr_type        String   // visit, promo, referral, staff_check
  qr_nonce       String   @unique // Prevents replay attacks
  qr_subject     String   // Description
  qr_issued_at   DateTime // When QR was generated
  qr_expires_at  DateTime // When QR expires
  user_id        String   // Owner of QR
  validator_id   String   // Who validated
  validated_at   DateTime @default(now())
  success        Boolean  // Success or fail
  error_message  String?  // Error if failed
  
  user      User @relation("qr_owner", fields: [user_id], references: [id])
  validator User @relation("qr_validator", fields: [validator_id], references: [id])
  
  @@index([qr_nonce])
  @@index([user_id])
  @@index([validator_id])
}
```

---

## 🔒 Security Best Practices

### For Production

1. **Strong QR_SECRET**: Use 32+ byte random secret

```bash
# Generate strong secret
openssl rand -base64 32
```

2. **HTTPS Only**: Never use QR system over HTTP in production

3. **Rate Limiting**: Implement rate limiting on validation endpoint

```typescript
// Example: Max 60 validations per minute per staff
app.use('/api/qr/validate', rateLimit({
  windowMs: 60 * 1000,
  max: 60
}))
```

4. **Audit Logging**: All validation events are logged in database

5. **Regular Secret Rotation**: Rotate QR_SECRET every 90 days

---

## 📊 Analytics

### Key Metrics to Track

1. **Success Rate**: Percentage of successful validations
2. **Popular QR Types**: Which QR types are most used
3. **Average Validation Time**: Time from QR generation to validation
4. **Replay Attempts**: Number of blocked replay attacks
5. **Expired QRs**: How many QRs expire before use

### Query Examples

```sql
-- Success rate by staff member
SELECT 
  validator_id,
  COUNT(*) as total,
  SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful,
  ROUND(SUM(CASE WHEN success THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as success_rate
FROM QRValidationEvent
GROUP BY validator_id;

-- Replay attack attempts
SELECT COUNT(*) as replay_attempts
FROM QRValidationEvent
WHERE success = false AND error_message = 'REPLAY_ATTACK';

-- Average time to validation
SELECT 
  AVG(JULIANDAY(validated_at) - JULIANDAY(qr_issued_at)) * 24 * 60 as avg_minutes
FROM QRValidationEvent
WHERE success = true;
```

---

## 🧪 Testing

### Unit Tests

```typescript
import { QRSystem } from '@/lib/qr-system'

describe('QR System', () => {
  it('should generate valid QR token', async () => {
    const token = await QRSystem.generateVisitQR('user-123')
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
  })

  it('should validate correct QR', async () => {
    const token = await QRSystem.generateVisitQR('user-123')
    const result = await QRSystem.validateQR(token, 'staff-456', 'staff')
    expect(result.valid).toBe(true)
  })

  it('should reject expired QR', async () => {
    const token = await QRSystem.generateQR({
      subject: 'test',
      type: 'visit',
      userId: 'user-123',
      ttlMinutes: -1 // Already expired
    })
    const result = await QRSystem.validateQR(token, 'staff-456', 'staff')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('EXPIRED')
  })

  it('should prevent replay attacks', async () => {
    const token = await QRSystem.generateVisitQR('user-123')
    
    // First validation - should succeed
    const result1 = await QRSystem.validateQR(token, 'staff-456', 'staff')
    expect(result1.valid).toBe(true)
    
    // Second validation - should fail (replay)
    const result2 = await QRSystem.validateQR(token, 'staff-456', 'staff')
    expect(result2.valid).toBe(false)
    expect(result2.error).toBe('ALREADY_USED')
  })
})
```

---

## 🚀 Future Enhancements

1. **Camera Scanning**: Integrate WebRTC for direct QR scanning
2. **Push Notifications**: Notify users when their QR is scanned
3. **Geolocation**: Validate QR only at venue location
4. **Dynamic TTL**: Adjust TTL based on user behavior
5. **Multi-use QRs**: Support for limited multi-use QRs (e.g., season passes)
6. **QR Templates**: Pre-defined QR types with custom rules
7. **Fraud Detection**: ML-based anomaly detection

---

## 📞 Support

For issues or questions about the QR system:

- Check logs: `/var/log/app/qr-system.log`
- Database events: `QRValidationEvent` table
- Contact: dev@pandalounge.com

---

**Last Updated:** October 6, 2025  
**Version:** 1.0.0  
**Author:** PANDA Development Team
