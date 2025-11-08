import { Route, RouteProps } from '../../domain/entities/Route';
import { FilterParams } from '../../../shared/types/common.types';

export interface IRouteRepository {
  findAll(filters?: FilterParams): Promise<Route[]>;
  findById(id: number): Promise<Route | null>;
  findByRouteId(routeId: string): Promise<Route | null>;
  findBaseline(): Promise<Route | null>;
  create(data: Omit<RouteProps, 'id'>): Promise<Route>;
  update(id: number, data: Partial<RouteProps>): Promise<Route>;
  setAsBaseline(routeId: string): Promise<Route>;
}