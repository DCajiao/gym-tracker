import type { DaySummary } from "@/lib/training";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronDown, ChevronUp } from "lucide-react";

interface HistoryLogCardProps {
  day: DaySummary;
  isExpanded: boolean;
  onToggle: () => void;
}

const HistoryLogCard = ({ day, isExpanded, onToggle }: HistoryLogCardProps) => {
  return (
    <div className="glass-card overflow-hidden accent-border-l">
      <button onClick={onToggle} className="w-full p-4 flex items-center gap-3">
        <div className="flex-1 text-left min-w-0">
          <h3
            className="font-bold capitalize text-base leading-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
          >
            {format(parseISO(day.date), "EEEE d MMM", { locale: es })}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {day.exercises.map((e) => e.name).join(" · ")}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            {day.totalVolume > 0 && (
              <p className="stat-number text-lg text-primary leading-none">
                {(day.totalVolume / 1000).toFixed(1)}
                <span className="text-[10px] text-muted-foreground font-body ml-0.5">t</span>
              </p>
            )}
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
              {day.totalSets} sets
            </p>
          </div>
          {isExpanded
            ? <ChevronUp  className="w-4 h-4 text-muted-foreground" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
          }
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-2 slide-up">
          {day.exercises.map((ex) => (
            <div
              key={ex.name}
              className="bg-secondary/50 rounded-lg px-3 py-2.5"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="font-bold text-sm truncate flex-1"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                >
                  {ex.name}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider ml-2">
                  {ex.sets.length} sets
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {ex.sets.map((s, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold uppercase tracking-wide"
                  >
                    {s.weightKg ? `${s.weightKg}kg` : "PC"} × {s.repetitionsDone}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryLogCard;
