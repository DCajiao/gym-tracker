import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

/** GET /api/training-logs  — opcionalmente filtrar por ?date=yyyy-MM-dd o ?exerciseId=N */
router.get("/", async (req, res) => {
  const where = {};
  if (req.query.date) where.trainingDate = new Date(req.query.date);
  if (req.query.exerciseId) where.exerciseIdFk = Number(req.query.exerciseId);

  const logs = await prisma.trainingLog.findMany({
    where,
    orderBy: [{ trainingDate: "desc" }, { startTime: "desc" }],
    include: { exercise: true },
  });
  res.json(logs);
});

/** GET /api/training-logs/:id */
router.get("/:id", async (req, res) => {
  const log = await prisma.trainingLog.findUnique({
    where: { id: Number(req.params.id) },
    include: { exercise: true },
  });
  if (!log) return res.status(404).json({ error: "Not found" });
  res.json(log);
});

/** POST /api/training-logs */
router.post("/", async (req, res) => {
  const {
    exerciseIdFk,
    weightKg,
    repetitionsDone,
    trainingDate,
    startTime,
    endTime,
    exerciseDetails,
  } = req.body;

  try {
    const created = await prisma.trainingLog.create({
      data: {
        exerciseIdFk,
        weightKg,
        repetitionsDone,
        trainingDate: new Date(trainingDate),
        startTime: startTime ? new Date(`1970-01-01T${startTime}`) : null,
        endTime: endTime ? new Date(`1970-01-01T${endTime}`) : null,
        exerciseDetails,
      },
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** DELETE /api/training-logs/:id */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.trainingLog.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
