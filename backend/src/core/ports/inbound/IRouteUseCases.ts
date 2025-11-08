import { Route } from '../../domain/entities/Route';
import { FilterParams } from '../../../shared/types/common.types';

export interface IGetAllRoutesUseCase {
  execute(filters?: FilterParams): Promise<Route[]>;
}

export interface ISetBaselineUseCase {
  execute(routeId: string): Promise<Route>;
}

export interface ComparisonResult {
  route: Route;
  percentDiff: number;
  compliant: boolean;
}

export interface IGetComparisonUseCase {
  execute(): Promise<{
    baseline: Route;
    comparisons: ComparisonResult[];
  }>;
}