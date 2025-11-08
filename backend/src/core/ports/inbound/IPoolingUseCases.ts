import { Pool } from '../../domain/entities/Pool';

export interface CreatePoolRequest {
  year: number;
  shipIds: string[];
}

export interface ICreatePoolUseCase {
  execute(request: CreatePoolRequest): Promise<Pool>;
}