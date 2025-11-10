/**
 * Infrastructure Adapter: Pooling API Client
 * Implements IPoolingRepository using REST API
 */
import { IPoolingRepository } from "@/src/core/ports/IPoolingRepository";
import { Pool, CreatePoolRequest } from "@/src/core/domain/Pool";
import { apiFetch, API_ENDPOINTS } from "@/src/shared/utils/api";

export class PoolingApiClient implements IPoolingRepository {
  async createPool(request: CreatePoolRequest): Promise<Pool> {
    return apiFetch<Pool>(API_ENDPOINTS.POOLS, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  async getPoolById(poolId: string): Promise<Pool | null> {
    try {
      return await apiFetch<Pool>(`${API_ENDPOINTS.POOLS}/${poolId}`);
    } catch {
      return null;
    }
  }

  async getPoolsByYear(year: number): Promise<Pool[]> {
    const params = new URLSearchParams({ year: year.toString() });
    return apiFetch<Pool[]>(`${API_ENDPOINTS.POOLS}?${params.toString()}`);
  }
}
