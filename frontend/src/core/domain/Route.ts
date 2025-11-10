/**
 * Domain Entity: Route
 * Represents a maritime shipping route with fuel and emissions data
 */
export interface Route {
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number; // gCO₂e/MJ
  fuelConsumption: number; // tons
  distance: number; // km
  totalEmissions: number; // tons
  isBaseline?: boolean;
}

export type VesselType =
  | "Container"
  | "BulkCarrier"
  | "Tanker"
  | "RoRo"
  | "General Cargo";

export type FuelType = "HFO" | "LNG" | "MGO" | "Methanol" | "Ammonia";

export interface RouteFilters {
  vesselTypes?: VesselType[];
  fuelTypes?: FuelType[];
  year?: number;
}
