/**
 * Custom Hook: useRoutes
 * Manages routes data fetching and filtering
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Route, RouteFilters } from "@/src/core/domain/Route";
import { RouteApiClient } from "@/src/adapters/infrastructure/RouteApiClient";

const routeClient = new RouteApiClient();

export function useRoutes(initialFilters?: RouteFilters) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RouteFilters>(initialFilters || {});

  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await routeClient.getRoutes(filters);
      setRoutes(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const setBaseline = async (routeId: string) => {
    try {
      await routeClient.setBaseline(routeId);
      await fetchRoutes(); // Refresh data
      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    }
  };

  return {
    routes,
    loading,
    error,
    filters,
    setFilters,
    setBaseline,
    refetch: fetchRoutes,
  };
}
