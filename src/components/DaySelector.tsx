import type { DaySchedule } from "@/types/workout";
import { cn } from "@/lib/utils";

interface DaySelectorProps {
  days: DaySchedule[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  todayIndex: number;
}

const DaySelector = ({ days, selectedDay, onSelectDay, todayIndex }: DaySelectorProps) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {days.map((day, i) => {
        const isSelected = selectedDay === i;
        const isToday    = i === todayIndex;
        const label      = day.isRest ? "REST" : (day.routineType?.category ?? "—").toUpperCase();

        return (
          <button
            key={day.dayName}
            onClick={() => onSelectDay(i)}
            className={cn(
              "flex flex-col items-center min-w-[3.25rem] px-2.5 py-2 rounded-lg transition-all duration-200 shrink-0",
              isSelected
                ? "bg-primary text-primary-foreground"
                : isToday
                ? "bg-secondary text-foreground ring-1 ring-primary/40"
                : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
            )}
          >
            <span
              className={cn(
                "text-[9px] font-semibold uppercase tracking-widest",
                isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
              )}
            >
              {day.dayShort}
            </span>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wide mt-0.5 leading-none",
                "font-display",
                isSelected ? "text-primary-foreground" : isToday ? "text-primary" : ""
              )}
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
