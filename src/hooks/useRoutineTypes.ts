import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { RoutineType } from "@/types/workout";

export function useRoutineTypes() {
  return useQuery({
    queryKey: ["routine-types"],
    queryFn: api.routineTypes.list,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateRoutineType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Pick<RoutineType, "category" | "daysOfTheWeek" | "description"> }) =>
      api.routineTypes.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["routine-types"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}
