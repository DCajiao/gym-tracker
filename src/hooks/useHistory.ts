import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useHistory(params?: { date?: string; exerciseId?: number }) {
  return useQuery({
    queryKey: ["training-logs", params],
    queryFn: () => api.trainingLogs.list(params),
    staleTime: 1000 * 60,
  });
}
