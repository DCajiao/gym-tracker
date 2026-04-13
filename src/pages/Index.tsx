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
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-success/15 border border-success/25 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-success" />
      </div>

      {/* Heading */}
      <div>
        <h2
          className="text-4xl font-black uppercase tracking-tight text-success"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
        >
          Completado
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
          <div className="glass-card p-4 text-center accent-border-l">
            <p className="stat-number text-4xl text-primary">{summary.exercises.length}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
              Ejercicios
            </p>
          </div>
          <div className="glass-card p-4 text-center accent-border-l">
            <p className="stat-number text-4xl text-primary">{summary.totalSets}</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
              Series
            </p>
          </div>
          {summary.totalVolume > 0 && (
            <div className="glass-card p-4 text-center col-span-2 accent-border-l">
              <p className="stat-number text-4xl text-primary">
                {(summary.totalVolume / 1000).toFixed(1)}
                <span className="text-lg text-muted-foreground">t</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                Volumen total
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={onViewDetails}
        className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest active:scale-95 transition-all"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}
      >
        Ver historial
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
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1
              className="text-2xl font-black uppercase tracking-tight leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
            >
              GymTracker
            </h1>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-0.5">
              {user?.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Category badge */}
            {day?.routineType && (
              <div className="text-right">
                <p
                  className="text-xs font-bold uppercase tracking-widest text-primary leading-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                >
                  {day.routineType.category}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {isToday ? "hoy" : day.dayName}
                </p>
              </div>
            )}
            {!day?.routineType && (
              <p className="text-sm font-semibold text-muted-foreground">
                {isToday ? "hoy" : day?.dayName ?? ""}
              </p>
            )}
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Day selector */}
        {isLoading ? (
          <div className="h-12 flex items-center text-xs text-muted-foreground">
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

      <main className="max-w-lg mx-auto px-4 py-4 pb-24">
        {isLoading || loadingToday ? null : day?.isRest ? (
          <RestDayView dayName={day.dayName} />
        ) : isToday && completedToday ? (
          <CompletedTodayView onViewDetails={onViewTodayDetails} />
        ) : (
          <>
            {/* Routine type banner */}
            {day?.routineType && (
              <div className="glass-card px-4 py-3 mb-4 flex items-center gap-3 accent-border-l">
                <span className="text-3xl">{emoji}</span>
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest text-primary leading-none"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                  >
                    {day.routineType.category}
                  </p>
                  <p className="text-sm font-semibold leading-tight mt-0.5">
                    {day.routineType.description}
                  </p>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <StatCard icon={<Target className="w-4 h-4" />} label="Ejercicios"   value={`${totalExercises}`} />
              <StatCard icon={<Flame  className="w-4 h-4" />} label="Series Total" value={`${totalSets}`} />
            </div>

            {/* Session control */}
            {isRestoring ? (
              <div className="w-full mb-4 py-3 rounded-xl bg-secondary/40 text-center text-xs text-muted-foreground font-semibold uppercase tracking-widest">
                Recuperando sesión...
              </div>
            ) : canStart ? (
              <button
                onClick={() => day?.exercises && startSession(day.exercises)}
                className="w-full mb-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm uppercase tracking-widest transition-all active:scale-95"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}
              >
                <Play className="w-4 h-4" />
                Iniciar entrenamiento
              </button>
            ) : showEnd ? (
              <button
                onClick={endSession}
                className="w-full mb-4 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/25 font-bold text-sm uppercase tracking-widest transition-all active:scale-95"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}
              >
                <Square className="w-4 h-4" />
                Terminar entrenamiento
              </button>
            ) : null}

            {/* Exercise cards */}
            <div className="space-y-2.5">
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
