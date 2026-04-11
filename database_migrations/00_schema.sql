-- Initial schema: workout logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id               SERIAL PRIMARY KEY,
  date             TEXT    NOT NULL UNIQUE,
  day_index        INTEGER NOT NULL,
  routine_name     TEXT    NOT NULL,
  emoji            TEXT    NOT NULL,
  exercises        JSONB   NOT NULL,
  total_sets       INTEGER NOT NULL,
  completed_sets   INTEGER NOT NULL,
  total_volume     INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
