import { IPoolRepository } from "../../../../core/ports/outbound/IPoolRepository";
import { Pool, PoolProps } from "../../../../core/domain/entities/Pool";
import pool from "../../../../infrastructure/db/connection";

export class PoolRepository implements IPoolRepository {
  async create(data: Omit<PoolProps, "id">): Promise<Pool> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Create pool
      const poolResult = await client.query(
        "INSERT INTO pools (year) VALUES ($1) RETURNING *",
        [data.year]
      );
      const poolId = poolResult.rows[0].id;

      // Create pool members
      for (const member of data.members) {
        await client.query(
          "INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after) VALUES ($1, $2, $3, $4)",
          [poolId, member.shipId, member.cbBefore, member.cbAfter]
        );
      }

      await client.query("COMMIT");

      return new Pool({
        id: poolId,
        year: data.year,
        members: data.members,
        createdAt: poolResult.rows[0].created_at,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async findByYear(year: number): Promise<Pool[]> {
    const poolsResult = await pool.query(
      "SELECT * FROM pools WHERE year = $1 ORDER BY created_at DESC",
      [year]
    );

    const pools: Pool[] = [];
    for (const poolRow of poolsResult.rows) {
      const membersResult = await pool.query(
        "SELECT * FROM pool_members WHERE pool_id = $1",
        [poolRow.id]
      );

      pools.push(
        new Pool({
          id: poolRow.id,
          year: poolRow.year,
          members: membersResult.rows.map((m) => ({
            shipId: m.ship_id,
            cbBefore: parseFloat(m.cb_before),
            cbAfter: parseFloat(m.cb_after),
          })),
          createdAt: poolRow.created_at,
        })
      );
    }

    return pools;
  }

  async findById(id: number): Promise<Pool | null> {
    const poolResult = await pool.query("SELECT * FROM pools WHERE id = $1", [
      id,
    ]);
    if (poolResult.rows.length === 0) return null;

    const membersResult = await pool.query(
      "SELECT * FROM pool_members WHERE pool_id = $1",
      [id]
    );

    return new Pool({
      id: poolResult.rows[0].id,
      year: poolResult.rows[0].year,
      members: membersResult.rows.map((m) => ({
        shipId: m.ship_id,
        cbBefore: parseFloat(m.cb_before),
        cbAfter: parseFloat(m.cb_after),
      })),
      createdAt: poolResult.rows[0].created_at,
    });
  }
}
