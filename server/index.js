import "../scripts/env.js";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import historyRouter from "./routes/history.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:8080" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/history", historyRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGTERM", () => prisma.$disconnect());
process.on("SIGINT", () => prisma.$disconnect());
