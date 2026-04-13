-- Elimina los routine_types duplicados sin ejercicios que quedaron de una
-- ejecución doble del seed inicial. Los IDs 4, 5, 6 son copias vacías de
-- push/pull/leg; el ID 5 además tenía "domingo" en days_of_the_week, lo que
-- ocultaba la rutina upper del domingo (ID 7).
DELETE FROM routine_type WHERE id IN (4, 5, 6);
