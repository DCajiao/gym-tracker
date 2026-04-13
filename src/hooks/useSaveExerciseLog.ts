import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TrainingLog } from "@/types/workout";

export const useSaveExerciseLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (log: Omit<TrainingLog, "id">) => api.trainingLogs.save(log),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["training-logs"] });
    },
  });
};
