import type { DaySchedule, TrainingLog, RoutineType } from "@/types/workout";

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
  schedule: {
    get: (): Promise<DaySchedule[]> => request("/schedule"),
  },
  routineTypes: {
    list: (): Promise<RoutineType[]> => request("/routine-types"),
    update: (id: number, data: Pick<RoutineType, "category" | "daysOfTheWeek" | "description">): Promise<RoutineType> =>
      request(`/routine-types/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },
  trainingLogs: {
    list: (params?: { date?: string; exerciseId?: number }): Promise<TrainingLog[]> => {
      const qs = new URLSearchParams();
      if (params?.date) qs.set("date", params.date);
      if (params?.exerciseId) qs.set("exerciseId", String(params.exerciseId));
      return request(`/training-logs${qs.size ? `?${qs}` : ""}`);
    },
    save: (log: Omit<TrainingLog, "id">): Promise<TrainingLog> =>
      request("/training-logs", { method: "POST", body: JSON.stringify(log) }),
  },
};
