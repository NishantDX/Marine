import express, { Application } from "express";
import cors from "cors";
import routes from "../../adapters/inbound/http/routes";
import {
  errorHandler,
  notFound,
} from "../../adapters/inbound/http/middleware/errorHandler";

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: "*" }));

  // Health check
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "FuelEU Maritime API is running",
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use("/api", routes);

  // Error handling
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
