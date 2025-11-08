/**
 * Port Interface: Pooling Repository
 * Defines contract for pooling operations (Article 21)
 */
import { Pool, CreatePoolRequest } from "../domain/Pool";

export interface IPoolingRepository {
  /**
   * Create a new pool
   */
  createPool(request: CreatePoolRequest): Promise<Pool>;

  /**
   * Get pool by ID
   */
  getPoolById(poolId: string): Promise<Pool | null>;

  /**
   * Get all pools for a year
   */
  getPoolsByYear(year: number): Promise<Pool[]>;
}
