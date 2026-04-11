import { useState, useMemo } from "react";
import { useHistory } from "@/hooks/useHistory";
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import PageHeader from "./PageHeader";
import HistoryLogCard from "./HistoryLogCard";

type FilterType = "all" | "week" | "month" | "custom";

const filters: { key: FilterType; label: string }[] = [
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
  { key: "all", label: "Todo" },
  { key: "custom", label: "Fecha" },
];

const HistoryPanel = () => {
  const [filter, setFilter] = useState<FilterType>("week");
  const [customDate, setCustomDate] = useState<Date | undefined>(new Date());
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const { data: workoutHistory = [], isLoading } = useHistory();

  const filteredLogs = useMemo(() => {
    const now = new Date();
    return workoutHistory.filter((log) => {
      const date = parseISO(log.date);
      switch (filter) {
        case "week":
          return isWithinInterval(date, {
            start: startOfWeek(now, { weekStartsOn: 1 }),
            end: endOfWeek(now, { weekStartsOn: 1 }),
          });
        case "month":
          return isWithinInterval(date, {
            start: startOfMonth(now),
            end: endOfMonth(now),
          });
        case "custom":
          if (!customDate) return true;
          return log.date === format(customDate, "yyyy-MM-dd");
        default:
          return true;
      }
    });
  }, [filter, customDate]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <h1 className="text-lg font-bold flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary" />
          Historial
        </h1>

        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filter === "custom" && (
          <div className="mt-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {customDate ? format(customDate, "PPP", { locale: es }) : "Selecciona fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarPicker
                  mode="single"
                  selected={customDate}
                  onSelect={setCustomDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </PageHeader>

      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Cargando...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay entrenamientos en este período</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <HistoryLogCard
                key={log.date}
                log={log}
                isExpanded={expandedLog === log.date}
                onToggle={() => setExpandedLog(expandedLog === log.date ? null : log.date)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPanel;
