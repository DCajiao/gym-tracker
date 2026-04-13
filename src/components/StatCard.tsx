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
    <div className="glass-card p-4 flex flex-col gap-1 accent-border-l">
      <div className="flex items-center gap-1.5 text-primary mb-1">
        {icon}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="stat-number text-3xl">{value}</p>
      {change !== undefined && change !== 0 && (
        <p className={cn("text-[10px] font-semibold mt-0.5", change > 0 ? "text-success" : "text-destructive")}>
          {change > 0 ? "▲" : "▼"} {Math.abs(change).toFixed(0)}%
        </p>
      )}
      {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
