import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

/** GET /api/routine-types */
router.get("/", async (_req, res) => {
  const items = await prisma.routineType.findMany({
    orderBy: { id: "asc" },
    include: { exercises: true },
  });
  res.json(items);
});

/** GET /api/routine-types/:id */
router.get("/:id", async (req, res) => {
  const item = await prisma.routineType.findUnique({
    where: { id: Number(req.params.id) },
    include: { exercises: true },
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

/** POST /api/routine-types */
router.post("/", async (req, res) => {
  const { category, daysOfTheWeek, description } = req.body;
  try {
    const created = await prisma.routineType.create({
      data: { category, daysOfTheWeek, description },
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** PUT /api/routine-types/:id */
router.put("/:id", async (req, res) => {
  const { category, daysOfTheWeek, description } = req.body;
  try {
    const updated = await prisma.routineType.update({
      where: { id: Number(req.params.id) },
      data: { category, daysOfTheWeek, description },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/** DELETE /api/routine-types/:id */
router.delete("/:id", async (req, res) => {
  try {
    await prisma.routineType.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
