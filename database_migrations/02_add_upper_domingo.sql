-- Rutina del domingo: upper body (pecho + espalda en una misma sesión)
INSERT INTO routine_type (category, days_of_the_week, description) VALUES
  ('upper', 'domingo', 'Empuje y jalón: pecho, espalda, hombros y brazos');

-- Ejercicios del domingo
INSERT INTO exercises (name, description, series, repetitions, muscle_tags, routine_type_id_fk)
SELECT v.name, v.description, v.series, v.repetitions, v.muscle_tags, rt.id
FROM (VALUES
  ('Press Inclinado con Barra',  'Banco a 30°, agarre un poco más ancho que los hombros', 4, 8,  'pecho,hombro anterior,tríceps'),
  ('Jalón al Pecho',             'Polea alta, agarre prono ancho',                        4, 10, 'espalda,bíceps'),
  ('Remo en Polea Baja',         'Polea baja, agarre neutro, codos pegados al cuerpo',    3, 12, 'espalda,bíceps'),
  ('Press con Mancuernas Plano', 'Rango completo, mancuernas al costado del pecho',       3, 10, 'pecho,tríceps'),
  ('Elevaciones Laterales Dom',  'Mancuernas al costado, codos ligeramente flexionados',  3, 15, 'hombro lateral'),
  ('Curl Martillo',              'Mancuernas, agarre neutro, movimiento controlado',      3, 12, 'bíceps,antebrazo')
) AS v(name, description, series, repetitions, muscle_tags)
CROSS JOIN (
  SELECT id FROM routine_type WHERE category = 'upper' AND days_of_the_week = 'domingo'
) AS rt;

-- Training logs del último domingo (user_id = 1)
INSERT INTO training_logs (user_id, exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details)
SELECT 1, e.id, v.weight_kg, v.repetitions_done, CURRENT_DATE - 7, v.start_time, v.end_time,
  jsonb_build_object('name', e.name, 'description', e.description,
                     'series', e.series, 'repetitions', e.repetitions, 'muscleTags', e.muscle_tags)
FROM exercises e
CROSS JOIN (VALUES
  (60::numeric, 32, '09:00:00'::time, '09:17:30'::time),
  (55::numeric, 40, '09:22:00'::time, '09:39:00'::time),
  (50::numeric, 36, '09:44:00'::time, '09:56:00'::time)
) AS v(weight_kg, repetitions_done, start_time, end_time)
WHERE e.name = 'Press Inclinado con Barra';

-- Training logs de hace 14 días (user_id = 1)
INSERT INTO training_logs (user_id, exercise_id_fk, weight_kg, repetitions_done, training_date, start_time, end_time, exercise_details)
SELECT 1, e.id, v.weight_kg, v.repetitions_done, CURRENT_DATE - 14, v.start_time, v.end_time,
  jsonb_build_object('name', e.name, 'description', e.description,
                     'series', e.series, 'repetitions', e.repetitions, 'muscleTags', e.muscle_tags)
FROM exercises e
CROSS JOIN (VALUES
  (55::numeric, 29, '10:00:00'::time, '10:20:30'::time)
) AS v(weight_kg, repetitions_done, start_time, end_time)
WHERE e.name = 'Press Inclinado con Barra';
