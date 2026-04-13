-- =============================================================================
-- Datos base
-- =============================================================================

-- Tipos de rutina
INSERT INTO routine_type (category, days_of_the_week, description) VALUES
  ('push_heavy',    'lunes',     'Push pesado: pecho, hombro, tríceps'),
  ('pull_heavy',    'martes',    'Pull pesado: espalda, bíceps'),
  ('leg_quad',      'miércoles', 'Pierna dominante en cuádriceps'),
  ('push_volume',   'jueves',    'Push volumen: hipertrofia'),
  ('pull_posterior','viernes',   'Pull + pierna posterior');

-- Ejercicios
INSERT INTO exercises (name, description, series, repetitions, muscle_tags, routine_type_id_fk) VALUES
-- ================= PUSH HEAVY (id=1)
('Press Banca Plano',         'Barra, enfoque fuerza',                    4, 8,  'pecho,tríceps,hombro',        1),
('Press Inclinado Mancuernas','Banco inclinado',                          4, 10, 'pecho superior,hombro',      1),
('Press Militar',             'Barra de pie',                             4, 8,  'hombro,tríceps',             1),
('Elevaciones Laterales',     'Controladas',                              4, 15, 'hombro',                     1),
('Fondos',                    'Peso corporal o lastrado',                 3, 10, 'pecho,tríceps',              1),
('Extensión Tríceps Polea',   'Cuerda',                                   3, 15, 'tríceps',                    1),

-- ================= PULL HEAVY (id=2)
('Dominadas',                 'Agarre prono',                             4, 8,  'espalda,bíceps',             2),
('Remo con Barra',            'Torso inclinado',                          4, 8,  'espalda,bíceps',             2),
('Jalón al Pecho',            'Polea alta',                               3, 12, 'espalda',                    2),
('Face Pull',                 'Cuerda a la cara',                         3, 15, 'hombro posterior',           2),
('Curl Bíceps Barra',         'Barra recta o EZ',                         4, 10, 'bíceps',                     2),
('Curl Martillo',             'Mancuernas',                               3, 12, 'bíceps,antebrazo',           2),

-- ================= LEG QUAD (id=3)
('Sentadilla',                'Barra espalda alta',                       4, 8,  'cuádriceps,glúteo',          3),
('Prensa',                    'Máquina',                                  4, 12, 'cuádriceps,glúteo',          3),
('Extensiones',               'Máquina',                                  4, 15, 'cuádriceps',                3),
('Zancadas',                  'Caminando o estáticas',                    3, 10, 'cuádriceps,glúteo',          3),
('Elevación de Gemelos',      'De pie',                                   4, 20, 'gemelo',                    3),

-- ================= PUSH VOLUME (id=4)
('Press Inclinado Barra',     'Enfoque hipertrofia',                      4, 10, 'pecho superior',             4),
('Aperturas Mancuernas',      'Movimiento controlado',                    4, 12, 'pecho',                     4),
('Press Militar Mancuernas',  'Sentado o de pie',                         3, 10, 'hombro',                    4),
('Elevaciones Laterales Drop','Drop set',                                 3, 15, 'hombro',                    4),
('Tríceps Cuerda',            'Polea',                                    4, 15, 'tríceps',                   4),
('Press Cerrado',             'Barra agarre cerrado',                     3, 10, 'tríceps,pecho',             4),

-- ================= PULL POSTERIOR (id=5)
('Peso Muerto',               'Desde el suelo',                           4, 6,  'espalda baja,glúteo',        5),
('Remo Máquina',              'Guiado',                                   3, 12, 'espalda',                   5),
('Jalón Cerrado',             'Agarre cerrado',                           3, 10, 'espalda',                   5),
('Curl Femoral',              'Máquina',                                  4, 12, 'femoral',                   5),
('Hip Thrust',                'Barra',                                    3, 10, 'glúteo',                    5),
('Curl Bíceps Concentrado',   'Aislamiento',                              3, 12, 'bíceps',                    5);