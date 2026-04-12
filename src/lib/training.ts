import type { TrainingLog } from "@/types/workout";

/** Snapshot resumido de un ejercicio dentro de un día */
export interface ExerciseSummary {
  name: string;
  muscleTags: string;
  sets: { weightKg: number | null; repetitionsDone: number }[];
}

/** Resumen de todos los sets de un día de entrenamiento */
export interface DaySummary {
  date: string;           // "yyyy-MM-dd"
  exercises: ExerciseSummary[];
  totalSets: number;
  totalVolume: number;    // kg totales (peso × reps)
}

/** Extrae la parte de fecha de un ISO string o Date */
export function toDateStr(raw: string): string {
  return raw.split("T")[0];
}

/** Agrupa TrainingLog[] por fecha, colapsando sets del mismo ejercicio */
export function groupByDate(logs: TrainingLog[]): DaySummary[] {
  const map = new Map<string, Map<string, ExerciseSummary>>();

  for (const log of logs) {
    const date = toDateStr(log.trainingDate as unknown as string);
    if (!map.has(date)) map.set(date, new Map());

    const exMap = map.get(date)!;
    const name = log.exerciseDetails.name;

    if (!exMap.has(name)) {
      exMap.set(name, {
        name,
        muscleTags: log.exerciseDetails.muscleTags,
        sets: [],
      });
    }

    exMap.get(name)!.sets.push({
      weightKg: log.weightKg ? Number(log.weightKg) : null,
      repetitionsDone: log.repetitionsDone,
    });
  }

  return Array.from(map.entries())
    .map(([date, exMap]) => {
      const exercises = Array.from(exMap.values());
      const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);
      const totalVolume = exercises.reduce(
        (a, e) =>
          a +
          e.sets.reduce(
            (b, s) => b + (s.weightKg ?? 0) * s.repetitionsDone,
            0
          ),
        0
      );
      return { date, exercises, totalSets, totalVolume };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}
