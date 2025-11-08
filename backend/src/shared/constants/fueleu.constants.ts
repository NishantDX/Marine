/**
 * FuelEU Maritime Regulation Constants
 * Based on EU 2023/1805, Annex IV
 */

// Target GHG Intensity for 2025 (2% below 91.16 gCO₂e/MJ)
export const TARGET_GHG_INTENSITY_2025 = 89.3368; // gCO₂e/MJ

// Energy conversion factor (MJ per tonne of fuel)
export const ENERGY_PER_TONNE = 41000; // MJ/t

// Compliance years
export const COMPLIANCE_YEARS = {
  START: 2025,
  END: 2050
} as const;

// Vessel types
export const VESSEL_TYPES = [
  'Container',
  'BulkCarrier',
  'Tanker',
  'RoRo',
  'PassengerShip'
] as const;

// Fuel types
export const FUEL_TYPES = [
  'HFO',    // Heavy Fuel Oil
  'MGO',    // Marine Gas Oil
  'LNG',    // Liquefied Natural Gas
  'Methanol',
  'Ammonia',
  'Hydrogen'
] as const;