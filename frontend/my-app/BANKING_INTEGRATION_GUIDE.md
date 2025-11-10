# Banking Tab Integration Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Copy Backend Code

Copy the file `backend-banking-routes.js` to your backend project:

```
your-backend/
  └── routes/
      └── banking.js  ← Copy backend-banking-routes.js here
```

### Step 2: Import in Main Server

Add to your main server file (e.g., `server.js` or `index.js`):

```javascript
const bankingRoutes = require("./routes/banking");

// ... after app initialization
app.use(bankingRoutes);
```

### Step 3: Test Endpoints

Run the test script:

```powershell
.\test-banking-api.ps1
```

Or test manually:

```powershell
# Quick test
Invoke-RestMethod -Uri "http://localhost:5000/api/compliance/cb" -Method POST -Body '{"shipId":"SHIP001","year":2024}' -ContentType "application/json"
```

### Step 4: Verify Frontend

1. Open browser: http://localhost:3000
2. Navigate to **Banking tab**
3. Should see:
   - ✅ CB Before: 15.5 MJ
   - ✅ Applied: 0 MJ
   - ✅ CB After: 15.5 MJ
   - ✅ "Bank Positive CB" button enabled
   - ✅ "Apply Banked Surplus" button enabled

---

## 📋 What Was Created

### 1. `BACKEND_API_SPEC.md`

Complete API documentation with:

- Endpoint specifications
- Request/response examples
- Validation rules
- Database integration examples (Sequelize, Prisma)
- Testing commands

### 2. `backend-banking-routes.js`

Ready-to-use Express router with:

- ✅ 4 endpoints implemented
- ✅ Input validation
- ✅ Error handling
- ✅ In-memory storage (easily replaceable with DB)
- ✅ Comments for DB integration

### 3. `test-banking-api.ps1`

PowerShell test suite:

- ✅ Tests all 4 endpoints
- ✅ Colored output (green = success, red = error)
- ✅ JSON pretty-printing

### 4. `TEST_COMMANDS.md`

Quick reference with:

- ✅ PowerShell one-liners
- ✅ cURL commands
- ✅ Expected responses

---

## 🔄 Database Integration (Optional)

### Using Sequelize

```javascript
const { BankingRecord, ShipBalance } = require("../models");

// In /api/banking/bank:
const balance = await ShipBalance.findOne({ where: { shipId } });
await balance.update({ banked: balance.banked + amount, cb: 0 });

await BankingRecord.create({
  shipId,
  action: "bank",
  amount,
  cbBefore,
  cbAfter,
});
```

### Using Prisma

```javascript
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// In /api/banking/bank:
await prisma.shipBalance.update({
  where: { shipId },
  data: { banked: { increment: amount }, cb: 0 },
});

await prisma.bankingRecord.create({
  data: { shipId, action: "bank", amount, cbBefore, cbAfter },
});
```

### Using MongoDB/Mongoose

```javascript
const BankingRecord = require("../models/BankingRecord");
const ShipBalance = require("../models/ShipBalance");

// In /api/banking/bank:
const balance = await ShipBalance.findOne({ shipId });
balance.banked += amount;
balance.cb = 0;
await balance.save();

await BankingRecord.create({
  shipId,
  action: "bank",
  amount,
  cbBefore,
  cbAfter,
});
```

---

## ✅ Verification Checklist

- [ ] Backend routes added to server
- [ ] Server restarted
- [ ] All 4 endpoints return 200 OK
- [ ] Response structure matches spec
- [ ] CORS enabled for http://localhost:3000
- [ ] Frontend Banking tab loads without errors
- [ ] KPI cards show values (15.5, 0, 15.5)
- [ ] "Bank Positive CB" button clickable
- [ ] "Apply Banked Surplus" shows modal
- [ ] Transaction history table renders

---

## 🐛 Troubleshooting

### Error: "Route not found" (404)

- ✅ Check routes are imported in main server file
- ✅ Restart backend server
- ✅ Verify endpoint path: `/api/banking/bank` not `/banking/bank`

### Error: "CORS policy" in browser

```javascript
// Add to server.js
const cors = require("cors");
app.use(cors());
```

### Error: "shipId is required" (400)

- ✅ Check request body format
- ✅ Verify Content-Type header is `application/json`
- ✅ Use Invoke-RestMethod (not curl) in PowerShell

### Banking tab shows "Error: HTTP 400"

- ✅ Check frontend is sending correct `shipId: "SHIP001"`
- ✅ Verify backend validation logic
- ✅ Check browser DevTools Network tab for actual request

---

## 📞 Next Steps

1. **Copy backend files** to your backend project
2. **Import routes** in server.js
3. **Run tests** with `.\test-banking-api.ps1`
4. **Open frontend** and test Banking tab
5. **Replace in-memory storage** with your database (optional)

---

## 💡 Pro Tips

- Use the test script to verify backend before testing UI
- Check browser DevTools → Network tab for API errors
- Start with in-memory storage, add DB later
- Keep `shipId: "SHIP001"` consistent until you add ship selection UI
- Transaction history is optional but nice to have

---

**You now have everything needed to implement the Banking tab!** 🚢

Just copy `backend-banking-routes.js` to your backend and import it. That's it!
