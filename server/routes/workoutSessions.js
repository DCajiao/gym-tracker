import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(requireAuth);

/**
 * GET /api/workout-sessions/active
 * Devuelve la sesión activa del usuario, o null si no hay ninguna.
 */
router.get("/active", async (req, res) => {
  const session = await prisma.workoutSession.findFirst({
    where: { userId: req.user.id, isActive: true },
  });
  res.json(session ?? null);
});

/**
 * PUT /api/workout-sessions/active
 * Crea o actualiza la sesión activa del usuario.
 * Body: { sessionDate: "yyyy-MM-dd", state: { ... } }
 */
router.put("/active", async (req, res) => {
  const { sessionDate, state } = req.body;
  if (!sessionDate || !state) {
    return res.status(400).json({ error: "sessionDate y state son requeridos" });
  }

  const existing = await prisma.workoutSession.findFirst({
    where: { userId: req.user.id, isActive: true },
  });

  const now = new Date();

  if (existing) {
    const updated = await prisma.workoutSession.update({
      where: { id: existing.id },
      data: { state, updatedAt: now },
    });
    return res.json(updated);
  }

  const created = await prisma.workoutSession.create({
    data: {
      userId:      req.user.id,
      sessionDate: new Date(sessionDate),
      state,
      isActive:    true,
      updatedAt:   now,
    },
  });
  res.status(201).json(created);
});

/**
 * DELETE /api/workout-sessions/active
 * Marca la sesión activa como inactiva (fin del entrenamiento).
 */
router.delete("/active", async (req, res) => {
  const existing = await prisma.workoutSession.findFirst({
    where: { userId: req.user.id, isActive: true },
  });

  if (!existing) return res.status(404).json({ error: "No hay sesión activa" });

  await prisma.workoutSession.update({
    where: { id: existing.id },
    data: { isActive: false, updatedAt: new Date() },
  });
  res.status(204).end();
});

export default router;
