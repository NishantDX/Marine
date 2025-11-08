import { Router } from "express";
import { ComplianceController } from "../controllers/compliance.controller";

const router = Router();

// POST /compliance/cb - Compute compliance balance
router.post("/cb", ComplianceController.getComplianceBalance);

// GET /compliance/adjusted-cb - Get adjusted CB
router.get("/adjusted-cb", ComplianceController.getAdjustedCB);

export default router;
