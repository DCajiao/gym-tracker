import { useMemo } from "react";
import { useHistory } from "@/hooks/useHistory";
import { restDayIndices } from "@/data/workoutData";
import { parseISO, startOfWeek, endOfWeek, isWithinInterval, subWeeks, format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart3, Flame, Target, TrendingUp, Trophy, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import StatCard from "./StatCard";
import PageHeader from "./PageHeader";

const InsightsPanel = () => {
  const { data: workoutHistory = [], isLoading } = useHistory();

  const insights = useMemo(() => {
    if (workoutHistory.length === 0) return null;
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });

    const thisWeek = workoutHistory.filter((l) =>
      isWithinInterval(parseISO(l.date), { start: thisWeekStart, end: thisWeekEnd })
    );
    const lastWeek = workoutHistory.filter((l) =>
      isWithinInterval(parseISO(l.date), { start: lastWeekStart, end: lastWeekEnd })
    );

    const thisWeekVolume = thisWeek.reduce((a, l) => a + l.totalVolume, 0);
    const lastWeekVolume = lastWeek.reduce((a, l) => a + l.totalVolume, 0);
    const volumeChange =
      lastWeekVolume > 0 ? ((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100 : 0;

    const thisWeekSessions = thisWeek.length;
    const lastWeekSessions = lastWeek.length;

    const avgCompletion =
      workoutHistory.length > 0
        ? Math.round(
            workoutHistory.reduce((a, l) => a + (l.completedSets / l.totalSets) * 100, 0) /
              workoutHistory.length
          )
        : 0;

    const avgDuration =
      workoutHistory.length > 0
        ? Math.round(
            workoutHistory.reduce((a, l) => a + l.durationMinutes, 0) / workoutHistory.length
          )
        : 0;

    // Muscle group distribution
    const muscleMap: Record<string, number> = {};
    workoutHistory.forEach((l) => {
      l.exercises.forEach((e) => {
        const group = e.muscleGroup.split("/")[0];
        muscleMap[group] = (muscleMap[group] || 0) + e.sets.filter((s) => s.completed).length;
      });
    });
    const muscleGroups = Object.entries(muscleMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
    const maxMuscle = muscleGroups[0]?.[1] || 1;

    // Streak — derive rest days from data instead of hardcoded indices
    let streak = 0;
    const dateSet = new Set(workoutHistory.map((l) => l.date));
    const checkDate = new Date();
    for (let i = 0; i < 60; i++) {
      checkDate.setDate(checkDate.getDate() - (i === 0 ? 0 : 1));
      const dayOfWeek = checkDate.getDay();
      const dayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      if (restDayIndices.has(dayIdx)) {
        if (i > 0) streak++;
        continue;
      }
      const dateStr = format(checkDate, "yyyy-MM-dd");
      if (dateSet.has(dateStr)) {
        streak++;
      } else {
        break;
      }
    }

    // Weekly volume chart (last 4 weeks)
    const weeklyVolumes: { label: string; value: number }[] = [];
    for (let w = 3; w >= 0; w--) {
      const ws = startOfWeek(subWeeks(now, w), { weekStartsOn: 1 });
      const we = endOfWeek(subWeeks(now, w), { weekStartsOn: 1 });
      const vol = workoutHistory
        .filter((l) => isWithinInterval(parseISO(l.date), { start: ws, end: we }))
        .reduce((a, l) => a + l.totalVolume, 0);
      weeklyVolumes.push({
        label: w === 0 ? "Esta" : w === 1 ? "Ant." : `${format(ws, "d MMM", { locale: es })}`,
        value: vol,
      });
    }
    const maxWeeklyVol = Math.max(...weeklyVolumes.map((w) => w.value), 1);

    return {
      thisWeekVolume,
      volumeChange,
      thisWeekSessions,
      lastWeekSessions,
      avgCompletion,
      avgDuration,
      muscleGroups,
      maxMuscle,
      streak,
      weeklyVolumes,
      maxWeeklyVol,
      totalWorkouts: workoutHistory.length,
    };
  }, [workoutHistory]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Insights
        </h1>
        <p className="text-xs text-muted-foreground">Tu progreso y estadísticas</p>
      </PageHeader>

      <main className="max-w-lg mx-auto px-4 py-4 pb-24 space-y-4">
        {(isLoading || !insights) && (
          <div className="text-center py-16 text-muted-foreground text-sm">Cargando...</div>
        )}
        {insights && (
        <>
        {/* Top Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Flame className="w-4 h-4" />}
            label="Volumen Semanal"
            value={`${(insights.thisWeekVolume / 1000).toFixed(1)}t`}
            change={insights.volumeChange}
          />
          <StatCard
            icon={<Calendar className="w-4 h-4" />}
            label="Sesiones Semana"
            value={`${insights.thisWeekSessions}`}
            subtitle={`vs ${insights.lastWeekSessions} anterior`}
          />
          <StatCard
            icon={<Target className="w-4 h-4" />}
            label="Completitud Avg"
            value={`${insights.avgCompletion}%`}
          />
          <StatCard
            icon={<Trophy className="w-4 h-4" />}
            label="Racha Actual"
            value={`${insights.streak} días`}
          />
        </div>

        {/* Weekly Volume Chart */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Volumen Semanal (últimas 4 semanas)
          </h3>
          <div className="flex items-end gap-3 h-32">
            {insights.weeklyVolumes.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-medium">
                  {(w.value / 1000).toFixed(1)}t
                </span>
                <div
                  className={cn(
                    "w-full rounded-t-lg transition-all",
                    i === insights.weeklyVolumes.length - 1 ? "bg-primary" : "bg-secondary"
                  )}
                  style={{ height: `${(w.value / insights.maxWeeklyVol) * 100}%`, minHeight: 4 }}
                />
                <span className="text-[10px] text-muted-foreground">{w.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Muscle Distribution */}
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Distribución Muscular
          </h3>
          <div className="space-y-2.5">
            {insights.muscleGroups.map(([group, count]) => (
              <div key={group}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{group}</span>
                  <span className="font-medium">{count} sets</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(count / insights.maxMuscle) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="glass-card p-4 text-center">
          <p className="text-xs text-muted-foreground mb-1">Total Entrenamientos Registrados</p>
          <p className="text-3xl font-bold text-primary">{insights.totalWorkouts}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Duración promedio: {insights.avgDuration} min
          </p>
        </div>
        </>
        )}
      </main>
    </div>
  );
};

export default InsightsPanel;
