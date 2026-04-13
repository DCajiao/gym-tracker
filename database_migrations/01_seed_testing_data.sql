-- =============================================================================
-- Datos de prueba
-- Usuario seed: demo@gym.local / gym12345
-- =============================================================================

-- Usuario de prueba (password: gym12345)
INSERT INTO users (email, password_hash) VALUES
  ('demo@gym.local', '$2a$12$5B1.3nXAQCw5X/3YErv1xOPtoEQrvZeWLKh.qwCqD4JrHRtPfpX2y');

-- Tipos de rutina
INSERT INTO routine_type (category, days_of_the_week, description) VALUES
  ('push', 'lunes,viernes',   'Pecho, hombros y tríceps'),
  ('pull', 'martes,sábado',   'Espalda y bíceps'),
  ('leg',  'miércoles',       'Cuádriceps, isquiotibiales, glúteos y gemelos');

-- Ejercicios
INSERT INTO exercises (name, description, series, repetitions, muscle_tags, routine_type_id_fk) VALUES
  -- Push (routine_type id=1)
  ('Press de Banca',        'Barra en banco plano',           4, 8,  'pecho,tríceps,hombro',        1),
  ('Press Militar',         'Barra sobre la cabeza',          3, 10, 'hombro,tríceps',              1),
  ('Elevaciones Laterales', 'Mancuernas al costado',          3, 15, 'hombro',                      1),
  ('Jalón de Tríceps',      'Polea alta con cuerda',          3, 12, 'tríceps',                     1),
  -- Pull (routine_type id=2)
  ('Peso Muerto',           'Barra desde el suelo',           4, 6,  'espalda baja,glúteo,femoral', 2),
  ('Dominadas',             'Peso corporal, agarre prono',    3, 8,  'espalda,bíceps',              2),
  ('Remo con Barra',        'Barra inclinado hacia adelante', 3, 10, 'espalda,bíceps',              2),
  ('Curl con Barra',        'Barra EZ o recta',               3, 12, 'bíceps,antebrazo',            2),
  -- Leg (routine_type id=3)
  ('Sentadilla',            'Barra en espalda alta',          4, 8,  'cuádriceps,glúteo',           3),
  ('Prensa de Pierna',      'Máquina 45°',                    3, 12, 'cuádriceps,glúteo',           3),
  ('Peso Muerto Rumano',    'Mancuernas o barra',             3, 10, 'femoral,glúteo',              3),
  ('Elevación de Gemelos',  'De pie o en prensa',             4, 15, 'gemelo,sóleo',                3);

-- Training logs referenciando al usuario seed (user_id = 1)
-- Hace 6 días — Push: Press de Banca + Press Militar
INSERT INTO training_logs (user_id, exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details) VALUES
  (1, 1, 60,   32, CURRENT_DATE - 6, '10:00:00', '10:14:00',
   '{"name":"Press de Banca","description":"Barra en banco plano","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}'),
  (1, 2, 40,   30, CURRENT_DATE - 6, '10:18:00', '10:28:00',
   '{"name":"Press Militar","description":"Barra sobre la cabeza","series":3,"repetitions":10,"muscleTags":"hombro,tríceps"}');

-- Hace 5 días — Leg: Sentadilla + Prensa
INSERT INTO training_logs (user_id, exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details) VALUES
  (1, 9,  90,  32, CURRENT_DATE - 5, '09:00:00', '09:21:00',
   '{"name":"Sentadilla","description":"Barra en espalda alta","series":4,"repetitions":8,"muscleTags":"cuádriceps,glúteo"}'),
  (1, 10, 130, 36, CURRENT_DATE - 5, '09:25:00', '09:40:00',
   '{"name":"Prensa de Pierna","description":"Máquina 45°","series":3,"repetitions":12,"muscleTags":"cuádriceps,glúteo"}');

-- Hace 4 días — Pull: Peso Muerto + Dominadas
INSERT INTO training_logs (user_id, exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details) VALUES
  (1, 5, 120, 24, CURRENT_DATE - 4, '11:00:00', '11:20:00',
   '{"name":"Peso Muerto","description":"Barra desde el suelo","series":4,"repetitions":6,"muscleTags":"espalda baja,glúteo,femoral"}'),
  (1, 6, null, 24, CURRENT_DATE - 4, '11:25:00', '11:40:00',
   '{"name":"Dominadas","description":"Peso corporal, agarre prono","series":3,"repetitions":8,"muscleTags":"espalda,bíceps"}');

-- Hace 1 día — Push: Press de Banca (progresión respecto a hace 6 días)
INSERT INTO training_logs (user_id, exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details) VALUES
  (1, 1, 65, 32, CURRENT_DATE - 1, '10:00:00', '10:14:00',
   '{"name":"Press de Banca","description":"Barra en banco plano","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}');
