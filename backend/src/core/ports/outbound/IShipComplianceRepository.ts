import {
  ShipCompliance,
  ShipComplianceProps,
} from "../../domain/entities/ShipCompliance";

export interface IShipComplianceRepository {
  findByShipAndYear(
    shipId: string,
    year: number
  ): Promise<ShipCompliance | null>;
  findByYear(year: number): Promise<ShipCompliance[]>;
  create(data: Omit<ShipComplianceProps, "id">): Promise<ShipCompliance>;
  update(id: number, cbGco2eq: number): Promise<ShipCompliance>;
}
