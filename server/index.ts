import "dotenv/config";
import express, { NextFunction, type Request, Response } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

// Extend request type
declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Middleware
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// Logger
function log(message: string, source = "server") {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] [${source}] ${message}`);
}

// API request logger
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
    }
  });

  next();
});

async function startServer() {
  try {
    log("Starting server...");

    // Register API routes
    await registerRoutes(httpServer, app);
    log("Routes registered");

    // Setup frontend
    if (process.env.NODE_ENV === "production") {
      serveStatic(app);
    } else {
      const { setupVite } = await import("./vite");
      await setupVite(httpServer, app);
    }

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Internal Server Error:", err);
      res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
      });
    });

    // Start listening (Windows safe)
    const port = Number(process.env.PORT) || 3004;

    httpServer.listen(port, "0.0.0.0", () => {
      log(`🚀 Server running at http://localhost:${port}`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
  }
}

startServer();