import { Request, Response } from "express";
import { ComputeCBUseCase } from "../../../../core/application/use-cases/compliance/ComputeCB.usecase";
import { GetAdjustedCBUseCase } from "../../../../core/application/use-cases/compliance/GetAdjustedCB.usecase";
import { ShipComplianceRepository } from "../../../outbound/postgres/repositories/ShipComplianceRepository";
import { RouteRepository } from "../../../outbound/postgres/repositories/RouteRepository";
import { BankEntryRepository } from "../../../outbound/postgres/repositories/BankEntryRepository";
import { ApiResponse } from "../../../../shared/types/common.types";

const shipComplianceRepository = new ShipComplianceRepository();
const routeRepository = new RouteRepository();
const bankEntryRepository = new BankEntryRepository();

export class ComplianceController {
  /**
   * POST /compliance/cb
   * Compute and get compliance balance
   */
  static async getComplianceBalance(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { shipId, year } = req.body;

      if (!shipId || !year) {
        res.status(400).json({
          success: false,
          error: "shipId and year are required",
        });
        return;
      }

      const yearNum = parseInt(year as string);

      const useCase = new ComputeCBUseCase(
        shipComplianceRepository,
        routeRepository
      );
      const compliance = await useCase.execute(shipId as string, yearNum);

      // Determine if this is historical data (pre-compliance period)
      const isHistorical = yearNum < 2025;

      const response: ApiResponse<any> = {
        success: true,
        data: {
          cbValue: compliance.cbGco2eq,
          shipId: compliance.shipId,
          year: compliance.year,
          isHistorical,
        },
        message: isHistorical
          ? "Historical compliance data retrieved"
          : "Compliance balance computed successfully",
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
   * GET /compliance/adjusted-cb?shipId=XXX&year=YYYY
   * Get adjusted compliance balance (CB + banked)
   */
  static async getAdjustedCB(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        res.status(400).json({
          success: false,
          error: "shipId and year are required",
        });
        return;
      }

      const useCase = new GetAdjustedCBUseCase(
        shipComplianceRepository,
        bankEntryRepository
      );
      const adjustedCB = await useCase.execute(
        shipId as string,
        parseInt(year as string)
      );

      const response: ApiResponse<any> = {
        success: true,
        data: { adjustedCB },
        message: "Adjusted CB retrieved successfully",
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
   * GET /compliance/cb-all?year=YYYY
   * Get compliance balance for ALL ships in a specific year
   */
  static async getAllComplianceByYear(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { year } = req.query;

      if (!year) {
        res.status(400).json({
          success: false,
          error: "year is required",
        });
        return;
      }

      const yearNum = parseInt(year as string);

      // Get all compliance records for the year
      const allCompliance = await shipComplianceRepository.findByYear(yearNum);

      // Determine if this is historical data
      const isHistorical = yearNum < 2025;

      const response: ApiResponse<any> = {
        success: true,
        data: {
          year: yearNum,
          isHistorical,
          ships: allCompliance.map((c) => ({
            shipId: c.shipId,
            cbValue: c.cbGco2eq,
            hasSurplus: c.hasSurplus(),
            hasDeficit: c.hasDeficit(),
          })),
        },
        message: `Retrieved compliance data for ${allCompliance.length} ships in ${yearNum}`,
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
