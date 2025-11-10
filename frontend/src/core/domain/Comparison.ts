/**
 * Domain Entity: Route Comparison
 * Compares baseline and comparison routes for compliance
 */
export interface RouteComparison {
  routeId: string;
  baselineGhgIntensity: number; // gCO₂e/MJ
  comparisonGhgIntensity: number; // gCO₂e/MJ
  percentDifference: number; // percentage
  isCompliant: boolean;
  target: number; // 89.3368 gCO₂e/MJ
}

export interface ComparisonData {
  target: number; // 89.3368 gCO₂e/MJ (2% below 91.16)
  comparisons: RouteComparison[];
}

/**
 * Calculate percentage difference between comparison and baseline
 * Formula: ((comparison / baseline) - 1) × 100
 */
export function calculatePercentDifference(
  comparison: number,
  baseline: number
): number {
  if (baseline === 0) return 0;
  return (comparison / baseline - 1) * 100;
}

/**
 * Check if route is compliant with target
 */
export function isCompliant(ghgIntensity: number, target: number): boolean {
  return ghgIntensity < target;
}
