import { ShipCompliance } from '../../domain/entities/ShipCompliance';

export interface IComputeCBUseCase {
  execute(shipId: string, year: number): Promise<ShipCompliance>;
}

export interface IGetAdjustedCBUseCase {
  execute(shipId: string, year: number): Promise<number>;
}