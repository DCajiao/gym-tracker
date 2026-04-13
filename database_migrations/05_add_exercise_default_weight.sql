-- Peso por defecto del ejercicio: se actualiza cada vez que el usuario
-- entrena con un peso nuevo, y sirve de valor prellenado la próxima sesión.
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS default_weight NUMERIC(6, 2);
