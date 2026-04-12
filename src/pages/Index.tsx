import { useState } from "react";
import type { Tab } from "@/types/workout";
import { CATEGORY_EMOJI } from "@/types/workout";
import { useSchedule, getTodayIndex } from "@/hooks/useSchedule";
import DaySelector from "@/components/DaySelector";
import ExerciseCard from "@/components/ExerciseCard";
import RestDayView from "@/components/RestDayView";
import HistoryPanel from "@/components/HistoryPanel";
import InsightsPanel from "@/components/InsightsPanel";
import BottomNav from "@/components/BottomNav";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { Dumbbell, Flame, Target } from "lucide-react";

const Index = () => {
  const todayIndex = getTodayIndex();
  const [selectedDay, setSelectedDay] = useState(todayIndex);
  const [activeTab, setActiveTab] = useState<Tab>("workout");

  const { data: schedule, isLoading } = useSchedule();
  const day = schedule?.[selectedDay];

  const totalSets      = day?.exercises.reduce((acc, ex) => acc + ex.series, 0) ?? 0;
  const totalExercises = day?.exercises.length ?? 0;
  const emoji          = day?.routineType ? (CATEGORY_EMOJI[day.routineType.category] ?? "🏋️") : "😴";

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "workout" && (
        <>
          <PageHeader>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-lg font-bold flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  GymTracker
                </h1>
                <p className="text-xs text-muted-foreground">Tu rutina semanal</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  {selectedDay === todayIndex ? "Hoy" : day?.dayName ?? ""}
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
            {isLoading ? null : day?.isRest ? (
              <RestDayView dayName={day.dayName} />
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
                  <StatCard
                    icon={<Target className="w-4 h-4" />}
                    label="Ejercicios"
                    value={`${totalExercises}`}
                  />
                  <StatCard
                    icon={<Flame className="w-4 h-4" />}
                    label="Series Total"
                    value={`${totalSets}`}
                  />
                </div>

                <div className="space-y-3">
                  {day?.exercises.map((exercise, i) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
                  ))}
                </div>
              </>
            )}
          </main>
        </>
      )}

      {activeTab === "history"  && <HistoryPanel />}
      {activeTab === "insights" && <InsightsPanel />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
