import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

/** GET /api/exercises  — opcionalmente filtrar por ?routineTypeId=N */
router.get("/", async (req, res) => {
  const where = req.query.routineTypeId
    ? { routineTypeIdFk: Number(req.query.routineTypeId) }
    : {};

  const items = await prisma.exercise.findMany({
    where,
    orderBy: { id: "asc" },
    include: { routineType: true },
  });
  res.json(items);
});

/** GET /api/exercises/:id */
router.get("/:id", async (req, res) => {
  const item = await prisma.exercise.findUnique({
    where: { id: Number(req.params.id) },
    include: { routineType: true },
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

/** POST /api/exercises */
router.post("/", async (req, res) => {
  const { name, description, series, repetitions, muscleTags, routineTypeIdFk } = req.body;
  try {
    const created = await prisma.exercise.create({
      data: { name, description, series, repetitions, muscleTags, routineTypeIdFk },
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** PUT /api/exercises/:id */
router.put("/:id", async (req, res) => {
  const { name, description, series, repetitions, muscleTags, routineTypeIdFk } = req.body;
  try {
    const updated = await prisma.exercise.update({
      where: { id: Number(req.params.id) },
      data: { name, description, series, repetitions, muscleTags, routineTypeIdFk },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** PATCH /api/exercises/:id/weight — actualiza solo el peso por defecto */
router.patch("/:id/weight", async (req, res) => {
  const { defaultWeight } = req.body;
  try {
    const updated = await prisma.exercise.update({
      where: { id: Number(req.params.id) },
      data: { defaultWeight: defaultWeight ?? null },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** DELETE /api/exercises/:id */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.exercise.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
