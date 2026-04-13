import type { Tab } from "@/types/workout";
import { Dumbbell, Clock, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "workout",  label: "Rutina",    icon: <Dumbbell  className="w-5 h-5" /> },
  { key: "history",  label: "Historial", icon: <Clock     className="w-5 h-5" /> },
  { key: "insights", label: "Insights",  icon: <BarChart3 className="w-5 h-5" /> },
  { key: "settings", label: "Ajustes",   icon: <Settings  className="w-5 h-5" /> },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[hsl(240_8%_6%)] border-t border-border">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className="flex-1 flex flex-col items-center gap-1.5 pt-3 pb-4 relative transition-colors"
            >
              {/* Top indicator line */}
              <span
                className={cn(
                  "absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300",
                  active ? "w-8 bg-primary" : "w-0 bg-transparent"
                )}
              />
              <span className={cn("transition-colors", active ? "text-primary" : "text-muted-foreground")}>
                {tab.icon}
              </span>
              <span
                className={cn(
                  "text-[9px] font-semibold uppercase tracking-widest transition-colors",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
