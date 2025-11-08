import { Request, Response } from "express";
import { BankSurplusUseCase } from "../../../../core/application/use-cases/banking/BankSurplus.usecase";
import { ApplyBankedUseCase } from "../../../../core/application/use-cases/banking/ApplyBanked.usecase";
import { GetBankRecordsUseCase } from "../../../../core/application/use-cases/banking/GetBankRecords.usecase";
import { ShipComplianceRepository } from "../../../outbound/postgres/repositories/ShipComplianceRepository";
import { BankEntryRepository } from "../../../outbound/postgres/repositories/BankEntryRepository";
import { ApiResponse } from "../../../../shared/types/common.types";

const shipComplianceRepository = new ShipComplianceRepository();
const bankEntryRepository = new BankEntryRepository();

export class BankingController {
  /**
   * GET /banking/records?shipId=XXX&year=YYYY
   * Get all bank records for a ship
   */
  static async getBankRecords(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        res.status(400).json({
          success: false,
          error: "shipId and year are required",
        });
        return;
      }

      const useCase = new GetBankRecordsUseCase(bankEntryRepository);
      const records = await useCase.execute(
        shipId as string,
        parseInt(year as string)
      );

      const response: ApiResponse<any> = {
        success: true,
        data: records.map((r) => r.toJSON()),
        message: "Bank records retrieved successfully",
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
   * POST /banking/bank
   * Bank positive CB
   */
  static async bankSurplus(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year } = req.body;

      if (!shipId || !year) {
        res.status(400).json({
          success: false,
          error: "shipId and year are required",
        });
        return;
      }

      const useCase = new BankSurplusUseCase(
        shipComplianceRepository,
        bankEntryRepository
      );
      const bankEntry = await useCase.execute(shipId, year);

      const response: ApiResponse<any> = {
        success: true,
        data: bankEntry.toJSON(),
        message: "Surplus banked successfully",
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
   * POST /banking/apply
   * Apply banked surplus to deficit
   */
  static async applyBanked(req: Request, res: Response): Promise<void> {
    try {
      const { shipId, year, amount } = req.body;

      if (!shipId || !year || !amount) {
        res.status(400).json({
          success: false,
          error: "shipId, year, and amount are required",
        });
        return;
      }

      const useCase = new ApplyBankedUseCase(
        shipComplianceRepository,
        bankEntryRepository
      );
      const result = await useCase.execute(shipId, year, amount);

      const response: ApiResponse<any> = {
        success: true,
        data: result,
        message: "Banked surplus applied successfully",
      };

      res.json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}
