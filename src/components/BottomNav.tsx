import type { Tab } from "@/types/workout";
import { Dumbbell, Clock, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "workout", label: "Rutina", icon: <Dumbbell className="w-5 h-5" /> },
  { key: "history", label: "Historial", icon: <Clock className="w-5 h-5" /> },
  { key: "insights", label: "Insights", icon: <BarChart3 className="w-5 h-5" /> },
];

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-t border-border/50">
      <div className="max-w-lg mx-auto flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 transition-colors",
              activeTab === tab.key
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
