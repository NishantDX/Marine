import { IRouteRepository } from "../../../../core/ports/outbound/IRouteRepository";
import { Route, RouteProps } from "../../../../core/domain/entities/Route";
import { FilterParams } from "../../../../shared/types/common.types";
import pool from "../../../../infrastructure/db/connection";

export class RouteRepository implements IRouteRepository {
  async findAll(filters?: FilterParams): Promise<Route[]> {
    let query = "SELECT * FROM routes WHERE 1=1";
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.vesselType) {
      query += ` AND vessel_type = $${paramIndex}`;
      params.push(filters.vesselType);
      paramIndex++;
    }

    if (filters?.fuelType) {
      query += ` AND fuel_type = $${paramIndex}`;
      params.push(filters.fuelType);
      paramIndex++;
    }

    if (filters?.year) {
      query += ` AND year = $${paramIndex}`;
      params.push(filters.year);
      paramIndex++;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    return result.rows.map((row) => this.mapToEntity(row));
  }

  async findById(id: number): Promise<Route | null> {
    const result = await pool.query("SELECT * FROM routes WHERE id = $1", [id]);
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  async findByRouteId(routeId: string): Promise<Route | null> {
    const result = await pool.query(
      "SELECT * FROM routes WHERE route_id = $1",
      [routeId]
    );
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  async findBaseline(): Promise<Route | null> {
    const result = await pool.query(
      "SELECT * FROM routes WHERE is_baseline = true LIMIT 1"
    );
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  async create(data: Omit<RouteProps, "id">): Promise<Route> {
    const query = `
      INSERT INTO routes (
        route_id, vessel_type, fuel_type, year, ghg_intensity,
        fuel_consumption, distance, total_emissions, is_baseline
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const values = [
      data.routeId,
      data.vesselType,
      data.fuelType,
      data.year,
      data.ghgIntensity,
      data.fuelConsumption,
      data.distance,
      data.totalEmissions,
      data.isBaseline,
    ];

    const result = await pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async update(id: number, data: Partial<RouteProps>): Promise<Route> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.vesselType !== undefined) {
      fields.push(`vessel_type = $${paramIndex}`);
      values.push(data.vesselType);
      paramIndex++;
    }

    if (data.fuelType !== undefined) {
      fields.push(`fuel_type = $${paramIndex}`);
      values.push(data.fuelType);
      paramIndex++;
    }

    if (data.year !== undefined) {
      fields.push(`year = $${paramIndex}`);
      values.push(data.year);
      paramIndex++;
    }

    if (data.ghgIntensity !== undefined) {
      fields.push(`ghg_intensity = $${paramIndex}`);
      values.push(data.ghgIntensity);
      paramIndex++;
    }

    if (data.isBaseline !== undefined) {
      fields.push(`is_baseline = $${paramIndex}`);
      values.push(data.isBaseline);
      paramIndex++;
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date());
    paramIndex++;

    values.push(id);

    const query = `
      UPDATE routes SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async setAsBaseline(routeId: string): Promise<Route> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Clear existing baseline
      await client.query(
        "UPDATE routes SET is_baseline = false WHERE is_baseline = true"
      );

      // Set new baseline
      const result = await client.query(
        "UPDATE routes SET is_baseline = true, updated_at = $1 WHERE route_id = $2 RETURNING *",
        [new Date(), routeId]
      );

      await client.query("COMMIT");
      return this.mapToEntity(result.rows[0]);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  private mapToEntity(row: any): Route {
    return new Route({
      id: row.id,
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: row.year,
      ghgIntensity: parseFloat(row.ghg_intensity),
      fuelConsumption: parseFloat(row.fuel_consumption),
      distance: parseFloat(row.distance),
      totalEmissions: parseFloat(row.total_emissions),
      isBaseline: row.is_baseline,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }
}
