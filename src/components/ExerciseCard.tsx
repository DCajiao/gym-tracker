import { useState } from "react";
import type { Exercise } from "@/types/workout";
import { Check, ChevronDown, ChevronUp, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

const ExerciseCard = ({ exercise, index }: ExerciseCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [completedSets, setCompletedSets] = useState<boolean[]>(
    new Array(exercise.series).fill(false)
  );

  const toggleSet = (i: number) =>
    setCompletedSets((prev) => prev.map((v, j) => (j === i ? !v : v)));

  const completedCount = completedSets.filter(Boolean).length;
  const allDone = completedCount === exercise.series;
  const muscleTags = exercise.muscleTags.split(",").map((t) => t.trim());

  return (
    <div
      className={cn(
        "glass-card overflow-hidden transition-all duration-300",
        allDone && "ring-1 ring-success/30 bg-success/5"
      )}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4"
      >
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
            allDone ? "bg-success/20 text-success" : "bg-primary/10 text-primary"
          )}
        >
          {allDone ? <Check className="w-5 h-5" /> : index + 1}
        </div>

        <div className="flex-1 text-left min-w-0">
          <h3 className={cn("font-semibold text-sm truncate", allDone && "text-success")}>
            {exercise.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <Dumbbell className="w-3 h-3 shrink-0" />
            {muscleTags[0]}
            {muscleTags.length > 1 && ` +${muscleTags.length - 1}`}
            {" · "}
            {exercise.series} series × {exercise.repetitions} reps
            {completedCount > 0 && (
              <span className="text-primary font-medium">
                ({completedCount}/{exercise.series})
              </span>
            )}
          </p>
        </div>

        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          {/* Muscle tags */}
          <div className="flex flex-wrap gap-1.5">
            {muscleTags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {exercise.description && (
            <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
              📝 {exercise.description}
            </p>
          )}

          {/* Sets */}
          <div className="space-y-2">
            <div className="grid grid-cols-[2rem_1fr_2.5rem] gap-2 text-[10px] uppercase tracking-wider text-muted-foreground px-1">
              <span>Set</span>
              <span>Objetivo</span>
              <span />
            </div>

            {completedSets.map((done, si) => (
              <button
                key={si}
                onClick={() => toggleSet(si)}
                className={cn(
                  "grid grid-cols-[2rem_1fr_2.5rem] gap-2 items-center w-full rounded-lg px-2 py-2.5 transition-all text-sm",
                  done ? "bg-success/10 text-success" : "bg-secondary/30 text-foreground"
                )}
              >
                <span className="font-medium text-xs text-muted-foreground">{si + 1}</span>
                <span className="font-semibold text-left">{exercise.repetitions} reps</span>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center mx-auto transition-all",
                    done ? "bg-success border-success" : "border-muted-foreground/30"
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
