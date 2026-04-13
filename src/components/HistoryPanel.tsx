import { useState, useMemo } from "react";
import { useHistory } from "@/hooks/useHistory";
import { groupByDate, toDateStr } from "@/lib/training";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import PageHeader from "./PageHeader";
import HistoryLogCard from "./HistoryLogCard";

type FilterType = "today" | "week" | "month" | "all" | "custom";

const filters: { key: FilterType; label: string }[] = [
  { key: "today",  label: "Hoy"     },
  { key: "week",   label: "Semana"  },
  { key: "month",  label: "Mes"     },
  { key: "all",    label: "Todo"    },
  { key: "custom", label: "Fecha"   },
];

const TODAY = toDateStr(new Date().toISOString());

const HistoryPanel = () => {
  const [filter, setFilter]           = useState<FilterType>("today");
  const [customDate, setCustomDate]   = useState<Date | undefined>(new Date());
  const [expandedDay, setExpandedDay] = useState<string | null>(TODAY);

  const { data: logs = [], isLoading } = useHistory();
  const days = useMemo(() => groupByDate(logs), [logs]);

  const filtered = useMemo(() => {
    const now = new Date();
    return days.filter(({ date }) => {
      const d = parseISO(date);
      switch (filter) {
        case "today":
          return date === TODAY;
        case "week":
          return isWithinInterval(d, {
            start: startOfWeek(now, { weekStartsOn: 1 }),
            end:   endOfWeek(now,   { weekStartsOn: 1 }),
          });
        case "month":
          return isWithinInterval(d, { start: startOfMonth(now), end: endOfMonth(now) });
        case "custom":
          return customDate ? date === toDateStr(customDate.toISOString()) : true;
        default:
          return true;
      }
    });
  }, [days, filter, customDate]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h1
            className="text-xl font-bold uppercase tracking-tight leading-none"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
          >
            Historial
          </h1>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all shrink-0",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {filter === "today"
                ? "Aún no entrenaste hoy"
                : "No hay entrenamientos en este período"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((day) => (
              <HistoryLogCard
                key={day.date}
                day={day}
                isExpanded={expandedDay === day.date}
                onToggle={() => setExpandedDay(expandedDay === day.date ? null : day.date)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPanel;
