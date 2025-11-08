import { Router } from "express";
import routeRoutes from "./route.routes";
import complianceRoutes from "./compliance.routes";
import bankingRoutes from "./banking.routes";
import poolingRoutes from "./pooling.routes";

const router = Router();

// Mount routes
router.use("/routes", routeRoutes);
router.use("/compliance", complianceRoutes);
router.use("/banking", bankingRoutes);
router.use("/pools", poolingRoutes);

export default router;
