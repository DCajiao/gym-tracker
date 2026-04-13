interface RestDayViewProps {
  dayName: string;
}

const RestDayView = ({ dayName }: RestDayViewProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-5">
        <span className="text-4xl">😴</span>
      </div>
      <h2
        className="text-3xl font-black uppercase tracking-tight mb-2"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
      >
        {dayName} — Descanso
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        Hoy toca recuperar. El descanso es parte del entrenamiento.
      </p>
      <div className="mt-8 glass-card w-full max-w-xs p-4 space-y-2.5 text-sm text-left accent-border-l">
        <p className="text-foreground font-medium">Estiramiento ligero 10–15 min</p>
        <p className="text-foreground font-medium">Beber al menos 2.5L de agua</p>
        <p className="text-foreground font-medium">Dormir mínimo 7–8 horas</p>
        <p className="text-foreground font-medium">Mantener buena nutrición</p>
      </div>
    </div>
  );
};

export default RestDayView;
