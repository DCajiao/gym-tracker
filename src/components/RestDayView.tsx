import type { DayRoutine } from "@/types/workout";

interface RestDayViewProps {
  routine: DayRoutine;
}

const RestDayView = ({ routine }: RestDayViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-7xl mb-6">{routine.emoji}</span>
      <h2 className="text-2xl font-bold mb-2">{routine.routineName}</h2>
      <p className="text-muted-foreground max-w-xs">
        Hoy toca recuperar. Descansa, estira, hidrátate y prepárate para la próxima sesión. 💤
      </p>
      <div className="mt-8 glass-card px-6 py-4 space-y-2 text-sm text-left">
        <p>🧘 Estiramiento ligero 10-15 min</p>
        <p>💧 Beber al menos 2.5L de agua</p>
        <p>😴 Dormir mínimo 7-8 horas</p>
        <p>🥗 Mantener buena nutrición</p>
      </div>
    </div>
  );
};

export default RestDayView;
