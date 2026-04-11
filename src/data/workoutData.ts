import type { DayRoutine } from "@/types/workout";

export { type DayRoutine, type Exercise, type ExerciseSet } from "@/types/workout";

export const weekRoutine: DayRoutine[] = [
  {
    dayName: "Lunes",
    dayShort: "Lun",
    routineName: "Push (Pecho & Tríceps)",
    emoji: "💪",
    isRest: false,
    exercises: [
      {
        id: "bench-press",
        name: "Press de Banca",
        muscleGroup: "Pecho",
        sets: [
          { reps: 10, weight: 60 },
          { reps: 8, weight: 70 },
          { reps: 6, weight: 80 },
          { reps: 6, weight: 80 },
        ],
        restSeconds: 120,
      },
      {
        id: "incline-db",
        name: "Press Inclinado Mancuernas",
        muscleGroup: "Pecho Superior",
        sets: [
          { reps: 12, weight: 22 },
          { reps: 10, weight: 24 },
          { reps: 10, weight: 24 },
        ],
        restSeconds: 90,
      },
      {
        id: "cable-fly",
        name: "Aperturas en Polea",
        muscleGroup: "Pecho",
        sets: [
          { reps: 15, weight: 15 },
          { reps: 12, weight: 17.5 },
          { reps: 12, weight: 17.5 },
        ],
        restSeconds: 60,
      },
      {
        id: "ohp",
        name: "Press Militar",
        muscleGroup: "Hombro",
        sets: [
          { reps: 10, weight: 40 },
          { reps: 8, weight: 45 },
          { reps: 8, weight: 45 },
        ],
        restSeconds: 90,
      },
      {
        id: "lateral-raise",
        name: "Elevaciones Laterales",
        muscleGroup: "Hombro",
        sets: [
          { reps: 15, weight: 10 },
          { reps: 15, weight: 10 },
          { reps: 12, weight: 12 },
        ],
        restSeconds: 60,
      },
      {
        id: "tricep-pushdown",
        name: "Jalón de Tríceps",
        muscleGroup: "Tríceps",
        sets: [
          { reps: 12, weight: 25 },
          { reps: 12, weight: 25 },
          { reps: 10, weight: 30 },
        ],
        restSeconds: 60,
      },
    ],
  },
  {
    dayName: "Martes",
    dayShort: "Mar",
    routineName: "Pull (Espalda & Bíceps)",
    emoji: "🏋️",
    isRest: false,
    exercises: [
      {
        id: "deadlift",
        name: "Peso Muerto",
        muscleGroup: "Espalda Baja",
        sets: [
          { reps: 8, weight: 100 },
          { reps: 6, weight: 120 },
          { reps: 6, weight: 120 },
          { reps: 5, weight: 130 },
        ],
        restSeconds: 180,
      },
      {
        id: "pullups",
        name: "Dominadas",
        muscleGroup: "Espalda",
        sets: [
          { reps: 10, weight: 0 },
          { reps: 8, weight: 0 },
          { reps: 8, weight: 0 },
        ],
        restSeconds: 120,
        notes: "Peso corporal",
      },
      {
        id: "barbell-row",
        name: "Remo con Barra",
        muscleGroup: "Espalda",
        sets: [
          { reps: 10, weight: 60 },
          { reps: 8, weight: 70 },
          { reps: 8, weight: 70 },
        ],
        restSeconds: 90,
      },
      {
        id: "face-pull",
        name: "Face Pull",
        muscleGroup: "Espalda/Hombro",
        sets: [
          { reps: 15, weight: 15 },
          { reps: 15, weight: 15 },
          { reps: 15, weight: 15 },
        ],
        restSeconds: 60,
      },
      {
        id: "barbell-curl",
        name: "Curl con Barra",
        muscleGroup: "Bíceps",
        sets: [
          { reps: 12, weight: 25 },
          { reps: 10, weight: 30 },
          { reps: 10, weight: 30 },
        ],
        restSeconds: 60,
      },
      {
        id: "hammer-curl",
        name: "Curl Martillo",
        muscleGroup: "Bíceps",
        sets: [
          { reps: 12, weight: 12 },
          { reps: 12, weight: 14 },
          { reps: 10, weight: 14 },
        ],
        restSeconds: 60,
      },
    ],
  },
  {
    dayName: "Miércoles",
    dayShort: "Mié",
    routineName: "Pierna",
    emoji: "🦵",
    isRest: false,
    exercises: [
      {
        id: "squat",
        name: "Sentadilla",
        muscleGroup: "Cuádriceps",
        sets: [
          { reps: 10, weight: 80 },
          { reps: 8, weight: 90 },
          { reps: 6, weight: 100 },
          { reps: 6, weight: 100 },
        ],
        restSeconds: 150,
      },
      {
        id: "leg-press",
        name: "Prensa de Pierna",
        muscleGroup: "Cuádriceps",
        sets: [
          { reps: 12, weight: 150 },
          { reps: 10, weight: 180 },
          { reps: 10, weight: 180 },
        ],
        restSeconds: 120,
      },
      {
        id: "rdl",
        name: "Peso Muerto Rumano",
        muscleGroup: "Isquiotibiales",
        sets: [
          { reps: 12, weight: 60 },
          { reps: 10, weight: 70 },
          { reps: 10, weight: 70 },
        ],
        restSeconds: 90,
      },
      {
        id: "leg-curl",
        name: "Curl de Pierna",
        muscleGroup: "Isquiotibiales",
        sets: [
          { reps: 12, weight: 40 },
          { reps: 12, weight: 40 },
          { reps: 10, weight: 45 },
        ],
        restSeconds: 60,
      },
      {
        id: "calf-raise",
        name: "Elevación de Gemelos",
        muscleGroup: "Gemelos",
        sets: [
          { reps: 15, weight: 80 },
          { reps: 15, weight: 80 },
          { reps: 15, weight: 80 },
        ],
        restSeconds: 60,
      },
    ],
  },
  {
    dayName: "Jueves",
    dayShort: "Jue",
    routineName: "Descanso Activo",
    emoji: "🧘",
    isRest: true,
    exercises: [],
  },
  {
    dayName: "Viernes",
    dayShort: "Vie",
    routineName: "Upper Body",
    emoji: "🔥",
    isRest: false,
    exercises: [
      {
        id: "incline-bench",
        name: "Press Inclinado Barra",
        muscleGroup: "Pecho Superior",
        sets: [
          { reps: 10, weight: 50 },
          { reps: 8, weight: 60 },
          { reps: 8, weight: 60 },
        ],
        restSeconds: 120,
      },
      {
        id: "weighted-pullup",
        name: "Dominada Lastrada",
        muscleGroup: "Espalda",
        sets: [
          { reps: 8, weight: 10 },
          { reps: 6, weight: 15 },
          { reps: 6, weight: 15 },
        ],
        restSeconds: 120,
      },
      {
        id: "db-shoulder-press",
        name: "Press Hombro Mancuernas",
        muscleGroup: "Hombro",
        sets: [
          { reps: 10, weight: 18 },
          { reps: 10, weight: 20 },
          { reps: 8, weight: 22 },
        ],
        restSeconds: 90,
      },
      {
        id: "cable-row",
        name: "Remo en Polea",
        muscleGroup: "Espalda",
        sets: [
          { reps: 12, weight: 50 },
          { reps: 10, weight: 55 },
          { reps: 10, weight: 55 },
        ],
        restSeconds: 90,
      },
      {
        id: "dips",
        name: "Fondos",
        muscleGroup: "Pecho/Tríceps",
        sets: [
          { reps: 12, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
        ],
        restSeconds: 90,
        notes: "Peso corporal",
      },
      {
        id: "ez-curl",
        name: "Curl Barra EZ",
        muscleGroup: "Bíceps",
        sets: [
          { reps: 12, weight: 20 },
          { reps: 10, weight: 25 },
          { reps: 10, weight: 25 },
        ],
        restSeconds: 60,
      },
    ],
  },
  {
    dayName: "Sábado",
    dayShort: "Sáb",
    routineName: "Pierna & Core",
    emoji: "⚡",
    isRest: false,
    exercises: [
      {
        id: "front-squat",
        name: "Sentadilla Frontal",
        muscleGroup: "Cuádriceps",
        sets: [
          { reps: 8, weight: 60 },
          { reps: 8, weight: 65 },
          { reps: 6, weight: 70 },
        ],
        restSeconds: 120,
      },
      {
        id: "walking-lunge",
        name: "Zancadas con Mancuernas",
        muscleGroup: "Cuádriceps/Glúteo",
        sets: [
          { reps: 12, weight: 16 },
          { reps: 12, weight: 18 },
          { reps: 10, weight: 20 },
        ],
        restSeconds: 90,
      },
      {
        id: "hip-thrust",
        name: "Hip Thrust",
        muscleGroup: "Glúteo",
        sets: [
          { reps: 12, weight: 80 },
          { reps: 10, weight: 90 },
          { reps: 10, weight: 90 },
        ],
        restSeconds: 90,
      },
      {
        id: "leg-ext",
        name: "Extensión de Pierna",
        muscleGroup: "Cuádriceps",
        sets: [
          { reps: 15, weight: 40 },
          { reps: 12, weight: 45 },
          { reps: 12, weight: 45 },
        ],
        restSeconds: 60,
      },
      {
        id: "hanging-leg-raise",
        name: "Elevación de Piernas Colgado",
        muscleGroup: "Abdomen",
        sets: [
          { reps: 15, weight: 0 },
          { reps: 15, weight: 0 },
          { reps: 12, weight: 0 },
        ],
        restSeconds: 60,
      },
    ],
  },
  {
    dayName: "Domingo",
    dayShort: "Dom",
    routineName: "Descanso Total",
    emoji: "😴",
    isRest: true,
    exercises: [],
  },
];

/** Returns rest day indices derived from data (not hardcoded) */
export const restDayIndices: Set<number> = new Set(
  weekRoutine
    .map((day, i) => (day.isRest ? i : -1))
    .filter((i) => i >= 0)
);

export function getTodayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

/** Convert JS Date.getDay() (0=Sun) to our 0=Mon index */
export function jsToRoutineIndex(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}
