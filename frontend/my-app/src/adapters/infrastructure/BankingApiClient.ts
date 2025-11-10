/**
 * Infrastructure Adapter: Banking API Client
 * Implements IBankingRepository using REST API
 */
import { IBankingRepository } from "@/src/core/ports/IBankingRepository";
import {
  BankingRecord,
  BankingSummary,
} from "@/src/core/domain/ComplianceBalance";
import { apiFetch, API_ENDPOINTS } from "@/src/shared/utils/api";

export class BankingApiClient implements IBankingRepository {
  async bankSurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<BankingSummary> {
    console.log("[BankingApiClient] bankSurplus called with:", {
      shipId,
      year,
      amount,
    });
    try {
      const response = await apiFetch<{
        success: boolean;
        data: BankingSummary;
      }>(API_ENDPOINTS.BANK_SURPLUS, {
        method: "POST",
        body: JSON.stringify({ shipId, year, amount }),
      });
      console.log("[BankingApiClient] bankSurplus response:", response);
      return response.data;
    } catch (error) {
      console.error("[BankingApiClient] bankSurplus error:", error);
      throw error;
    }
  }

  async applySurplus(
    shipId: string,
    year: number,
    amount: number
  ): Promise<BankingSummary> {
    console.log("[BankingApiClient] applySurplus called with:", {
      shipId,
      year,
      amount,
    });
    try {
      const response = await apiFetch<{
        success: boolean;
        data: BankingSummary;
      }>(API_ENDPOINTS.APPLY_SURPLUS, {
        method: "POST",
        body: JSON.stringify({ shipId, year, amount }),
      });
      console.log("[BankingApiClient] applySurplus response:", response);
      return response.data;
    } catch (error) {
      console.error("[BankingApiClient] applySurplus error:", error);
      throw error;
    }
  }

  async getBankingRecords(
    shipId: string,
    year: number
  ): Promise<BankingRecord[]> {
    console.log("[BankingApiClient] getBankingRecords called with:", {
      shipId,
      year,
    });
    const params = new URLSearchParams({ shipId, year: year.toString() });
    const url = `${API_ENDPOINTS.BANKING_RECORDS}?${params.toString()}`;
    console.log("[BankingApiClient] Request URL:", url);

    try {
      const response = await apiFetch<{
        success: boolean;
        data: BankingRecord[];
      }>(url);
      console.log("[BankingApiClient] getBankingRecords response:", response);
      return response.data;
    } catch (error) {
      console.error("[BankingApiClient] getBankingRecords error:", error);
      throw error;
    }
  }
}
