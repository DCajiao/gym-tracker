import type { DaySchedule, TrainingLog, RoutineType, Exercise } from "@/types/workout";

const BASE = "/api";
const TOKEN_KEY = "gym_token";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? res.statusText);
  }
  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth types ────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// ── Session state (mirrored from WorkoutSessionContext) ───────────────────────

export interface SessionStatePayload {
  date: string;
  exercises: Record<number, {
    sets: boolean[];
    startTime: string | null;
    endTime: string | null;
    saved: boolean;
  }>;
}

export interface WorkoutSessionRecord {
  id: number;
  userId: number;
  sessionDate: string;
  state: SessionStatePayload;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── API client ────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    login:    (email: string, password: string): Promise<AuthResponse> =>
      request("/auth/login",    { method: "POST", body: JSON.stringify({ email, password }) }),
    register: (email: string, password: string): Promise<AuthResponse> =>
      request("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
    me: (): Promise<AuthUser> =>
      request("/auth/me"),
  },

  schedule: {
    get: (): Promise<DaySchedule[]> => request("/schedule"),
  },

  routineTypes: {
    list: (): Promise<RoutineType[]> => request("/routine-types"),
    update: (id: number, data: Pick<RoutineType, "category" | "daysOfTheWeek" | "description">): Promise<RoutineType> =>
      request(`/routine-types/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  exercises: {
    updateWeight: (id: number, defaultWeight: number | null): Promise<Exercise> =>
      request(`/exercises/${id}/weight`, { method: "PATCH", body: JSON.stringify({ defaultWeight }) }),
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

  workoutSessions: {
    getActive: (): Promise<WorkoutSessionRecord | null> =>
      request("/workout-sessions/active"),
    upsertActive: (sessionDate: string, state: SessionStatePayload): Promise<WorkoutSessionRecord> =>
      request("/workout-sessions/active", { method: "PUT", body: JSON.stringify({ sessionDate, state }) }),
    endActive: (): Promise<void> =>
      request("/workout-sessions/active", { method: "DELETE" }),
  },
};
