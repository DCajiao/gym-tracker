import { Router } from "express";
import { prisma } from "../db.js";

const router = Router();

const DAYS = [
  { index: 0, name: "Lunes",     short: "Lun", key: "lunes"      },
  { index: 1, name: "Martes",    short: "Mar", key: "martes"     },
  { index: 2, name: "Miércoles", short: "Mié", key: "miércoles"  },
  { index: 3, name: "Jueves",    short: "Jue", key: "jueves"     },
  { index: 4, name: "Viernes",   short: "Vie", key: "viernes"    },
  { index: 5, name: "Sábado",    short: "Sáb", key: "sábado"     },
  { index: 6, name: "Domingo",   short: "Dom", key: "domingo"    },
];

/**
 * GET /api/schedule
 * Devuelve un array de 7 elementos (0=Lunes … 6=Domingo) con la rutina
 * y ejercicios de cada día, leídos de la DB.
 */
router.get("/", async (_req, res) => {
  const routineTypes = await prisma.routineType.findMany({
    include: { exercises: { orderBy: { id: "asc" } } },
  });

  const schedule = DAYS.map((day) => {
    const rt = routineTypes.find((r) =>
      r.daysOfTheWeek
        .split(",")
        .map((d) => d.trim().toLowerCase())
        .includes(day.key)
    );

    return {
      dayIndex:    day.index,
      dayName:     day.name,
      dayShort:    day.short,
      isRest:      !rt,
      routineType: rt
        ? { id: rt.id, category: rt.category, description: rt.description }
        : null,
      exercises: rt ? rt.exercises : [],
    };
  });

  res.json(schedule);
});

export default router;
