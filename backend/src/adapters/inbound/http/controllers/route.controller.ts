import { Request, Response } from "express";
import { GetAllRoutesUseCase } from "../../../../core/application/use-cases/route/GetAllRoutes.usecase";
import { SetBaselineUseCase } from "../../../../core/application/use-cases/route/SetBaseline.usecase";
import { GetComparisonUseCase } from "../../../../core/application/use-cases/route/GetComparison.usecase";
import { RouteRepository } from "../../../outbound/postgres/repositories/RouteRepository";
import { ApiResponse } from "../../../../shared/types/common.types";

const routeRepository = new RouteRepository();

export class RouteController {
  /**
   * GET /routes
   * Get all routes with optional filters
   */
  static async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
      const { vesselType, fuelType, year } = req.query;

      const useCase = new GetAllRoutesUseCase(routeRepository);
      const routes = await useCase.execute({
        vesselType: vesselType as any,
        fuelType: fuelType as any,
        year: year ? parseInt(year as string) : undefined,
      });

      const response: ApiResponse<any> = {
        success: true,
        data: routes.map((r) => r.toJSON()),
        message: "Routes retrieved successfully",
      };

      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * POST /routes/:routeId/baseline
   * Set a route as baseline
   */
  static async setBaseline(req: Request, res: Response): Promise<void> {
    try {
      const { routeId } = req.params;

      const useCase = new SetBaselineUseCase(routeRepository);
      const route = await useCase.execute(routeId);

      const response: ApiResponse<any> = {
        success: true,
        data: route.toJSON(),
        message: "Baseline set successfully",
      };

      res.json(response);
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * GET /routes/comparison
   * Get comparison data between baseline and comparison routes
   * Query params:
   * - baselineId (optional): specific baseline route ID, or uses the route marked as baseline
   * - comparisonId (optional): specific route to compare, or compares all non-baseline routes
   */
  static async getComparison(req: Request, res: Response): Promise<void> {
    try {
      const { baselineId, comparisonId } = req.query;

      const useCase = new GetComparisonUseCase(routeRepository);
      const result = await useCase.execute({
        baselineId: baselineId as string | undefined,
        comparisonId: comparisonId as string | undefined,
      });

      const response: ApiResponse<any> = {
        success: true,
        data: result,
        message: "Comparison data retrieved successfully",
      };

      res.json(response);
    } catch (error: any) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }
}
