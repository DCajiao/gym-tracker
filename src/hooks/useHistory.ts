import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: api.history.list,
    staleTime: 1000 * 60, // 1 min
  });
}
