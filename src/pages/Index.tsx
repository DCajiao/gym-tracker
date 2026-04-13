import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Tab } from "@/types/workout";
import { CATEGORY_EMOJI } from "@/types/workout";
import { useSchedule, getTodayIndex } from "@/hooks/useSchedule";
import { useHistory } from "@/hooks/useHistory";
import { groupByDate, toDateStr } from "@/lib/training";
import { WorkoutSessionProvider, useWorkoutSession } from "@/context/WorkoutSessionContext";
import { useAuth } from "@/context/AuthContext";
import DaySelector from "@/components/DaySelector";
import ExerciseCard from "@/components/ExerciseCard";
import RestDayView from "@/components/RestDayView";
import HistoryPanel from "@/components/HistoryPanel";
import InsightsPanel from "@/components/InsightsPanel";
import ScheduleEditor from "@/components/ScheduleEditor";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Dumbbell, Flame, Target, Play, Square, LogOut, CheckCircle2 } from "lucide-react";

const TODAY = toDateStr(new Date().toISOString());

// ── Vista: entreno del día ya completado ──────────────────────────────────────
const CompletedTodayView = ({
  onViewDetails,
}: {
  onViewDetails: () => void;
}) => {
  const { data: logs = [] } = useHistory({ date: TODAY });
  const summary = useMemo(() => {
    const days = groupByDate(logs);
    return days.find((d) => d.date === TODAY) ?? null;
  }, [logs]);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-5">
      <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>

      <div>
        <h2 className="text-xl font-bold">¡Entreno completado!</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {summary && (
        <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
          <div className="glass-card p-3 text-center">
            <p className="text-2xl font-bold text-primary">{summary.exercises.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">ejercicios</p>
          </div>
          <div className="glass-card p-3 text-center">
            <p className="text-2xl font-bold text-primary">{summary.totalSets}</p>
            <p className="text-xs text-muted-foreground mt-0.5">series</p>
          </div>
          {summary.totalVolume > 0 && (
            <div className="glass-card p-3 text-center col-span-2">
              <p className="text-2xl font-bold text-primary">
                {(summary.totalVolume / 1000).toFixed(1)}t
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">volumen total</p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onViewDetails}
        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm active:scale-95 transition-all"
      >
        Ver detalles
      </button>
    </div>
  );
};

// ── Tab de rutina ─────────────────────────────────────────────────────────────
const WorkoutTab = ({ onViewTodayDetails }: { onViewTodayDetails: () => void }) => {
  const todayIndex = getTodayIndex();
  const [selectedDay, setSelectedDay] = useState(todayIndex);

  const { data: schedule, isLoading } = useSchedule();
  const day = schedule?.[selectedDay];

  const { isActive, isRestoring, startSession, endSession } = useWorkoutSession();
  const { user, logout } = useAuth();

  // Detectar si ya hubo entreno hoy (logs del día de hoy)
  const { data: todayLogs = [], isLoading: loadingToday } = useHistory({ date: TODAY });
  const completedToday = todayLogs.length > 0 && !isActive && !isRestoring;

  const totalSets      = day?.exercises.reduce((acc, ex) => acc + ex.series, 0) ?? 0;
  const totalExercises = day?.exercises.length ?? 0;
  const emoji          = day?.routineType ? (CATEGORY_EMOJI[day.routineType.category] ?? "🏋️") : "😴";

  const isToday  = selectedDay === todayIndex;
  const canStart = isToday && !day?.isRest && !isActive && !isRestoring && !completedToday;
  const showEnd  = isActive && isToday;

  return (
    <>
      <PageHeader>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              GymTracker
            </h1>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {isToday ? "Hoy" : day?.dayName ?? ""}
              </p>
              {day?.routineType ? (
                <div className="flex items-center justify-end gap-2 mt-0.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">
                    {day.routineType.category}
                  </span>
                  <span className="text-lg">{emoji}</span>
                </div>
              ) : (
                <p className="text-sm font-semibold text-muted-foreground">{emoji} Descanso</p>
              )}
            </div>
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="h-14 flex items-center text-xs text-muted-foreground">
            Cargando rutina...
          </div>
        ) : schedule ? (
          <DaySelector
            days={schedule}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            todayIndex={todayIndex}
          />
        ) : null}
      </PageHeader>

      <main className="max-w-lg mx-auto px-4 py-4 pb-20">
        {isLoading || loadingToday ? null : day?.isRest ? (
          <RestDayView dayName={day.dayName} />
        ) : isToday && completedToday ? (
          // ── Entreno del día ya completado ──
          <CompletedTodayView onViewDetails={onViewTodayDetails} />
        ) : (
          <>
            {/* Routine type banner */}
            {day?.routineType && (
              <div className="glass-card px-4 py-3 mb-4 flex items-center gap-3">
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                    {day.routineType.category}
                  </p>
                  <p className="text-sm font-semibold leading-tight">
                    {day.routineType.description}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5">
              <StatCard icon={<Target className="w-4 h-4" />} label="Ejercicios" value={`${totalExercises}`} />
              <StatCard icon={<Flame  className="w-4 h-4" />} label="Series Total" value={`${totalSets}`} />
            </div>

            {/* Session control */}
            {isRestoring ? (
              <div className="w-full mb-4 py-3 rounded-xl bg-secondary/30 text-center text-xs text-muted-foreground">
                Recuperando sesión...
              </div>
            ) : canStart ? (
              <button
                onClick={() => day?.exercises && startSession(day.exercises)}
                className="w-full mb-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm transition-all active:scale-95"
              >
                <Play className="w-4 h-4" />
                Iniciar entrenamiento
              </button>
            ) : showEnd ? (
              <button
                onClick={endSession}
                className="w-full mb-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 font-semibold text-sm transition-all active:scale-95"
              >
                <Square className="w-4 h-4" />
                Terminar entrenamiento
              </button>
            ) : null}

            <div className="space-y-3">
              {day?.exercises.map((exercise, i) => (
                <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("workout");

  return (
    <WorkoutSessionProvider>
      <div className="min-h-screen bg-background">
        {activeTab === "workout"  && (
          <WorkoutTab onViewTodayDetails={() => setActiveTab("history")} />
        )}
        {activeTab === "history"  && <HistoryPanel />}
        {activeTab === "insights" && <InsightsPanel />}
        {activeTab === "settings" && <ScheduleEditor />}

        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </WorkoutSessionProvider>
  );
};

export default Index;
