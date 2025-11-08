import { Request, Response } from "express";
import { CreatePoolUseCase } from "../../../../core/application/use-cases/pooling/CreatePool.usecase";
import { ShipComplianceRepository } from "../../../outbound/postgres/repositories/ShipComplianceRepository";
import { PoolRepository } from "../../../outbound/postgres/repositories/PoolRepository";
import { PoolAllocationService } from "../../../../core/application/services/PoolAllocation.service";
import { ApiResponse } from "../../../../shared/types/common.types";

const shipComplianceRepository = new ShipComplianceRepository();
const poolRepository = new PoolRepository();
const allocationService = new PoolAllocationService();

export class PoolingController {
  /**
   * POST /pools
   * Create a new pool with members
   */
  static async createPool(req: Request, res: Response): Promise<void> {
    try {
      const { year, shipIds } = req.body;

      if (!year || !shipIds || !Array.isArray(shipIds)) {
        res.status(400).json({
          success: false,
          error: "year and shipIds (array) are required",
        });
        return;
      }

      const useCase = new CreatePoolUseCase(
        poolRepository,
        shipComplianceRepository,
        allocationService
      );

      const pool = await useCase.execute({ year, shipIds });

      const response: ApiResponse<any> = {
        success: true,
        data: pool.toJSON(),
        message: "Pool created successfully",
      };

      res.status(201).json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /pools?year=YYYY
   * Get all pools for a year
   */
  static async getPoolsByYear(req: Request, res: Response): Promise<void> {
    try {
      const { year } = req.query;

      if (!year) {
        res.status(400).json({
          success: false,
          error: "year is required",
        });
        return;
      }

      const pools = await poolRepository.findByYear(parseInt(year as string));

      const response: ApiResponse<any> = {
        success: true,
        data: pools.map((p) => p.toJSON()),
        message: "Pools retrieved successfully",
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
}
