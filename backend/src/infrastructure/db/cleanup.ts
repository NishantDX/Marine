import pool from "./connection";

async function cleanup() {
  try {
    console.log("🧹 Cleaning up old data...\n");

    // Delete old 2024 routes
    await pool.query("DELETE FROM routes WHERE year < 2025");
    console.log("✓ Old routes deleted\n");

    console.log("✅ Cleanup completed!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Cleanup failed:", error);
    process.exit(1);
  }
}

cleanup();
