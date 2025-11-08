import { IShipComplianceRepository } from "../../../../core/ports/outbound/IShipComplianceRepository";
import {
  ShipCompliance,
  ShipComplianceProps,
} from "../../../../core/domain/entities/ShipCompliance";
import pool from "../../../../infrastructure/db/connection";

export class ShipComplianceRepository implements IShipComplianceRepository {
  async findByShipAndYear(
    shipId: string,
    year: number
  ): Promise<ShipCompliance | null> {
    const result = await pool.query(
      "SELECT * FROM ship_compliance WHERE ship_id = $1 AND year = $2",
      [shipId, year]
    );
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  async create(data: Omit<ShipComplianceProps, "id">): Promise<ShipCompliance> {
    const query = `
      INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [data.shipId, data.year, data.cbGco2eq];
    const result = await pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async update(id: number, cbGco2eq: number): Promise<ShipCompliance> {
    const query = `
      UPDATE ship_compliance 
      SET cb_gco2eq = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;

    const values = [cbGco2eq, new Date(), id];
    const result = await pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  private mapToEntity(row: any): ShipCompliance {
    return new ShipCompliance({
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      cbGco2eq: parseFloat(row.cb_gco2eq),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
