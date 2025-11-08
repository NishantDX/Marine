import pool from "./connection";
import fs from "fs";
import path from "path";

/**
 * Run database migrations
 */
async function runMigrations() {
  const migrationsDir = path.join(
    __dirname,
    "../../adapters/outbound/postgres/migrations"
  );
  const files = fs.readdirSync(migrationsDir).sort();

  console.log("🔄 Running database migrations...\n");

  for (const file of files) {
    if (file.endsWith(".sql")) {
      console.log(`  📄 Running ${file}...`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      try {
        await pool.query(sql);
        console.log(`  ✓ ${file} completed\n`);
      } catch (error: any) {
        console.error(`  ✗ ${file} failed:`, error.message);
        throw error;
      }
    }
  }

  console.log("✅ All migrations completed successfully\n");
}

/**
 * Seed database with sample data
 */
async function seedDatabase() {
  console.log("🌱 Seeding database...\n");

  // Seed routes (from assignment KPIs)
  const routes = [
    ["R001", "Container", "HFO", 2024, 91.0, 5000, 12000, 4500, false],
    ["R002", "BulkCarrier", "LNG", 2024, 88.0, 4800, 11500, 4200, false],
    ["R003", "Tanker", "MGO", 2024, 93.5, 5100, 12500, 4700, false],
    ["R004", "RoRo", "HFO", 2025, 89.2, 4900, 11800, 4300, true], // Set as baseline
    ["R005", "Container", "LNG", 2025, 90.5, 4950, 11900, 4400, false],
  ];

  console.log("  📄 Inserting routes...");
  for (const route of routes) {
    await pool.query(
      `INSERT INTO routes (route_id, vessel_type, fuel_type, year, ghg_intensity, 
        fuel_consumption, distance, total_emissions, is_baseline)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (route_id) DO NOTHING`,
      route
    );
  }
  console.log("  ✓ Routes inserted\n");

  // Seed ship compliance (example ships)
  console.log("  📄 Inserting ship compliance data...");
  const ships = [
    ["SHIP-001", 2025, 15000.5], // Surplus
    ["SHIP-002", 2025, -8500.75], // Deficit
    ["SHIP-003", 2025, 22000.0], // Surplus
    ["SHIP-004", 2025, -12000.25], // Deficit
  ];

  for (const ship of ships) {
    await pool.query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
       VALUES ($1, $2, $3)
       ON CONFLICT (ship_id, year) DO NOTHING`,
      ship
    );
  }
  console.log("  ✓ Ship compliance data inserted\n");

  console.log("✅ Database seeded successfully\n");
}

/**
 * Main setup function
 */
async function setupDatabase() {
  try {
    console.log("=".repeat(60));
    console.log("🔧 Database Setup - FuelEU Maritime");
    console.log("=".repeat(60));
    console.log();

    await runMigrations();
    await seedDatabase();

    console.log("=".repeat(60));
    console.log("✅ Database setup completed successfully!");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Database setup failed:", error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  setupDatabase();
}

export { runMigrations, seedDatabase, setupDatabase };
