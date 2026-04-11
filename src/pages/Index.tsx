import { useState } from "react";
import type { Tab } from "@/types/workout";
import { weekRoutine, getTodayIndex } from "@/data/workoutData";
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
  const routine = weekRoutine[selectedDay];

  const totalSets = routine.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const totalExercises = routine.exercises.length;

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
                  {selectedDay === todayIndex ? "Hoy" : routine.dayName}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {routine.emoji} {routine.routineName}
                </p>
              </div>
            </div>
            <DaySelector
              days={weekRoutine}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              todayIndex={todayIndex}
            />
          </PageHeader>

          <main className="max-w-lg mx-auto px-4 py-4 pb-20">
            {routine.isRest ? (
              <RestDayView routine={routine} />
            ) : (
              <>
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
                  {routine.exercises.map((exercise, i) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
                  ))}
                </div>
              </>
            )}
          </main>
        </>
      )}

      {activeTab === "history" && <HistoryPanel />}
      {activeTab === "insights" && <InsightsPanel />}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
