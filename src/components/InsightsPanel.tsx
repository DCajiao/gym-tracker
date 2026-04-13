import { useMemo } from "react";
import { useHistory } from "@/hooks/useHistory";
import { groupByDate } from "@/lib/training";
import { parseISO, startOfWeek, endOfWeek, isWithinInterval, subWeeks, format } from "date-fns";
import { es } from "date-fns/locale";
import { BarChart3, Flame, Target, TrendingUp, Trophy, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import StatCard from "./StatCard";
import PageHeader from "./PageHeader";

const InsightsPanel = () => {
  const { data: logs = [], isLoading } = useHistory();
  const days = useMemo(() => groupByDate(logs), [logs]);

  const insights = useMemo(() => {
    if (days.length === 0) return null;
    const now = new Date();

    const inInterval = (date: string, start: Date, end: Date) =>
      isWithinInterval(parseISO(date), { start, end });

    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
    const thisWeekEnd   = endOfWeek(now,   { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
    const lastWeekEnd   = endOfWeek(subWeeks(now, 1),   { weekStartsOn: 1 });

    const thisWeek = days.filter((d) => inInterval(d.date, thisWeekStart, thisWeekEnd));
    const lastWeek = days.filter((d) => inInterval(d.date, lastWeekStart, lastWeekEnd));

    const thisWeekVolume = thisWeek.reduce((a, d) => a + d.totalVolume, 0);
    const lastWeekVolume = lastWeek.reduce((a, d) => a + d.totalVolume, 0);
    const volumeChange   = lastWeekVolume > 0
      ? ((thisWeekVolume - lastWeekVolume) / lastWeekVolume) * 100
      : 0;

    const muscleMap: Record<string, number> = {};
    for (const day of days) {
      for (const ex of day.exercises) {
        for (const tag of ex.muscleTags.split(",").map((t) => t.trim())) {
          muscleMap[tag] = (muscleMap[tag] ?? 0) + ex.sets.length;
        }
      }
    }
    const muscleGroups = Object.entries(muscleMap).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxMuscle    = muscleGroups[0]?.[1] ?? 1;

    let streak = 0;
    const dateSet = new Set(days.map((d) => d.date));
    const cursor  = new Date(now);
    for (let i = 0; i < 60; i++) {
      const dateStr = format(cursor, "yyyy-MM-dd");
      if (dateSet.has(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
      cursor.setDate(cursor.getDate() - 1);
    }

    const weeklyVolumes = Array.from({ length: 4 }, (_, w) => {
      const offset = 3 - w;
      const ws  = startOfWeek(subWeeks(now, offset), { weekStartsOn: 1 });
      const we  = endOfWeek(subWeeks(now, offset),   { weekStartsOn: 1 });
      const vol = days
        .filter((d) => inInterval(d.date, ws, we))
        .reduce((a, d) => a + d.totalVolume, 0);
      return {
        label: offset === 0 ? "Esta" : offset === 1 ? "Ant." : format(ws, "d MMM", { locale: es }),
        value: vol,
      };
    });
    const maxWeeklyVol = Math.max(...weeklyVolumes.map((w) => w.value), 1);

    return {
      thisWeekVolume,
      volumeChange,
      thisWeekSessions: thisWeek.length,
      lastWeekSessions: lastWeek.length,
      totalSets: logs.length,
      streak,
      muscleGroups,
      maxMuscle,
      weeklyVolumes,
      maxWeeklyVol,
      totalDays: days.length,
    };
  }, [days, logs.length]);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          <div>
            <h1
              className="text-xl font-bold leading-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              INSIGHTS
            </h1>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
              Tu progreso
            </p>
          </div>
        </div>
      </PageHeader>

      <main className="max-w-lg mx-auto px-4 py-4 pb-24 space-y-3">
        {(isLoading || !insights) && (
          <div className="text-center py-16 text-muted-foreground text-sm">Cargando...</div>
        )}

        {insights && (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-2 gap-2.5">
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
                label="Sets Totales"
                value={`${insights.totalSets}`}
              />
              <StatCard
                icon={<Trophy className="w-4 h-4" />}
                label="Racha Actual"
                value={`${insights.streak}d`}
              />
            </div>

            {/* Weekly Volume Chart */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                >
                  Volumen — Últimas 4 semanas
                </h3>
              </div>
              <div className="flex items-end gap-2 h-28">
                {insights.weeklyVolumes.map((w, i) => {
                  const isCurrentWeek = i === insights.weeklyVolumes.length - 1;
                  const heightPct     = Math.max((w.value / insights.maxWeeklyVol) * 100, 4);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      {w.value > 0 && (
                        <span className="text-[9px] text-muted-foreground font-semibold">
                          {(w.value / 1000).toFixed(1)}t
                        </span>
                      )}
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className={cn(
                            "w-full rounded-t transition-all",
                            isCurrentWeek ? "bg-primary" : "bg-secondary"
                          )}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-wider",
                          isCurrentWeek ? "text-primary" : "text-muted-foreground"
                        )}
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {w.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Muscle Distribution */}
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-primary" />
                <h3
                  className="text-sm font-bold uppercase tracking-wide"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                >
                  Distribución Muscular
                </h3>
              </div>
              <div className="space-y-3">
                {insights.muscleGroups.map(([group, count]) => (
                  <div key={group}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span
                        className="font-bold capitalize uppercase tracking-wide"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {group}
                      </span>
                      <span className="font-semibold text-muted-foreground">{count} sets</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
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
            <div className="glass-card p-5 text-center accent-border-l">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                Días de entrenamiento
              </p>
              <p className="stat-number text-5xl text-primary">{insights.totalDays}</p>
              <p className="text-xs text-muted-foreground mt-1.5">
                {insights.totalSets} sets registrados
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default InsightsPanel;
