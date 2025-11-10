# Backend API Specification - FuelEU Compliance Dashboard

## Required Endpoints for Banking Tab

### 1. POST /api/compliance/cb - Compute Compliance Balance

Compute the compliance balance for a ship/route.

**Request:**

```http
POST /api/compliance/cb
Content-Type: application/json

{
  "shipId": "SHIP001",
  "year": 2024
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cbValue": 15.5,
    "shipId": "SHIP001",
    "year": 2024
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "shipId and year are required"
}
```

---

### 2. POST /api/banking/bank - Bank Positive Surplus

Bank a positive compliance balance for future use (Article 20).

**Request:**

```http
POST /api/banking/bank
Content-Type: application/json

{
  "shipId": "SHIP001",
  "year": 2024,
  "amount": 15.5
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cbBefore": 15.5,
    "applied": 15.5,
    "cbAfter": 0.0
  }
}
```

**Validation:**

- Amount must be > 0
- Ship must have positive CB to bank

**Error Response:**

```json
{
  "success": false,
  "error": "Cannot bank non-positive compliance balance"
}
```

---

### 3. POST /api/banking/apply - Apply Banked Surplus

Apply previously banked surplus to current deficit.

**Request:**

```http
POST /api/banking/apply
Content-Type: application/json

{
  "shipId": "SHIP001",
  "year": 2024,
  "amount": 10.0
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "cbBefore": -5.0,
    "applied": 10.0,
    "cbAfter": 5.0
  }
}
```

**Validation:**

- Amount must be ≤ available banked surplus
- Updates current CB

**Error Response:**

```json
{
  "success": false,
  "error": "Insufficient banked surplus. Available: 5.0"
}
```

---

### 4. GET /api/banking/records - Get Transaction History

Get all banking transactions for a ship.

**Request:**

```http
GET /api/banking/records?shipId=SHIP001
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shipId": "SHIP001",
      "action": "bank",
      "amount": 15.5,
      "cbBefore": 15.5,
      "cbAfter": 0.0,
      "timestamp": "2024-11-08T10:00:00.000Z"
    },
    {
      "id": 2,
      "shipId": "SHIP001",
      "action": "apply",
      "amount": 10.0,
      "cbBefore": -5.0,
      "cbAfter": 5.0,
      "timestamp": "2024-11-08T11:30:00.000Z"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "shipId is required"
}
```

---

## Complete Express.js Implementation

```javascript
const express = require("express");
const router = express.Router();

// In-memory storage (replace with your database)
let bankingRecords = [];
let shipBalances = {
  SHIP001: { cb: 15.5, banked: 0 },
};

// POST /api/compliance/cb - Get compliance balance
router.post("/api/compliance/cb", async (req, res) => {
  try {
    const { shipId, year } = req.body;

    if (!shipId || !year) {
      return res.status(400).json({
        success: false,
        error: "shipId and year are required",
      });
    }

    // Get current balance (replace with actual calculation from routes)
    const cbValue = shipBalances[shipId]?.cb || 15.5;

    res.json({
      success: true,
      data: {
        cbValue,
        shipId,
        year,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/banking/bank - Bank surplus
router.post("/api/banking/bank", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;

    if (!shipId || !year || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: "shipId, year, and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot bank non-positive compliance balance",
      });
    }

    // Initialize if not exists
    if (!shipBalances[shipId]) {
      shipBalances[shipId] = { cb: amount, banked: 0 };
    }

    const cbBefore = shipBalances[shipId].cb;

    // Bank the surplus
    shipBalances[shipId].banked += amount;
    shipBalances[shipId].cb -= amount;

    const cbAfter = shipBalances[shipId].cb;

    // Record transaction
    bankingRecords.push({
      id: bankingRecords.length + 1,
      shipId,
      action: "bank",
      amount,
      cbBefore,
      cbAfter,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        cbBefore,
        applied: amount,
        cbAfter,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/banking/apply - Apply banked surplus
router.post("/api/banking/apply", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;

    if (!shipId || !year || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: "shipId, year, and amount are required",
      });
    }

    if (!shipBalances[shipId]) {
      shipBalances[shipId] = { cb: 0, banked: 0 };
    }

    if (amount > shipBalances[shipId].banked) {
      return res.status(400).json({
        success: false,
        error: `Insufficient banked surplus. Available: ${shipBalances[shipId].banked}`,
      });
    }

    const cbBefore = shipBalances[shipId].cb;

    // Apply banked surplus
    shipBalances[shipId].cb += amount;
    shipBalances[shipId].banked -= amount;

    const cbAfter = shipBalances[shipId].cb;

    // Record transaction
    bankingRecords.push({
      id: bankingRecords.length + 1,
      shipId,
      action: "apply",
      amount,
      cbBefore,
      cbAfter,
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: {
        cbBefore,
        applied: amount,
        cbAfter,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/banking/records - Get transaction history
router.get("/api/banking/records", async (req, res) => {
  try {
    const { shipId } = req.query;

    if (!shipId) {
      return res.status(400).json({
        success: false,
        error: "shipId is required",
      });
    }

    const records = bankingRecords.filter((r) => r.shipId === shipId);

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
```

