import { Router } from "express";
import { BankingController } from "../controllers/banking.controller";

const router = Router();

// GET /banking/records - Get bank records
router.get("/records", BankingController.getBankRecords);

// POST /banking/bank - Bank surplus
router.post("/bank", BankingController.bankSurplus);

// POST /banking/apply - Apply banked
router.post("/apply", BankingController.applyBanked);

export default router;
