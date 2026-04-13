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

interface ExerciseProgress {
  sets: boolean[];
  startTime: string | null;
  endTime: string | null;
  saved: boolean;
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
  getProgress: (exerciseId: number) => ExerciseProgress | undefined;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextValue | null>(null);

// Debounce delay for syncing state to DB (ms)
const SYNC_DELAY = 600;

export const WorkoutSessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession]       = useState<SessionState | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const saveLog  = useSaveExerciseLog();
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Restore active session from DB on mount ───────────────────────────────
  useEffect(() => {
    api.workoutSessions.getActive()
      .then((record) => {
        if (record?.isActive && record.state) {
          const payload = record.state as SessionStatePayload;
          setSession({
            isActive: true,
            date: payload.date,
            exercises: payload.exercises as Record<number, ExerciseProgress>,
          });
        }
      })
      .catch(() => { /* auth not ready yet or no session */ })
      .finally(() => setIsRestoring(false));
  }, []);

  // ── Debounced sync to DB whenever session changes ─────────────────────────
  useEffect(() => {
    if (!session?.isActive) return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      const payload: SessionStatePayload = {
        date: session.date,
        exercises: session.exercises,
      };
      api.workoutSessions.upsertActive(session.date, payload).catch(() => {
        // Silent fail — state is still in memory
      });
    }, SYNC_DELAY);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [session]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const startSession = useCallback((exercises: Exercise[]) => {
    const exerciseMap: Record<number, ExerciseProgress> = {};
    for (const ex of exercises) {
      exerciseMap[ex.id] = {
        sets: new Array(ex.series).fill(false),
        startTime: null,
        endTime: null,
        saved: false,
      };
    }
    setSession({
      isActive: true,
      date: format(new Date(), "yyyy-MM-dd"),
      exercises: exerciseMap,
    });
  }, []);

  const endSession = useCallback(() => {
    api.workoutSessions.endActive().catch(() => {});
    setSession(null);
  }, []);

  const toggleSet = useCallback(
    (exerciseId: number, setIndex: number, exercise: Exercise) => {
      setSession((prev) => {
        if (!prev) return prev;
        const progress = prev.exercises[exerciseId];
        if (!progress || progress.saved) return prev;

        const now = format(new Date(), "HH:mm:ss");
        const newSets = progress.sets.map((v, i) => (i === setIndex ? !v : v));
        const isFirstSet = !progress.startTime && newSets.some(Boolean);
        const allDone = newSets.every(Boolean);

        const updated: ExerciseProgress = {
          ...progress,
          sets: newSets,
          startTime: isFirstSet ? now : progress.startTime,
          endTime: allDone ? now : progress.endTime,
        };

        if (allDone) {
          saveLog.mutate(
            {
              exerciseIdFk: exerciseId,
              weightKg: null,
              repetitionsDone: exercise.series * exercise.repetitions,
              trainingDate: prev.date,
              startTime: updated.startTime,
              endTime: updated.endTime,
              exerciseDetails: {
                name: exercise.name,
                description: exercise.description ?? null,
                series: exercise.series,
                repetitions: exercise.repetitions,
                muscleTags: exercise.muscleTags,
              },
            },
            {
              onSuccess: () => {
                setSession((s) => {
                  if (!s) return s;
                  return {
                    ...s,
                    exercises: {
                      ...s.exercises,
                      [exerciseId]: { ...s.exercises[exerciseId], saved: true },
                    },
                  };
                });
              },
            }
          );
        }

        return {
          ...prev,
          exercises: { ...prev.exercises, [exerciseId]: updated },
        };
      });
    },
    [saveLog]
  );

  const getProgress = useCallback(
    (exerciseId: number) => session?.exercises[exerciseId],
    [session]
  );

  return (
    <WorkoutSessionContext.Provider
      value={{
        isActive: session?.isActive ?? false,
        isRestoring,
        startSession,
        endSession,
        toggleSet,
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
