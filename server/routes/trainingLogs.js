import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Todos los endpoints requieren autenticación
router.use(requireAuth);

/** GET /api/training-logs — filtra por usuario autenticado */
router.get("/", async (req, res) => {
  const where = { userId: req.user.id };
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
  const log = await prisma.trainingLog.findFirst({
    where: { id: Number(req.params.id), userId: req.user.id },
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
        userId: req.user.id,
        exerciseIdFk,
        weightKg,
        repetitionsDone,
        trainingDate: new Date(trainingDate),
        startTime: startTime ? new Date(`1970-01-01T${startTime}`) : null,
        endTime:   endTime   ? new Date(`1970-01-01T${endTime}`)   : null,
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
    // findFirst verifica que el log pertenezca al usuario antes de borrar
    const log = await prisma.trainingLog.findFirst({
      where: { id: Number(req.params.id), userId: req.user.id },
    });
    if (!log) return res.status(404).json({ error: "Not found" });

    await prisma.trainingLog.delete({ where: { id: log.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
