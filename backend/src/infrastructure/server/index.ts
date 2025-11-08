import dotenv from "dotenv";
import { createApp } from "./app";
import pool from "../db/connection";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = createApp();

// Start server
app.listen(PORT, () => {
  console.log("=".repeat(60));
  console.log("🚀 FuelEU Maritime Compliance API");
  console.log("=".repeat(60));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}`);
  console.log(`📅 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("=".repeat(60));
  console.log("\n✅ Server is ready to accept connections\n");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n\n📴 Shutting down server gracefully...");
  await pool.end();
  console.log("✓ Database connection closed");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n\n📴 SIGTERM received, shutting down...");
  await pool.end();
  console.log("✓ Database connection closed");
  process.exit(0);
});
