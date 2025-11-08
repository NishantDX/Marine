import { Router } from "express";
import { RouteController } from "../controllers/route.controller";

const router = Router();

// GET /routes - Get all routes
router.get("/", RouteController.getAllRoutes);

// GET /routes/comparison - Get comparison data
router.get("/comparison", RouteController.getComparison);

// POST /routes/:routeId/baseline - Set baseline
router.post("/:routeId/baseline", RouteController.setBaseline);

export default router;
