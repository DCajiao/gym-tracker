import type { WorkoutLog } from "@/types/workout";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  return res.json();
}

export const api = {
  history: {
    list: (): Promise<WorkoutLog[]> => request("/history"),
    get: (date: string): Promise<WorkoutLog> => request(`/history/${date}`),
    save: (log: Omit<WorkoutLog, "id">): Promise<WorkoutLog> =>
      request("/history", { method: "POST", body: JSON.stringify(log) }),
  },
};
