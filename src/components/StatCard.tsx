import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
  subtitle?: string;
}

const StatCard = ({ icon, label, value, change, subtitle }: StatCardProps) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold mt-0.5">{value}</p>
      {change !== undefined && change !== 0 && (
        <p className={cn("text-[10px] font-medium mt-1", change > 0 ? "text-success" : "text-destructive")}>
          {change > 0 ? "↑" : "↓"} {Math.abs(change).toFixed(0)}% vs anterior
        </p>
      )}
      {subtitle && <p className="text-[10px] text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
