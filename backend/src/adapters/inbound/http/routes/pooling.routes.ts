import { Router } from "express";
import { PoolingController } from "../controllers/pooling.controller";

const router = Router();

// POST /pools - Create pool
router.post("/", PoolingController.createPool);

// GET /pools - Get pools by year
router.get("/", PoolingController.getPoolsByYear);

export default router;
