import "../scripts/env.js";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import authRouter from "./routes/auth.js";
import routineTypesRouter from "./routes/routineTypes.js";
import exercisesRouter from "./routes/exercises.js";
import trainingLogsRouter from "./routes/trainingLogs.js";
import scheduleRouter from "./routes/schedule.js";
import workoutSessionsRouter from "./routes/workoutSessions.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:8080" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/routine-types", routineTypesRouter);
app.use("/api/exercises", exercisesRouter);
app.use("/api/training-logs", trainingLogsRouter);
app.use("/api/workout-sessions", workoutSessionsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

process.on("SIGTERM", () => prisma.$disconnect());
process.on("SIGINT", () => prisma.$disconnect());
