/**
 * Infrastructure Adapter: Route API Client
 * Implements IRouteRepository using REST API
 */
import { IRouteRepository } from "@/src/core/ports/IRouteRepository";
import { Route, RouteFilters } from "@/src/core/domain/Route";
import { ComparisonData } from "@/src/core/domain/Comparison";
import { apiFetch, API_ENDPOINTS } from "@/src/shared/utils/api";

export class RouteApiClient implements IRouteRepository {
  async getRoutes(filters?: RouteFilters): Promise<Route[]> {
    const params = new URLSearchParams();

    if (filters?.vesselTypes?.length) {
      params.append("vesselType", filters.vesselTypes[0]);
    }
    if (filters?.fuelTypes?.length) {
      params.append("fuelType", filters.fuelTypes[0]);
    }
    if (filters?.year) {
      params.append("year", filters.year.toString());
    }

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await apiFetch<{ success: boolean; data: Route[] }>(
      `${API_ENDPOINTS.ROUTES}${query}`
    );
    return response.data || [];
  }

  async getRouteById(routeId: string): Promise<Route | null> {
    try {
      return await apiFetch<Route>(`${API_ENDPOINTS.ROUTES}/${routeId}`);
    } catch {
      return null;
    }
  }

  async setBaseline(routeId: string): Promise<void> {
    await apiFetch<void>(API_ENDPOINTS.ROUTE_BASELINE(routeId), {
      method: "POST",
    });
  }

  async getComparison(
    baselineId?: string,
    comparisonId?: string
  ): Promise<ComparisonData> {
    const params = new URLSearchParams();
    if (baselineId) params.append("baselineId", baselineId);
    if (comparisonId) params.append("comparisonId", comparisonId);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await apiFetch<{ success: boolean; data: ComparisonData }>(
      `${API_ENDPOINTS.ROUTE_COMPARISON}${query}`
    );

    return response.data;
  }
}
