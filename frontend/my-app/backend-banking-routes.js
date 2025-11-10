/**
 * Backend Banking Routes - Express.js
 * Copy this file to your backend and import it in your main server file
 *
 * Usage in server.js:
 *   const bankingRoutes = require('./routes/banking');
 *   app.use(bankingRoutes);
 */

const express = require("express");
const router = express.Router();

// ========================================
// IN-MEMORY STORAGE (Replace with your DB)
// ========================================
let bankingRecords = [];
let shipBalances = {
  SHIP001: { cb: 15.5, banked: 0 },
};

// ========================================
// 1. POST /api/compliance/cb
// Compute Compliance Balance
// ========================================
router.post("/api/compliance/cb", async (req, res) => {
  try {
    const { shipId, year } = req.body;

    if (!shipId || !year) {
      return res.status(400).json({
        success: false,
        error: "shipId and year are required",
      });
    }

    // TODO: Replace with actual CB calculation from routes
    // Example: Calculate from route GHG intensity vs target
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
    console.error("Error computing CB:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// 2. POST /api/banking/bank
// Bank Positive Surplus (Article 20)
// ========================================
router.post("/api/banking/bank", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;

    // Validation
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

    // Initialize ship balance if doesn't exist
    if (!shipBalances[shipId]) {
      shipBalances[shipId] = { cb: amount, banked: 0 };
    }

    const cbBefore = shipBalances[shipId].cb;

    // Bank the surplus
    shipBalances[shipId].banked += amount;
    shipBalances[shipId].cb -= amount;

    const cbAfter = shipBalances[shipId].cb;

    // Record transaction
    const record = {
      id: bankingRecords.length + 1,
      shipId,
      action: "bank",
      amount,
      cbBefore,
      cbAfter,
      timestamp: new Date().toISOString(),
    };
    bankingRecords.push(record);

    // TODO: Save to database
    // await BankingRecord.create(record);
    // await ShipBalance.update({ banked, cb }, { where: { shipId } });

    res.json({
      success: true,
      data: {
        cbBefore,
        applied: amount,
        cbAfter,
      },
    });
  } catch (error) {
    console.error("Error banking surplus:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// 3. POST /api/banking/apply
// Apply Banked Surplus
// ========================================
router.post("/api/banking/apply", async (req, res) => {
  try {
    const { shipId, year, amount } = req.body;

    // Validation
    if (!shipId || !year || amount === undefined) {
      return res.status(400).json({
        success: false,
        error: "shipId, year, and amount are required",
      });
    }

    // Initialize if doesn't exist
    if (!shipBalances[shipId]) {
      shipBalances[shipId] = { cb: 0, banked: 0 };
    }

    // Check if sufficient banked surplus available
    if (amount > shipBalances[shipId].banked) {
      return res.status(400).json({
        success: false,
        error: `Insufficient banked surplus. Available: ${shipBalances[shipId].banked}`,
      });
    }

    const cbBefore = shipBalances[shipId].cb;

    // Apply banked surplus to current CB
    shipBalances[shipId].cb += amount;
    shipBalances[shipId].banked -= amount;

    const cbAfter = shipBalances[shipId].cb;

    // Record transaction
    const record = {
      id: bankingRecords.length + 1,
      shipId,
      action: "apply",
      amount,
      cbBefore,
      cbAfter,
      timestamp: new Date().toISOString(),
    };
    bankingRecords.push(record);

    // TODO: Save to database
    // await BankingRecord.create(record);
    // await ShipBalance.update({ banked, cb }, { where: { shipId } });

    res.json({
      success: true,
      data: {
        cbBefore,
        applied: amount,
        cbAfter,
      },
    });
  } catch (error) {
    console.error("Error applying surplus:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// 4. GET /api/banking/records
// Get Transaction History
// ========================================
router.get("/api/banking/records", async (req, res) => {
  try {
    const { shipId } = req.query;

    if (!shipId) {
      return res.status(400).json({
        success: false,
        error: "shipId is required",
      });
    }

    // Filter records by shipId
    const records = bankingRecords.filter((r) => r.shipId === shipId);

    // TODO: Replace with database query
    // const records = await BankingRecord.findAll({ where: { shipId } });

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("Error fetching records:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// ========================================
// DATABASE INTEGRATION EXAMPLE (Sequelize)
// ========================================
/*
const { BankingRecord, ShipBalance } = require('../models');

// In bank endpoint:
const balance = await ShipBalance.findOne({ where: { shipId, year } });
if (!balance) {
  return res.status(404).json({ success: false, error: 'Ship not found' });
}

await balance.update({ 
  banked: balance.banked + amount, 
  cb: balance.cb - amount 
});

await BankingRecord.create({
  shipId,
  year,
  action: 'bank',
  amount,
  cbBefore,
  cbAfter,
});
*/

// ========================================
// DATABASE INTEGRATION EXAMPLE (Prisma)
// ========================================
/*
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// In bank endpoint:
const balance = await prisma.shipBalance.findUnique({
  where: { shipId_year: { shipId, year } }
});

await prisma.shipBalance.update({
  where: { id: balance.id },
  data: {
    banked: { increment: amount },
    cb: { decrement: amount }
  }
});

await prisma.bankingRecord.create({
  data: {
    shipId,
    year,
    action: 'bank',
    amount,
    cbBefore,
    cbAfter
  }
});
*/

module.exports = router;
