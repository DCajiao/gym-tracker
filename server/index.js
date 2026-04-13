import "../scripts/env.js";
import express from "express";
import cors from "cors";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { prisma } from "./db.js";
import authRouter from "./routes/auth.js";
import routineTypesRouter from "./routes/routineTypes.js";
import exercisesRouter from "./routes/exercises.js";
import trainingLogsRouter from "./routes/trainingLogs.js";
import scheduleRouter from "./routes/schedule.js";
import workoutSessionsRouter from "./routes/workoutSessions.js";

const app  = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === "production";

// En desarrollo se necesita CORS porque Vite corre en :8080 y el server en :3001.
// En producción ambos están en el mismo origen → CORS no aplica.
if (!isProd) {
  app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:8080" }));
}

app.use(express.json());

// ── API ───────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth",             authRouter);
app.use("/api/schedule",         scheduleRouter);
app.use("/api/routine-types",    routineTypesRouter);
app.use("/api/exercises",        exercisesRouter);
app.use("/api/training-logs",    trainingLogsRouter);
app.use("/api/workout-sessions", workoutSessionsRouter);

// ── Frontend estático (solo en producción) ────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const distPath  = join(__dirname, "../dist");

if (isProd && existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback: cualquier ruta no-API devuelve index.html
  app.use((_req, res) => res.sendFile(join(distPath, "index.html")));
}

// ─────────────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} [${isProd ? "production" : "development"}]`);
});

process.on("SIGTERM", () => prisma.$disconnect());
process.on("SIGINT",  () => prisma.$disconnect());
