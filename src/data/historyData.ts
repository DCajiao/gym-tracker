import type { WorkoutLog } from "@/types/workout";
import { weekRoutine } from "./workoutData";

/**
 * Simple seeded PRNG for deterministic mock data.
 * Ensures history doesn't regenerate on HMR.
 */
function createSeededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateHistory(): WorkoutLog[] {
  const rng = createSeededRng(42);
  const logs: WorkoutLog[] = [];
  const today = new Date();

  for (let daysAgo = 1; daysAgo <= 60; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const jsDay = date.getDay();
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1;
    const routine = weekRoutine[dayIndex];

    if (routine.isRest) continue;
    if (rng() < 0.15) continue; // ~85% attendance

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
      0
    );
    const totalVolume = exercises.reduce(
      (a, e) => a + e.sets.reduce((b, s) => b + (s.completed ? s.reps * s.weight : 0), 0),
      0
    );

    logs.push({
      date: date.toISOString().split("T")[0],
      dayIndex,
      routineName: routine.routineName,
      emoji: routine.emoji,
      exercises,
      totalSets,
      completedSets,
      totalVolume: Math.round(totalVolume),
      durationMinutes: 40 + Math.floor(rng() * 30),
    });
  }

  return logs.sort((a, b) => b.date.localeCompare(a.date));
}

export const workoutHistory: WorkoutLog[] = generateHistory();
