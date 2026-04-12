import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSchedule() {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: api.schedule.get,
    staleTime: 1000 * 60 * 5, // 5 min — la rutina cambia poco
  });
}

/** Convierte Date.getDay() (0=Dom) al índice Mon-based (0=Lun) */
export function getTodayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}
