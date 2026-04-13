-- =============================================================================
-- Schema completo de GymTracker
-- Orden de creación respeta dependencias entre tablas
-- =============================================================================

-- Usuarios (base de autenticación)
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sesión de entrenamiento en curso (estado persistente entre recargas)
CREATE TABLE IF NOT EXISTS workout_sessions (
  id           SERIAL  PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE    NOT NULL,
  state        JSONB   NOT NULL DEFAULT '{}',
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Solo puede haber una sesión activa por usuario a la vez
CREATE UNIQUE INDEX IF NOT EXISTS workout_sessions_one_active_per_user
  ON workout_sessions (user_id)
  WHERE is_active = TRUE;

-- Tipos de rutina (push, pull, leg, upper, etc.)
CREATE TABLE IF NOT EXISTS routine_type (
  id                SERIAL PRIMARY KEY,
  category          TEXT   NOT NULL,
  days_of_the_week  TEXT   NOT NULL,
  description       TEXT
);

-- Catálogo de ejercicios
CREATE TABLE IF NOT EXISTS exercises (
  id                  SERIAL  PRIMARY KEY,
  name                TEXT    NOT NULL,
  description         TEXT,
  series              INTEGER NOT NULL,
  repetitions         INTEGER NOT NULL,
  muscle_tags         TEXT    NOT NULL,
  routine_type_id_fk  INTEGER REFERENCES routine_type(id) ON DELETE SET NULL
);

-- Log de cada ejercicio completado en un entrenamiento
-- user_id NOT NULL: todo log pertenece a un usuario autenticado
CREATE TABLE IF NOT EXISTS training_logs (
  id                SERIAL  PRIMARY KEY,
  user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id_fk    INTEGER REFERENCES exercises(id) ON DELETE SET NULL,
  weight_kg         NUMERIC(6, 2),
  repetitions_done  INTEGER NOT NULL,
  training_date     DATE    NOT NULL,
  start_time        TIME,
  end_time          TIME,
  exercise_details  JSONB   NOT NULL
);
