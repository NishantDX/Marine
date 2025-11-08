/**
 * Port Interface: Route Repository
 * Defines contract for route data access
 */
import { Route, RouteFilters } from "../domain/Route";
import { ComparisonData } from "../domain/Comparison";

export interface IRouteRepository {
  /**
   * Get all routes with optional filters
   */
  getRoutes(filters?: RouteFilters): Promise<Route[]>;

  /**
   * Get a single route by ID
   */
  getRouteById(routeId: string): Promise<Route | null>;

  /**
   * Set a route as baseline
   */
  setBaseline(routeId: string): Promise<void>;

  /**
   * Get comparison data between baseline and comparison routes
   */
  getComparison(
    baselineId?: string,
    comparisonId?: string
  ): Promise<ComparisonData>;
}
