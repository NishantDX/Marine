import { Pool, PoolProps } from "../../domain/entities/Pool";

export interface IPoolRepository {
  create(data: Omit<PoolProps, "id">): Promise<Pool>;
  findByYear(year: number): Promise<Pool[]>;
  findById(id: number): Promise<Pool | null>;
}
