-- Datos de prueba para validar funcionalidad

-- Tipos de rutina
INSERT INTO routine_type (category, days_of_the_week, description) VALUES
  ('push', 'lunes,viernes',   'Pecho, hombros y tríceps'),
  ('pull', 'martes,sábado',   'Espalda y bíceps'),
  ('leg',  'miércoles',       'Cuádriceps, isquiotibiales, glúteos y gemelos');

-- Ejercicios
INSERT INTO exercises (name, description, series, repetitions, muscle_tags, routine_type_id_fk) VALUES
  -- Push
  ('Press de Banca',        'Barra en banco plano',            4, 8,  'pecho,tríceps,hombro',       1),
  ('Press Militar',         'Barra sobre la cabeza',           3, 10, 'hombro,tríceps',             1),
  ('Elevaciones Laterales', 'Mancuernas al costado',           3, 15, 'hombro',                     1),
  ('Jalón de Tríceps',      'Polea alta con cuerda',           3, 12, 'tríceps',                    1),
  -- Pull
  ('Peso Muerto',           'Barra desde el suelo',            4, 6,  'espalda baja,glúteo,femoral',2),
  ('Dominadas',             'Peso corporal, agarre prono',     3, 8,  'espalda,bíceps',             2),
  ('Remo con Barra',        'Barra inclinado hacia adelante',  3, 10, 'espalda,bíceps',             2),
  ('Curl con Barra',        'Barra EZ o recta',                3, 12, 'bíceps,antebrazo',           2),
  -- Leg
  ('Sentadilla',            'Barra en espalda alta',           4, 8,  'cuádriceps,glúteo',          3),
  ('Prensa de Pierna',      'Máquina 45°',                     3, 12, 'cuádriceps,glúteo',          3),
  ('Peso Muerto Rumano',    'Mancuernas o barra',              3, 10, 'femoral,glúteo',             3),
  ('Elevación de Gemelos',  'De pie o en prensa',              4, 15, 'gemelo,sóleo',               3);

-- Training logs (fechas relativas al momento de correr el seed)
INSERT INTO training_logs (exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details) VALUES
  -- Hace 6 días — Push: Press de Banca (4 series)
  (1, 60,   10, CURRENT_DATE - 6, '10:00:00', '10:02:30', '{"name":"Press de Banca","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}'),
  (1, 70,   8,  CURRENT_DATE - 6, '10:04:00', '10:06:00', '{"name":"Press de Banca","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}'),
  (1, 80,   6,  CURRENT_DATE - 6, '10:08:00', '10:10:00', '{"name":"Press de Banca","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}'),
  (1, 80,   6,  CURRENT_DATE - 6, '10:12:00', '10:14:00', '{"name":"Press de Banca","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}'),
  -- Hace 6 días — Press Militar (3 series)
  (2, 40,   10, CURRENT_DATE - 6, '10:18:00', '10:20:00', '{"name":"Press Militar","series":3,"repetitions":10,"muscleTags":"hombro,tríceps"}'),
  (2, 45,   8,  CURRENT_DATE - 6, '10:22:00', '10:24:00', '{"name":"Press Militar","series":3,"repetitions":10,"muscleTags":"hombro,tríceps"}'),
  (2, 45,   7,  CURRENT_DATE - 6, '10:26:00', '10:28:00', '{"name":"Press Militar","series":3,"repetitions":10,"muscleTags":"hombro,tríceps"}'),
  -- Hace 5 días — Leg: Sentadilla (4 series)
  (9, 80,   10, CURRENT_DATE - 5, '09:00:00', '09:03:00', '{"name":"Sentadilla","series":4,"repetitions":8,"muscleTags":"cuádriceps,glúteo"}'),
  (9, 90,   8,  CURRENT_DATE - 5, '09:06:00', '09:09:00', '{"name":"Sentadilla","series":4,"repetitions":8,"muscleTags":"cuádriceps,glúteo"}'),
  (9, 100,  6,  CURRENT_DATE - 5, '09:12:00', '09:15:00', '{"name":"Sentadilla","series":4,"repetitions":8,"muscleTags":"cuádriceps,glúteo"}'),
  (9, 100,  6,  CURRENT_DATE - 5, '09:18:00', '09:21:00', '{"name":"Sentadilla","series":4,"repetitions":8,"muscleTags":"cuádriceps,glúteo"}'),
  -- Hace 4 días — Pull: Peso Muerto (3 series)
  (5, 100,  8,  CURRENT_DATE - 4, '11:00:00', '11:04:00', '{"name":"Peso Muerto","series":4,"repetitions":6,"muscleTags":"espalda baja,glúteo,femoral"}'),
  (5, 120,  6,  CURRENT_DATE - 4, '11:08:00', '11:12:00', '{"name":"Peso Muerto","series":4,"repetitions":6,"muscleTags":"espalda baja,glúteo,femoral"}'),
  (5, 130,  5,  CURRENT_DATE - 4, '11:16:00', '11:20:00', '{"name":"Peso Muerto","series":4,"repetitions":6,"muscleTags":"espalda baja,glúteo,femoral"}'),
  -- Hace 1 día — Push: Press de Banca con progresión
  (1, 62.5, 10, CURRENT_DATE - 1, '10:00:00', '10:02:30', '{"name":"Press de Banca","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}'),
  (1, 72.5, 8,  CURRENT_DATE - 1, '10:05:00', '10:07:00', '{"name":"Press de Banca","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}'),
  (1, 82.5, 6,  CURRENT_DATE - 1, '10:10:00', '10:12:00', '{"name":"Press de Banca","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}'),
  (1, 82.5, 5,  CURRENT_DATE - 1, '10:15:00', '10:17:00', '{"name":"Press de Banca","series":4,"repetitions":8,"muscleTags":"pecho,tríceps,hombro"}');
