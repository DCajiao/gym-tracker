import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { format } from "date-fns";
import type { Exercise } from "@/types/workout";
import type { SessionStatePayload } from "@/lib/api";
import { api } from "@/lib/api";
import { useSaveExerciseLog } from "@/hooks/useSaveExerciseLog";

export interface ExerciseProgress {
  sets: boolean[];
  startTime: string | null;
  endTime: string | null;
  saved: boolean;
  weight: number | null;
}

interface SessionState {
  isActive: boolean;
  date: string;
  exercises: Record<number, ExerciseProgress>;
}

interface WorkoutSessionContextValue {
  isActive: boolean;
  isRestoring: boolean;
  startSession: (exercises: Exercise[]) => void;
  endSession: () => void;
  toggleSet: (exerciseId: number, setIndex: number, exercise: Exercise) => void;
  setExerciseWeight: (exerciseId: number, weight: number | null) => void;
  getProgress: (exerciseId: number) => ExerciseProgress | undefined;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextValue | null>(null);

function syncSession(state: SessionState) {
  const payload: SessionStatePayload = { date: state.date, exercises: state.exercises };
  api.workoutSessions.upsertActive(state.date, payload).catch(() => {});
}

export const WorkoutSessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession]         = useState<SessionState | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const sessionRef  = useRef<SessionState | null>(null);
  const weightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveLog     = useSaveExerciseLog();

  // ── Restore active session from DB on mount ───────────────────────────────
  useEffect(() => {
    api.workoutSessions.getActive()
      .then((record) => {
        if (record?.isActive && record.state) {
          const payload = record.state as SessionStatePayload;
          const restored: SessionState = {
            isActive: true,
            date: payload.date,
            exercises: payload.exercises as Record<number, ExerciseProgress>,
          };
          sessionRef.current = restored;
          setSession(restored);
        }
      })
      .catch(() => {})
      .finally(() => setIsRestoring(false));
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const startSession = useCallback((exercises: Exercise[]) => {
    const exerciseMap: Record<number, ExerciseProgress> = {};
    for (const ex of exercises) {
      exerciseMap[ex.id] = {
        sets: new Array(ex.series).fill(false),
        startTime: null,
        endTime: null,
        saved: false,
        weight: ex.defaultWeight != null ? Number(ex.defaultWeight) : null,
      };
    }
    const newState: SessionState = {
      isActive: true,
      date: format(new Date(), "yyyy-MM-dd"),
      exercises: exerciseMap,
    };
    sessionRef.current = newState;
    setSession(newState);
    syncSession(newState); // crear inmediatamente en DB
  }, []);

  const endSession = useCallback(() => {
    api.workoutSessions.endActive().catch(() => {});
    sessionRef.current = null;
    setSession(null);
  }, []);

  const toggleSet = useCallback(
    (exerciseId: number, setIndex: number, exercise: Exercise) => {
      const prev = sessionRef.current;
      if (!prev) return;
      const progress = prev.exercises[exerciseId];
      if (!progress || progress.saved) return;

      const now        = format(new Date(), "HH:mm:ss");
      const newSets    = progress.sets.map((v, i) => (i === setIndex ? !v : v));
      const isFirstSet = !progress.startTime && newSets.some(Boolean);
      const allDone    = newSets.every(Boolean);

      const updated: ExerciseProgress = {
        ...progress,
        sets:      newSets,
        startTime: isFirstSet ? now : progress.startTime,
        endTime:   allDone    ? now : progress.endTime,
      };

      const newState: SessionState = {
        ...prev,
        exercises: { ...prev.exercises, [exerciseId]: updated },
      };

      // Sync inmediato a DB — esto es lo que garantiza que un refresh no pierda datos
      sessionRef.current = newState;
      setSession(newState);
      syncSession(newState);

      if (allDone) {
        saveLog.mutate(
          {
            exerciseIdFk:    exerciseId,
            weightKg:        updated.weight,
            repetitionsDone: exercise.series * exercise.repetitions,
            trainingDate:    prev.date,
            startTime:       updated.startTime,
            endTime:         updated.endTime,
            exerciseDetails: {
              name:        exercise.name,
              description: exercise.description ?? null,
              series:      exercise.series,
              repetitions: exercise.repetitions,
              muscleTags:  exercise.muscleTags,
            },
          },
          {
            onSuccess: () => {
              setSession((s) => {
                if (!s) return s;
                const next = {
                  ...s,
                  exercises: {
                    ...s.exercises,
                    [exerciseId]: { ...s.exercises[exerciseId], saved: true },
                  },
                };
                sessionRef.current = next;
                // Sync the saved=true flag to DB
                syncSession(next);
                return next;
              });
            },
          }
        );
      }
    },
    [saveLog]
  );

  const setExerciseWeight = useCallback(
    (exerciseId: number, weight: number | null) => {
      const prev = sessionRef.current;
      if (!prev) return;

      const newState: SessionState = {
        ...prev,
        exercises: {
          ...prev.exercises,
          [exerciseId]: { ...prev.exercises[exerciseId], weight },
        },
      };
      sessionRef.current = newState;
      setSession(newState);

      // Debounce: sync session + actualizar default en ejercicio
      if (weightTimer.current) clearTimeout(weightTimer.current);
      weightTimer.current = setTimeout(() => {
        syncSession(newState);
        if (weight !== null) {
          api.exercises.updateWeight(exerciseId, weight).catch(() => {});
        }
      }, 800);
    },
    []
  );

  const getProgress = useCallback(
    (exerciseId: number) => sessionRef.current?.exercises[exerciseId],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session] // re-derivar cuando cambie session para que los componentes re-rendericen
  );

  return (
    <WorkoutSessionContext.Provider
      value={{
        isActive: session?.isActive ?? false,
        isRestoring,
        startSession,
        endSession,
        toggleSet,
        setExerciseWeight,
        getProgress,
      }}
    >
      {children}
    </WorkoutSessionContext.Provider>
  );
};

export const useWorkoutSession = () => {
  const ctx = useContext(WorkoutSessionContext);
  if (!ctx) throw new Error("useWorkoutSession must be used within WorkoutSessionProvider");
  return ctx;
};
