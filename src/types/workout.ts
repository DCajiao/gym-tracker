/** Shared types for the GymTracker app */

export type Tab = "workout" | "history" | "insights";

// ── Schedule (semana) ─────────────────────────────────────────────────────────

export interface DaySchedule {
  dayIndex:    number;
  dayName:     string;
  dayShort:    string;
  isRest:      boolean;
  routineType: { id: number; category: string; description: string | null } | null;
  exercises:   Exercise[];
}

/** Emoji por categoría de rutina */
export const CATEGORY_EMOJI: Record<string, string> = {
  push:  "💪",
  pull:  "🏋️",
  leg:   "🦵",
  upper: "🔥",
  lower: "⚡",
  full:  "🔄",
};

// ── Catálogo ──────────────────────────────────────────────────────────────────

export interface RoutineType {
  id: number;
  category: string;          // push | pull | leg | rest
  daysOfTheWeek: string;     // "lunes,miercoles"
  description?: string | null;
  exercises?: Exercise[];
}

export interface Exercise {
  id: number;
  name: string;
  description?: string | null;
  series: number;
  repetitions: number;
  muscleTags: string;         // "bícep,antebrazo"
  routineTypeIdFk?: number | null;
  routineType?: RoutineType | null;
}

// ── Logs de entrenamiento ─────────────────────────────────────────────────────

/** Snapshot del ejercicio en el momento del log */
export interface ExerciseSnapshot {
  name: string;
  description?: string | null;
  series: number;
  repetitions: number;
  muscleTags: string;
}

export interface TrainingLog {
  id: number;
  exerciseIdFk?: number | null;
  weightKg?: number | null;
  repetitionsDone: number;
  trainingDate: string;       // ISO date string: "yyyy-MM-dd"
  startTime?: string | null;  // "HH:mm:ss"
  endTime?: string | null;
  exerciseDetails: ExerciseSnapshot;
}
