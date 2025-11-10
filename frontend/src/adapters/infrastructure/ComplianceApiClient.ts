/**
 * Infrastructure Adapter: Compliance API Client
 * Implements IComplianceRepository using REST API
 */
import { IComplianceRepository } from "@/src/core/ports/IComplianceRepository";
import {
  ComplianceBalance,
  AdjustedComplianceBalance,
} from "@/src/core/domain/ComplianceBalance";
import { apiFetch, API_ENDPOINTS } from "@/src/shared/utils/api";

export class ComplianceApiClient implements IComplianceRepository {
  async computeComplianceBalance(
    shipId: string,
    year: number
  ): Promise<ComplianceBalance> {
    console.log("[ComplianceApiClient] computeComplianceBalance called with:", {
      shipId,
      year,
    });
    console.log("[ComplianceApiClient] Endpoint:", API_ENDPOINTS.COMPUTE_CB);
    console.log(
      "[ComplianceApiClient] Request body:",
      JSON.stringify({ shipId, year })
    );

    try {
      const response = await apiFetch<{
        success: boolean;
        data: ComplianceBalance;
      }>(API_ENDPOINTS.COMPUTE_CB, {
        method: "POST",
        body: JSON.stringify({ shipId, year }),
      });
      console.log("[ComplianceApiClient] Response received:", response);
      console.log("[ComplianceApiClient] Extracted data:", response.data);
      return response.data;
    } catch (error) {
      console.error("[ComplianceApiClient] Error occurred:", error);
      throw error;
    }
  }

  async getAdjustedComplianceBalance(
    shipId: string,
    year: number
  ): Promise<AdjustedComplianceBalance> {
    const params = new URLSearchParams({ shipId, year: year.toString() });
    return apiFetch<AdjustedComplianceBalance>(
      `${API_ENDPOINTS.ADJUSTED_CB}?${params.toString()}`
    );
  }

  async getAllAdjustedComplianceBalances(
    year: number
  ): Promise<AdjustedComplianceBalance[]> {
    const params = new URLSearchParams({ year: year.toString() });
    const response = await apiFetch<{
      success: boolean;
      data: {
        year: number;
        isHistorical: boolean;
        ships: Array<{
          shipId: string;
          cbValue: number;
          hasSurplus: boolean;
          hasDeficit: boolean;
        }>;
      };
    }>(`${API_ENDPOINTS.CB_ALL}?${params.toString()}`);

    // Transform backend response to frontend format
    return response.data.ships.map((ship) => ({
      shipId: ship.shipId,
      year: response.data.year,
      cbValue: ship.cbValue,
      adjustedCb: ship.cbValue,
      isDeficit: ship.hasDeficit,
    }));
  }
}
