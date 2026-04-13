-- Rutina del domingo: upper body (pecho + espalda en una misma sesión)
INSERT INTO routine_type (category, days_of_the_week, description) VALUES
  ('upper', 'domingo', 'Empuje y jalón: pecho, espalda, hombros y brazos');

-- Ejercicios del domingo (referenciamos el id recién insertado con subquery)
INSERT INTO exercises (name, description, series, repetitions, muscle_tags, routine_type_id_fk)
SELECT v.name, v.description, v.series, v.repetitions, v.muscle_tags, rt.id
FROM (VALUES
  ('Press Inclinado con Barra',  'Banco a 30°, agarre un poco más ancho que los hombros', 4, 8,  'pecho,hombro anterior,tríceps'),
  ('Jalón al Pecho',             'Polea alta, agarre prono ancho',                        4, 10, 'espalda,bíceps'),
  ('Remo en Polea Baja',         'Polea baja, agarre neutro, codos pegados al cuerpo',    3, 12, 'espalda,bíceps'),
  ('Press con Mancuernas Plano', 'Rango completo, mancuernas al costado del pecho',       3, 10, 'pecho,tríceps'),
  ('Elevaciones Laterales',      'Mancuernas al costado, codos ligeramente flexionados',  3, 15, 'hombro lateral'),
  ('Curl Martillo',              'Mancuernas, agarre neutro, movimiento controlado',      3, 12, 'bíceps,antebrazo')
) AS v(name, description, series, repetitions, muscle_tags)
CROSS JOIN (
  SELECT id FROM routine_type WHERE category = 'upper' AND days_of_the_week = 'domingo'
) AS rt;

-- Training logs para el último domingo (CURRENT_DATE - 7)
-- Press Inclinado con Barra — 4 series
INSERT INTO training_logs (exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details)
SELECT e.id, v.weight_kg, v.repetitions_done, CURRENT_DATE - 7, v.start_time, v.end_time,
  jsonb_build_object(
    'name', e.name, 'description', e.description,
    'series', e.series, 'repetitions', e.repetitions, 'muscleTags', e.muscle_tags
  )
FROM exercises e
CROSS JOIN (VALUES
  (60::numeric,  8,  '09:00:00'::time, '09:02:30'::time),
  (70::numeric,  8,  '09:05:00'::time, '09:07:30'::time),
  (75::numeric,  6,  '09:10:00'::time, '09:12:30'::time),
  (75::numeric,  6,  '09:15:00'::time, '09:17:30'::time)
) AS v(weight_kg, repetitions_done, start_time, end_time)
WHERE e.name = 'Press Inclinado con Barra';

-- Jalón al Pecho — 4 series
INSERT INTO training_logs (exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details)
SELECT e.id, v.weight_kg, v.repetitions_done, CURRENT_DATE - 7, v.start_time, v.end_time,
  jsonb_build_object(
    'name', e.name, 'description', e.description,
    'series', e.series, 'repetitions', e.repetitions, 'muscleTags', e.muscle_tags
  )
FROM exercises e
CROSS JOIN (VALUES
  (55::numeric,  10, '09:22:00'::time, '09:24:00'::time),
  (60::numeric,  10, '09:27:00'::time, '09:29:00'::time),
  (65::numeric,  8,  '09:32:00'::time, '09:34:00'::time),
  (65::numeric,  8,  '09:37:00'::time, '09:39:00'::time)
) AS v(weight_kg, repetitions_done, start_time, end_time)
WHERE e.name = 'Jalón al Pecho';

-- Remo en Polea Baja — 3 series
INSERT INTO training_logs (exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details)
SELECT e.id, v.weight_kg, v.repetitions_done, CURRENT_DATE - 7, v.start_time, v.end_time,
  jsonb_build_object(
    'name', e.name, 'description', e.description,
    'series', e.series, 'repetitions', e.repetitions, 'muscleTags', e.muscle_tags
  )
FROM exercises e
CROSS JOIN (VALUES
  (50::numeric,  12, '09:44:00'::time, '09:46:00'::time),
  (55::numeric,  12, '09:49:00'::time, '09:51:00'::time),
  (55::numeric,  10, '09:54:00'::time, '09:56:00'::time)
) AS v(weight_kg, repetitions_done, start_time, end_time)
WHERE e.name = 'Remo en Polea Baja';

-- Training logs para hace 14 días (segundo domingo atrás) — solo dos ejercicios para simular sesión corta
-- Press Inclinado con Barra — 4 series (pesos más bajos, semana anterior)
INSERT INTO training_logs (exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details)
SELECT e.id, v.weight_kg, v.repetitions_done, CURRENT_DATE - 14, v.start_time, v.end_time,
  jsonb_build_object(
    'name', e.name, 'description', e.description,
    'series', e.series, 'repetitions', e.repetitions, 'muscleTags', e.muscle_tags
  )
FROM exercises e
CROSS JOIN (VALUES
  (55::numeric,  8,  '10:00:00'::time, '10:02:30'::time),
  (65::numeric,  8,  '10:06:00'::time, '10:08:30'::time),
  (70::numeric,  6,  '10:12:00'::time, '10:14:30'::time),
  (70::numeric,  5,  '10:18:00'::time, '10:20:30'::time)
) AS v(weight_kg, repetitions_done, start_time, end_time)
WHERE e.name = 'Press Inclinado con Barra';

-- Curl Martillo — 3 series
INSERT INTO training_logs (exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details)
SELECT e.id, v.weight_kg, v.repetitions_done, CURRENT_DATE - 14, v.start_time, v.end_time,
  jsonb_build_object(
    'name', e.name, 'description', e.description,
    'series', e.series, 'repetitions', e.repetitions, 'muscleTags', e.muscle_tags
  )
FROM exercises e
CROSS JOIN (VALUES
  (14::numeric,  12, '10:25:00'::time, '10:27:00'::time),
  (16::numeric,  12, '10:30:00'::time, '10:32:00'::time),
  (16::numeric,  10, '10:35:00'::time, '10:37:00'::time)
) AS v(weight_kg, repetitions_done, start_time, end_time)
WHERE e.name = 'Curl Martillo';
