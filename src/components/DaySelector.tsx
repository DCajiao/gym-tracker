import type { DaySchedule } from "@/types/workout";
import { CATEGORY_EMOJI } from "@/types/workout";
import { cn } from "@/lib/utils";

interface DaySelectorProps {
  days: DaySchedule[];
  selectedDay: number;
  onSelectDay: (day: number) => void;
  todayIndex: number;
}

const DaySelector = ({ days, selectedDay, onSelectDay, todayIndex }: DaySelectorProps) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-2 px-1 scrollbar-hide">
      {days.map((day, i) => {
        const emoji = day.isRest
          ? "😴"
          : CATEGORY_EMOJI[day.routineType?.category ?? ""] ?? "🏋️";

        return (
          <button
            key={day.dayName}
            onClick={() => onSelectDay(i)}
            className={cn(
              "flex flex-col items-center min-w-[3rem] px-2 py-2.5 rounded-xl transition-all duration-200",
              "text-xs font-medium",
              selectedDay === i
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : i === todayIndex
                ? "bg-secondary text-foreground ring-1 ring-primary/30"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            )}
          >
            <span className="text-[10px] uppercase tracking-wider">{day.dayShort}</span>
            <span className="text-base mt-0.5">{emoji}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
