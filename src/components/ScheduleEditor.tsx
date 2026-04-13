import { useState, useEffect } from "react";
import { useRoutineTypes, useUpdateRoutineType } from "@/hooks/useRoutineTypes";
import { useSchedule } from "@/hooks/useSchedule";
import { CATEGORY_EMOJI } from "@/types/workout";
import { Settings, ChevronDown, ChevronUp, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "./PageHeader";

const DAYS = [
  { index: 0, name: "Lunes",     short: "Lun", key: "lunes"     },
  { index: 1, name: "Martes",    short: "Mar", key: "martes"    },
  { index: 2, name: "Miércoles", short: "Mié", key: "miércoles" },
  { index: 3, name: "Jueves",    short: "Jue", key: "jueves"    },
  { index: 4, name: "Viernes",   short: "Vie", key: "viernes"   },
  { index: 5, name: "Sábado",    short: "Sáb", key: "sábado"    },
  { index: 6, name: "Domingo",   short: "Dom", key: "domingo"   },
];

const ScheduleEditor = () => {
  const { data: schedule = [], isLoading: loadingSchedule } = useSchedule();
  const { data: routineTypes = [], isLoading: loadingTypes }  = useRoutineTypes();
  const updateRoutineType = useUpdateRoutineType();
  const { toast } = useToast();

  // dayIndex → routineType id (null = rest)
  const [assignments, setAssignments] = useState<Record<number, number | null>>({});
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  // Seed local state from the schedule once loaded
  useEffect(() => {
    if (schedule.length === 0) return;
    const map: Record<number, number | null> = {};
    for (const day of schedule) {
      map[day.dayIndex] = day.routineType?.id ?? null;
    }
    setAssignments(map);
    setDirty(false);
  }, [schedule]);

  const assign = (dayIndex: number, rtId: number | null) => {
    setAssignments((prev) => ({ ...prev, [dayIndex]: rtId }));
    setExpandedDay(null);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // For each routine type, recompute its days_of_the_week from current assignments
      const updates = routineTypes.map((rt) => {
        const newDays = DAYS.filter((d) => assignments[d.index] === rt.id)
          .map((d) => d.key)
          .join(",");
        return updateRoutineType.mutateAsync({
          id: rt.id,
          data: { category: rt.category, daysOfTheWeek: newDays, description: rt.description ?? null },
        });
      });
      await Promise.all(updates);
      setDirty(false);
      toast({ title: "Rutina actualizada", description: "Los cambios se guardaron correctamente." });
    } catch {
      toast({ title: "Error al guardar", description: "Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const isLoading = loadingSchedule || loadingTypes;

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Configurar Rutina
        </h1>
        <p className="text-xs text-muted-foreground">Asigna una rutina a cada día de la semana</p>
      </PageHeader>

      <main className="max-w-lg mx-auto px-4 py-4 pb-28 space-y-2">
        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground text-sm">Cargando...</div>
        ) : (
          <>
            {DAYS.map((day) => {
              const assignedId = assignments[day.index] ?? null;
              const assignedRt  = routineTypes.find((r) => r.id === assignedId) ?? null;
              const isExpanded  = expandedDay === day.index;
              const emoji       = assignedRt ? (CATEGORY_EMOJI[assignedRt.category] ?? "🏋️") : "😴";

              return (
                <div key={day.index} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : day.index)}
                    className="w-full flex items-center gap-3 p-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-muted-foreground">{day.short}</span>
                    </div>

                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold">{day.name}</p>
                      {assignedRt ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">
                            {assignedRt.category}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {assignedRt.description}
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">😴 Descanso</p>
                      )}
                    </div>

                    <span className="text-lg shrink-0">{emoji}</span>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                      {/* Rest option */}
                      <button
                        onClick={() => assign(day.index, null)}
                        className={cn(
                          "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                          assignedId === null
                            ? "bg-secondary text-foreground"
                            : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
                        )}
                      >
                        <span className="text-base">😴</span>
                        <span className="flex-1 text-left font-medium">Descanso</span>
                        {assignedId === null && <Check className="w-4 h-4 text-primary" />}
                      </button>

                      {/* Routine type options */}
                      {routineTypes.map((rt) => {
                        const rtEmoji = CATEGORY_EMOJI[rt.category] ?? "🏋️";
                        const isSelected = assignedId === rt.id;
                        return (
                          <button
                            key={rt.id}
                            onClick={() => assign(day.index, rt.id)}
                            className={cn(
                              "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                              isSelected
                                ? "bg-primary/10 text-foreground"
                                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/60"
                            )}
                          >
                            <span className="text-base">{rtEmoji}</span>
                            <div className="flex-1 text-left min-w-0">
                              <span className="font-semibold capitalize">{rt.category}</span>
                              {rt.description && (
                                <span className="text-xs text-muted-foreground ml-2 truncate">
                                  {rt.description}
                                </span>
                              )}
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Save button */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={!dirty || saving}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all",
                  dirty && !saving
                    ? "bg-primary text-primary-foreground active:scale-95"
                    : "bg-secondary text-muted-foreground cursor-default"
                )}
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
                  : "Guardar cambios"
                }
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ScheduleEditor;
