import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { format } from "date-fns";
import type { Exercise } from "@/types/workout";
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
  startSession: (exercises: Exercise[]) => void;
  endSession: () => void;
  toggleSet: (exerciseId: number, setIndex: number, exercise: Exercise) => void;
  getProgress: (exerciseId: number) => ExerciseProgress | undefined;
}

const WorkoutSessionContext = createContext<WorkoutSessionContextValue | null>(null);

export const WorkoutSessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<SessionState | null>(null);
  const saveLog = useSaveExerciseLog();

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
      value={{ isActive: session?.isActive ?? false, startSession, endSession, toggleSet, getProgress }}
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
