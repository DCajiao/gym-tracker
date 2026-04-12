import type { DaySummary } from "@/lib/training";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp, Flame, TrendingUp } from "lucide-react";

interface HistoryLogCardProps {
  day: DaySummary;
  isExpanded: boolean;
  onToggle: () => void;
}

const HistoryLogCard = ({ day, isExpanded, onToggle }: HistoryLogCardProps) => {
  return (
    <div className="glass-card overflow-hidden">
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-3">
        <div className="flex-1 text-left min-w-0">
          <h3 className="font-semibold text-sm capitalize">
            {format(parseISO(day.date), "EEEE d MMM", { locale: es })}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {day.exercises.map((e) => e.name).join(" · ")}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs font-bold text-primary">
              {(day.totalVolume / 1000).toFixed(1)}t
            </p>
            <p className="text-[10px] text-muted-foreground">{day.totalSets} sets</p>
          </div>
          {isExpanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
          }
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
              <Flame className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Volumen</p>
              <p className="text-sm font-bold">{(day.totalVolume / 1000).toFixed(1)}t</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
              <TrendingUp className="w-3.5 h-3.5 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Series</p>
              <p className="text-sm font-bold">{day.totalSets}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            {day.exercises.map((ex) => (
              <div
                key={ex.name}
                className="bg-secondary/30 rounded-lg px-3 py-2 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate flex-1">{ex.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {ex.sets.length} sets
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ex.sets.map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                    >
                      {s.weightKg ? `${s.weightKg}kg` : "PC"} × {s.repetitionsDone}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryLogCard;
