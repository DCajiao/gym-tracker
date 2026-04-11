import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

/** GET /api/history */
router.get("/", async (_req, res) => {
  const logs = await prisma.workoutLog.findMany({ orderBy: { date: "desc" } });
  res.json(logs);
});

/** GET /api/history/:date  (yyyy-MM-dd) */
router.get("/:date", async (req, res) => {
  const log = await prisma.workoutLog.findUnique({ where: { date: req.params.date } });
  if (!log) return res.status(404).json({ error: "Not found" });
  res.json(log);
});

/** POST /api/history — upsert a completed workout */
router.post("/", async (req, res) => {
  const {
    date, dayIndex, routineName, emoji,
    exercises, totalSets, completedSets, totalVolume, durationMinutes,
  } = req.body;

  try {
    const log = await prisma.workoutLog.upsert({
      where: { date },
      create: { date, dayIndex, routineName, emoji, exercises, totalSets, completedSets, totalVolume, durationMinutes },
      update: { exercises, completedSets, totalVolume, durationMinutes },
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
