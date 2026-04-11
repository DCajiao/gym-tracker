import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface RestTimerProps {
  seconds: number;
  onFinish?: () => void;
}

const RestTimer = ({ seconds, onFinish }: RestTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(seconds);
    setIsRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsRunning(false);
          onFinish?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onFinish]);

  const reset = useCallback(() => {
    setTimeLeft(seconds);
    setIsRunning(false);
  }, [seconds]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const progress = ((seconds - timeLeft) / seconds) * 100;

  return (
    <div className="flex items-center gap-3 glass-card px-4 py-3">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="17" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
          <circle
            cx="20" cy="20" r="17"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 17}`}
            strokeDashoffset={`${2 * Math.PI * 17 * (1 - progress / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
      </div>

      <div className="flex-1">
        <p className="text-xs text-muted-foreground">Descanso</p>
        <p className="text-xl font-bold tabular-nums">
          {mins}:{secs.toString().padStart(2, "0")}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button
          onClick={reset}
          className="w-9 h-9 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RestTimer;
