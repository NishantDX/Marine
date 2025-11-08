import { VesselType, FuelType } from "../../../shared/types/common.types";

export interface RouteProps {
  id?: number;
  routeId: string;
  vesselType: VesselType;
  fuelType: FuelType;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Route {
  private props: RouteProps;

  constructor(props: RouteProps) {
    this.validateProps(props);
    this.props = props;
  }

  private validateProps(props: RouteProps): void {
    if (!props.routeId) throw new Error("Route ID is required");
    if (props.ghgIntensity <= 0)
      throw new Error("GHG intensity must be positive");
    if (props.fuelConsumption <= 0)
      throw new Error("Fuel consumption must be positive");
    if (props.distance <= 0) throw new Error("Distance must be positive");
    if (props.year < 2020) throw new Error("Year must be 2020 or later");
  }

  // Getters
  get id(): number | undefined {
    return this.props.id;
  }
  get routeId(): string {
    return this.props.routeId;
  }
  get vesselType(): VesselType {
    return this.props.vesselType;
  }
  get fuelType(): FuelType {
    return this.props.fuelType;
  }
  get year(): number {
    return this.props.year;
  }
  get ghgIntensity(): number {
    return this.props.ghgIntensity;
  }
  get fuelConsumption(): number {
    return this.props.fuelConsumption;
  }
  get distance(): number {
    return this.props.distance;
  }
  get totalEmissions(): number {
    return this.props.totalEmissions;
  }
  get isBaseline(): boolean {
    return this.props.isBaseline;
  }

  // Business methods
  setAsBaseline(): void {
    this.props.isBaseline = true;
  }

  removeAsBaseline(): void {
    this.props.isBaseline = false;
  }

  toJSON(): RouteProps {
    return { ...this.props };
  }
}
