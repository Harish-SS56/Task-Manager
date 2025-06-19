import express from "express";
import dotenv from "dotenv";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

// Load environment variables from .env
dotenv.config({ path: "../.env" });
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API request logger
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    // Global error handler
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      console.error("Error:", err);
    });

    // Vite in dev / static in prod
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Start server
    app.listen(PORT, HOST, () => {
      log(`🚀 Server running on http://${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server setup failed:", err);
  }
})();
