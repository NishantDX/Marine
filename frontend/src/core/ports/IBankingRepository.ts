/**
 * Port Interface: Banking Repository
 * Defines contract for banking operations (Article 20)
 */
import { BankingRecord, BankingSummary } from "../domain/ComplianceBalance";

export interface IBankingRepository {
  /**
   * Bank positive compliance balance
   */
  bankSurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<BankingSummary>;

  /**
   * Apply banked surplus to deficit
   */
  applySurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<BankingSummary>;

  /**
   * Get banking transaction records for a ship
   */
  getBankingRecords(shipId: string, year: number): Promise<BankingRecord[]>;
}
