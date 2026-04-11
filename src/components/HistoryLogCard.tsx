import type { WorkoutLog } from "@/types/workout";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp, Clock, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface HistoryLogCardProps {
  log: WorkoutLog;
  isExpanded: boolean;
  onToggle: () => void;
}

const HistoryLogCard = ({ log, isExpanded, onToggle }: HistoryLogCardProps) => {
  const completionRate = Math.round((log.completedSets / log.totalSets) * 100);

  return (
    <div className="glass-card overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-3">
        <span className="text-2xl">{log.emoji}</span>
        <div className="flex-1 text-left min-w-0">
          <h3 className="font-semibold text-sm truncate">{log.routineName}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(parseISO(log.date), "EEEE d MMM", { locale: es })}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div
            className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              completionRate >= 90
                ? "bg-success/15 text-success"
                : completionRate >= 70
                ? "bg-primary/15 text-primary"
                : "bg-warning/15 text-warning"
            )}
          >
            {completionRate}%
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
              <Flame className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Volumen</p>
              <p className="text-sm font-bold">{(log.totalVolume / 1000).toFixed(1)}t</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
              <TrendingUp className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Series</p>
              <p className="text-sm font-bold">
                {log.completedSets}/{log.totalSets}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
              <Clock className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Tiempo</p>
              <p className="text-sm font-bold">{log.durationMinutes}m</p>
            </div>
          </div>

          <div className="space-y-1.5">
            {log.exercises.map((ex, i) => {
              const done = ex.sets.filter((s) => s.completed).length;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between bg-secondary/30 rounded-lg px-3 py-2 text-sm"
                >
                  <span className="truncate flex-1">{ex.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {done}/{ex.sets.length} sets
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryLogCard;
