
import { IBankEntryRepository } from "../../../../core/ports/outbound/IBankEntryRepository";
import {
  BankEntry,
  BankEntryProps,
} from "../../../../core/domain/entities/BankEntry";
import pool from "../../../../infrastructure/db/connection";

export class BankEntryRepository implements IBankEntryRepository {
  async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
    const result = await pool.query(
      "SELECT * FROM bank_entries WHERE ship_id = $1 AND year = $2 ORDER BY created_at DESC",
      [shipId, year]
    );
    return result.rows.map((row) => this.mapToEntity(row));
  }

  async getTotalBanked(shipId: string, year: number): Promise<number> {
    const result = await pool.query(
      "SELECT COALESCE(SUM(amount_gco2eq), 0) as total FROM bank_entries WHERE ship_id = $1 AND year = $2",
      [shipId, year]
    );
    return parseFloat(result.rows[0].total);
  }

  async create(data: Omit<BankEntryProps, "id">): Promise<BankEntry> {
    const query = `
      INSERT INTO bank_entries (ship_id, year, amount_gco2eq)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const values = [data.shipId, data.year, data.amountGco2eq];
    const result = await pool.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  private mapToEntity(row: any): BankEntry {
    return new BankEntry({
      id: row.id,
      shipId: row.ship_id,
      year: row.year,
      amountGco2eq: parseFloat(row.amount_gco2eq),
      createdAt: row.created_at,
    });
  }
}
