export type VesselType = 'Container' | 'BulkCarrier' | 'Tanker' | 'RoRo' | 'PassengerShip';
export type FuelType = 'HFO' | 'MGO' | 'LNG' | 'Methanol' | 'Ammonia' | 'Hydrogen';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface FilterParams {
  vesselType?: VesselType;
  fuelType?: FuelType;
  year?: number;
}