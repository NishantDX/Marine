/**
 * Custom Hook: useComparison
 * Manages route comparison data
 */
"use client";

import { useState, useEffect } from "react";
import { ComparisonData } from "@/src/core/domain/Comparison";
import { RouteApiClient } from "@/src/adapters/infrastructure/RouteApiClient";

const routeClient = new RouteApiClient();

export function useComparison(baselineId?: string, comparisonId?: string) {
  const [data, setData] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await routeClient.getComparison(
          baselineId,
          comparisonId
        );
        setData(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [baselineId, comparisonId]);

  return { data, loading, error };
}
