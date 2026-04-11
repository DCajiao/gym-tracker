/**
 * Seeds the database with ~60 days of deterministic mock workout history.
 * Safe to run multiple times — skips if data already exists.
 *
 * Usage: node scripts/seed.js
 */
import "./env.js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { weekRoutine } from "../server/workoutData.js";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

function createSeededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

async function seed() {
  const existing = await prisma.workoutLog.count();
  if (existing > 0) {
    console.log(`Seed skipped — ${existing} logs already in DB.`);
    return;
  }

  const rng = createSeededRng(42);
  const today = new Date();
  const logs = [];

  for (let daysAgo = 1; daysAgo <= 60; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const jsDay = date.getDay();
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const routine = weekRoutine[dayIndex];

    if (routine.isRest) continue;
    if (rng() < 0.15) continue;

    const exercises = routine.exercises.map((ex) => {
      const sets = ex.sets.map((s) => {
        const completed = rng() > 0.05;
        const weightVariation = s.weight * (0.9 + rng() * 0.2);
        return {
          reps: completed ? s.reps + Math.floor(rng() * 3 - 1) : 0,
          weight: Math.round(weightVariation * 2) / 2,
          completed,
        };
      });
      return { name: ex.name, muscleGroup: ex.muscleGroup, sets };
    });

    const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);
    const completedSets = exercises.reduce(
      (a, e) => a + e.sets.filter((s) => s.completed).length,
      0,
    );
    const totalVolume = Math.round(
      exercises.reduce(
        (a, e) => a + e.sets.reduce((b, s) => b + (s.completed ? s.reps * s.weight : 0), 0),
        0,
      ),
    );

    logs.push({
      date: date.toISOString().split("T")[0],
      dayIndex,
      routineName: routine.routineName,
      emoji: routine.emoji,
      exercises,
      totalSets,
      completedSets,
      totalVolume,
      durationMinutes: 40 + Math.floor(rng() * 30),
    });
  }

  await prisma.workoutLog.createMany({ data: logs });
  console.log(`Seeded ${logs.length} workout logs.`);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
