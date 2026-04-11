-- Tipos de rutina (push, pull, leg, etc.)
CREATE TABLE IF NOT EXISTS routine_type (
  id                SERIAL PRIMARY KEY,
  category          TEXT    NOT NULL,
  days_of_the_week  TEXT    NOT NULL,
  description       TEXT
);

-- Catálogo de ejercicios
CREATE TABLE IF NOT EXISTS exercises (
  id                  SERIAL PRIMARY KEY,
  name                TEXT    NOT NULL,
  description         TEXT,
  series              INTEGER NOT NULL,
  repetitions         INTEGER NOT NULL,
  muscle_tags         TEXT    NOT NULL,
  routine_type_id_fk  INTEGER REFERENCES routine_type(id) ON DELETE SET NULL
);

-- Logs de cada set ejecutado en un entrenamiento
CREATE TABLE IF NOT EXISTS training_logs (
  id                SERIAL PRIMARY KEY,
  exercise_id_fk    INTEGER REFERENCES exercises(id) ON DELETE SET NULL,
  weight_kg         NUMERIC(6, 2),
  repetitions_done  INTEGER NOT NULL,
  training_date     DATE    NOT NULL,
  start_time        TIME,
  end_time          TIME,
  exercise_details  JSONB   NOT NULL
);
