/**
 * Port Interface: Compliance Repository
 * Defines contract for compliance balance operations
 */
import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from "../domain/ComplianceBalance";

export interface IComplianceRepository {
  /**
   * Compute compliance balance for a ship and year
   */
  computeComplianceBalance(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance>;

  /**
   * Get adjusted compliance balance for a ship
   */
  getAdjustedComplianceBalance(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance>;

  /**
   * Get all ships with their adjusted CB for a year (for pooling)
   */
  getAllAdjustedComplianceBalances(
    year: number
  ): Promise<AdjustedComplianceBalance[]>;
}
