import { ENERGY_PER_TONNE, TARGET_GHG_INTENSITY_2025 } from '../constants/fueleu.constants';

/**
 * Calculate energy in scope (MJ)
 * Formula: fuelConsumption (t) × 41,000 MJ/t
 */
export function calculateEnergyInScope(fuelConsumption: number): number {
  return fuelConsumption * ENERGY_PER_TONNE;
}

/**
 * Calculate Compliance Balance (CB)
 * Formula: (Target - Actual) × Energy in scope
 * 
 * @param actualGhgIntensity - Actual GHG intensity (gCO₂e/MJ)
 * @param fuelConsumption - Fuel consumption (tonnes)
 * @param targetIntensity - Target GHG intensity (default: 2025 target)
 * @returns Compliance Balance in gCO₂e (positive = surplus, negative = deficit)
 */
export function calculateComplianceBalance(
  actualGhgIntensity: number,
  fuelConsumption: number,
  targetIntensity: number = TARGET_GHG_INTENSITY_2025
): number {
  const energyInScope = calculateEnergyInScope(fuelConsumption);
  const cb = (targetIntensity - actualGhgIntensity) * energyInScope;
  return Math.round(cb * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate percentage difference between baseline and comparison
 * Formula: ((comparison / baseline) - 1) × 100
 */
export function calculatePercentDifference(baseline: number, comparison: number): number {
  if (baseline === 0) return 0;
  return Math.round(((comparison / baseline) - 1) * 100 * 100) / 100;
}

/**
 * Check if route is compliant
 */
export function isCompliant(
  ghgIntensity: number,
  targetIntensity: number = TARGET_GHG_INTENSITY_2025
): boolean {
  return ghgIntensity <= targetIntensity;
}