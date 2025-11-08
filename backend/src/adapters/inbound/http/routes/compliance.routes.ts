import { Router } from "express";
import { ComplianceController } from "../controllers/compliance.controller";

const router = Router();

// GET /compliance/cb - Get compliance balance
router.get("/cb", ComplianceController.getComplianceBalance);

// GET /compliance/adjusted-cb - Get adjusted CB
router.get("/adjusted-cb", ComplianceController.getAdjustedCB);

export default router;