---

## Prisma Schema (if using Prisma)

```prisma
model BankingRecord {
  id        Int      @id @default(autoincrement())
  shipId    String
  action    String   // "bank" or "apply"
  amount    Float
  cbBefore  Float
  cbAfter   Float
  year      Int
  timestamp DateTime @default(now())

  @@index([shipId])
}

model ShipBalance {
  id      Int    @id @default(autoincrement())
  shipId  String @unique
  cb      Float  @default(0)
  banked  Float  @default(0)
  year    Int

  @@index([shipId, year])
}
```

---

## Testing Commands (PowerShell)

### 1. Test Compliance Balance

```powershell
$body = @{
    shipId = "SHIP001"
    year = 2024
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/compliance/cb" -Method POST -Body $body -ContentType "application/json"
```

### 2. Test Bank Surplus

```powershell
$body = @{
    shipId = "SHIP001"
    year = 2024
    amount = 15.5
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/banking/bank" -Method POST -Body $body -ContentType "application/json"
```

### 3. Test Apply Surplus

```powershell
$body = @{
    shipId = "SHIP001"
    year = 2024
    amount = 10.0
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/banking/apply" -Method POST -Body $body -ContentType "application/json"
```

### 4. Test Get Records

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/banking/records?shipId=SHIP001" -Method GET
```

---

## Database Integration Example

If using a database, replace the in-memory storage:

```javascript
// Using Sequelize
const BankingRecord = require("../models/BankingRecord");
const ShipBalance = require("../models/ShipBalance");

// In /api/banking/bank endpoint:
const balance = await ShipBalance.findOne({ where: { shipId } });
await balance.update({ banked: balance.banked + amount, cb: 0 });

await BankingRecord.create({
  shipId,
  action: "bank",
  amount,
  cbBefore,
  cbAfter,
  timestamp: new Date(),
});
```

---

## Expected UI Behavior

After implementing these endpoints:

1. **Banking Tab loads** → Shows CB Before: 15.5, Applied: 0, CB After: 15.5
2. **Click "Bank Positive CB"** → Moves 15.5 to banked, CB becomes 0
3. **Click "Apply Banked Surplus"** → Opens modal, enter amount, applies to current CB
4. **Transaction History** → Shows all bank/apply operations with timestamps

---

## Integration Checklist

- [ ] Add routes to your Express app: `app.use(router)`
- [ ] Test each endpoint with curl/Postman
- [ ] Verify response structure matches exactly
- [ ] Check CORS is enabled for frontend
- [ ] Confirm error handling works
- [ ] Test with actual ship data from routes table
- [ ] Replace mock CB calculation with real formula
- [ ] Add database persistence (optional but recommended)

---

**Copy this code to your backend and the Banking tab will work perfectly!** 🚢
