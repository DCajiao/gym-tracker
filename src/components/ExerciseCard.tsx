import { useState } from "react";
import type { Exercise } from "@/types/workout";
import { useWorkoutSession } from "@/context/WorkoutSessionContext";
import { Check, ChevronDown, ChevronUp, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

const ExerciseCard = ({ exercise, index }: ExerciseCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { isActive, toggleSet, setExerciseWeight, getProgress } = useWorkoutSession();

  const progress       = getProgress(exercise.id);
  const sets           = progress?.sets ?? new Array(exercise.series).fill(false);
  const saved          = progress?.saved ?? false;
  const currentWeight  = progress?.weight ?? null;
  const completedCount = sets.filter(Boolean).length;
  const allDone        = completedCount === exercise.series;
  const muscleTags     = exercise.muscleTags.split(",").map((t) => t.trim());

  const handleSetClick = (si: number) => {
    if (!isActive || saved) return;
    toggleSet(exercise.id, si, exercise);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setExerciseWeight(exercise.id, val === "" ? null : parseFloat(val));
  };

  return (
    <div
      className={cn(
        "glass-card overflow-hidden transition-all duration-200",
        allDone && "border-success/40 bg-success/5"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4"
      >
        {/* Index / status badge */}
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all",
            allDone
              ? "bg-success text-white"
              : "bg-secondary text-muted-foreground"
          )}
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}
        >
          {saved ? (
            <Check className="w-4 h-4" />
          ) : allDone ? (
            <Check className="w-4 h-4" />
          ) : (
            index + 1
          )}
        </div>

        <div className="flex-1 text-left min-w-0">
          <h3
            className={cn("font-semibold text-sm truncate", allDone && "text-success")}
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: "1rem", letterSpacing: "0.01em" }}
          >
            {exercise.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Dumbbell className="w-3 h-3 shrink-0" />
            {muscleTags[0]}
            {muscleTags.length > 1 && ` +${muscleTags.length - 1}`}
            {" · "}
            {exercise.series}×{exercise.repetitions}
            {currentWeight != null && (
              <span className="text-primary font-semibold">· {currentWeight}kg</span>
            )}
            {isActive && completedCount > 0 && !allDone && (
              <span className="text-primary font-semibold">
                ({completedCount}/{exercise.series})
              </span>
            )}
          </p>
        </div>

        {/* Progress dots */}
        {isActive && (
          <div className="flex gap-1 shrink-0 mr-1">
            {sets.map((done, si) => (
              <span
                key={si}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  done ? "bg-success" : "bg-secondary"
                )}
              />
            ))}
          </div>
        )}

        {expanded
          ? <ChevronUp  className="w-4 h-4 text-muted-foreground shrink-0" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        }
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 slide-up">
          {/* Muscle tags */}
          <div className="flex flex-wrap gap-1.5">
            {muscleTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>

          {exercise.description && (
            <p className="text-xs text-muted-foreground bg-secondary/60 rounded-lg px-3 py-2">
              {exercise.description}
            </p>
          )}

          {/* Weight input — solo visible durante sesión activa */}
          {isActive && !saved && (
            <div className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 border",
              completedCount > 0
                ? "bg-secondary/20 border-border"
                : "bg-secondary/40 border-primary/20"
            )}>
              <Dumbbell className="w-4 h-4 text-primary shrink-0" />
              <label className="text-xs text-muted-foreground shrink-0 font-medium">Peso kg</label>
              {completedCount > 0 ? (
                <span className="flex-1 stat-number text-base text-right text-foreground">
                  {currentWeight != null ? currentWeight : "—"}
                </span>
              ) : (
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={currentWeight ?? ""}
                  onChange={handleWeightChange}
                  placeholder="—"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 bg-transparent stat-number text-base text-right focus:outline-none min-w-0 placeholder:text-muted-foreground/40"
                />
              )}
            </div>
          )}

          {/* Sets */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-[2rem_1fr_2.5rem] gap-2 text-[9px] uppercase tracking-widest text-muted-foreground px-1 font-semibold">
              <span>Set</span>
              <span>Objetivo</span>
              <span />
            </div>

            {sets.map((done, si) => (
              <button
                key={si}
                onClick={() => handleSetClick(si)}
                disabled={!isActive || saved}
                className={cn(
                  "grid grid-cols-[2rem_1fr_2.5rem] gap-2 items-center w-full rounded-lg px-2 py-2.5 transition-all text-sm",
                  done
                    ? "bg-success/10 border border-success/20"
                    : "bg-secondary/50 border border-transparent",
                  (!isActive || saved) && "cursor-default"
                )}
              >
                <span
                  className="font-bold text-xs text-muted-foreground"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  {si + 1}
                </span>
                <span
                  className={cn("font-semibold text-left text-sm", done && "text-success")}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                >
                  {exercise.repetitions} reps
                </span>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto transition-all",
                    done
                      ? "bg-success border-success set-done-anim"
                      : "border-border"
                  )}
                >
                  {done && <Check className="w-3.5 h-3.5 text-background" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseCard;
