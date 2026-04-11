/** Shared types for the GymTracker app */

export type Tab = "workout" | "history" | "insights";

export interface ExerciseSet {
  reps: number;
  weight: number; // kg
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  sets: ExerciseSet[];
  restSeconds: number;
  notes?: string;
}

export interface DayRoutine {
  dayName: string;
  dayShort: string;
  routineName: string;
  emoji: string;
  exercises: Exercise[];
  isRest: boolean;
}

export interface LoggedSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface LoggedExercise {
  name: string;
  muscleGroup: string;
  sets: LoggedSet[];
}

export interface WorkoutLog {
  date: string; // yyyy-MM-dd
  dayIndex: number;
  routineName: string;
  emoji: string;
  exercises: LoggedExercise[];
  totalSets: number;
  completedSets: number;
  totalVolume: number; // kg
  durationMinutes: number;
}
