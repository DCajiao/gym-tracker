# Casos de Uso — GymTracker

Documento de referencia que describe cómo el usuario interactúa con la app, qué funcionalidad existe hoy y qué falta implementar.

## Actor

**Usuario** — persona que usa la app para seguir su rutina semanal de gimnasio. Uso personal, sin autenticación ni múltiples cuentas.

---

## Flujo completo: un día de entrenamiento (happy path)

Este es el flujo que el usuario debería poder hacer de principio a fin. Los pasos marcados con ⚠️ están rotos o incompletos hoy.

```
1. Abre la app → ve la pestaña Rutina con el día de hoy resaltado
2. Confirma el tipo de rutina del día (ej. 💪 push — "Pecho, hombros y tríceps")
3. Revisa los ejercicios: nombres, músculos, series y reps objetivo
4. Pulsa "Iniciar entrenamiento"
5. Empieza el primer ejercicio. Expande la tarjeta para ver el detalle
6. Ejecuta el primer set
   ⚠️  Registra el peso que levantó (input kg) — pendiente
   ✅  Marca el set como completado (captura start_time en el primer set)
   ⚠️  Inicia el temporizador de descanso — pendiente
7. Repite para cada set del ejercicio
   ✅  Al completar el último set → se guarda automáticamente en la BD (captura end_time)
8. Repite para cada ejercicio del día
9. Pulsa "Terminar entrenamiento" (o sigue hasta completar todos)
10. Navega a Historial → ve el entrenamiento de hoy recién guardado
11. Navega a Insights → los stats reflejan el entrenamiento de hoy
```

---

## Casos de uso implementados ✅

### UC-01 — Ver la rutina del día

**Descripción:** Al abrir la app, el usuario ve automáticamente la rutina asignada para el día de hoy según el calendario semanal configurado en la BD.

**Flujo:**
1. La app detecta el día actual (lunes = 0 … domingo = 6)
2. Carga el schedule semanal desde `GET /api/schedule`
3. Muestra el día de hoy seleccionado con el tipo de rutina (push / pull / leg) y su emoji
4. Lista los ejercicios del día con nombre, músculos y series × reps objetivo
5. Si el día es de descanso, muestra la pantalla de descanso

**Estado visual:**
- Badge de categoría (`push`, `pull`, `leg`) en la esquina superior
- Emoji correspondiente (💪 push · 🏋️ pull · 🦵 leg · 😴 descanso)
- Stats: total de ejercicios y series del día

---

### UC-02 — Navegar entre días de la semana

**Descripción:** El usuario puede seleccionar cualquier día de la semana para ver su rutina asignada.

**Flujo:**
1. El selector de días (Lun–Dom) está siempre visible en el header
2. El día de hoy tiene un anillo de resaltado
3. El usuario toca cualquier otro día
4. La vista actualiza la rutina, el tipo y los ejercicios del día seleccionado

---

### UC-03 — Ver detalle de un ejercicio

**Descripción:** El usuario expande una tarjeta de ejercicio para ver la información completa antes o durante la ejecución.

**Flujo:**
1. El usuario ve las tarjetas de ejercicio colapsadas (nombre + músculos + N series × M reps)
2. Toca la tarjeta para expandirla
3. Ve los chips de músculos objetivo (ej. `pecho` · `tríceps` · `hombro`)
4. Ve la descripción técnica del ejercicio (si existe)
5. Ve la lista de sets con el objetivo de reps para cada uno

---

### UC-04 — Marcar sets como completados ✅

**Descripción:** Durante una sesión activa, el usuario marca cada set como completado conforme los ejecuta.

**Flujo:**
1. El usuario pulsa "Iniciar entrenamiento" → las tarjetas se vuelven interactivas
2. Con la tarjeta expandida, el usuario ve N filas (una por set)
3. Toca una fila → el set cambia a verde con ✓; el primer toque captura `start_time`
4. El contador actualiza: "(1/4)", "(2/4)"…
5. Al completar todos los sets → captura `end_time` + guarda automáticamente en la BD
6. La tarjeta entera queda verde/bloqueada con ✓

**Nota:** Sin sesión activa, las tarjetas son de solo lectura.

---

### UC-05 — Ver historial de entrenamientos

**Descripción:** El usuario consulta los entrenamientos pasados registrados en la BD.

**Flujo:**
1. Navega a la pestaña Historial
2. Ve los días entrenados agrupados por fecha (más reciente primero)
3. Cada día muestra: fecha, ejercicios del día, volumen total (t) y sets totales
4. Toca un día para expandirlo
5. Ve cada ejercicio con sus sets: `75kg × 8`, `80kg × 6`, etc.

---

### UC-06 — Filtrar historial por período

**Descripción:** El usuario filtra el historial para ver solo un rango de tiempo específico.

**Opciones disponibles:**
- **Semana** — entrenamientos de la semana actual (lun–dom)
- **Mes** — entrenamientos del mes actual
- **Todo** — todos los registros
- **Fecha** — selector de fecha para ver un día específico

---

### UC-07 — Ver estadísticas e insights

**Descripción:** El usuario consulta un resumen de su progreso y hábitos de entrenamiento.

**Métricas disponibles:**
- **Volumen semanal** — kg totales (peso × reps) de esta semana vs. la anterior, con % de cambio
- **Sesiones esta semana** — número de días entrenados vs. semana anterior
- **Sets totales** — acumulado histórico
- **Racha actual** — días consecutivos con al menos un entrenamiento registrado
- **Gráfico de barras** — volumen por semana, últimas 4 semanas
- **Distribución muscular** — qué grupos musculares se han trabajado más (barras proporcionales, top 6)
- **Resumen global** — total de días entrenados y sets registrados

---

## Casos de uso pendientes ⛔

### UC-08 — Registrar el peso levantado por set
**Prioridad: Alta**

El usuario necesita poder ingresar cuántos kg usó en cada set al marcarlo como completado. Hoy el log se guarda con `weight_kg = null`; la BD admite el campo pero el flujo no lo captura aún.

**Flujo esperado:**
1. Al expandir la tarjeta, cada fila de set tiene un input para `kg`
2. El usuario ingresa el peso (puede quedar prellenado con el último registro para ese ejercicio)
3. Confirma el set → queda guardado con peso + reps

---

### UC-09 — Guardar un entrenamiento completado ✅

**Descripción:** Cada ejercicio completado se persiste automáticamente en la BD en el momento en que el usuario marca el último set.

**Flujo:**
1. El usuario inicia sesión con "Iniciar entrenamiento"
2. Al completar el último set de un ejercicio → POST automático a `/api/training-logs`
3. El ejercicio queda bloqueado (verde) confirmando el guardado
4. Al navegar a Historial e Insights los datos aparecen de inmediato
5. "Terminar entrenamiento" cierra la sesión; los ejercicios ya guardados permanecen

---

### UC-10 — Temporizador de descanso entre sets
**Prioridad: Media**

El usuario necesita saber cuánto descansar entre sets. Existe el componente `RestTimer` en el código pero no está integrado en el flujo.

**Flujo esperado:**
1. Al marcar un set como completado, arranca automáticamente un temporizador
2. El temporizador muestra cuenta regresiva (ej. 90 seg)
3. Al llegar a 0, vibra o emite un sonido de aviso
4. El usuario puede saltarlo o resetearlo manualmente

---

### UC-11 — Editar o eliminar un log registrado
**Prioridad: Media**

El usuario comete errores al registrar (peso equivocado, reps incorrectas) y necesita poder corregirlos.

**Flujo esperado:**
1. En Historial, expande un día y un ejercicio
2. Toca un set registrado → puede editar peso/reps o eliminar el set
3. El backend tiene DELETE `/api/training-logs/:id` listo

---

### UC-12 — Agregar notas a un set o ejercicio
**Prioridad: Baja**

El usuario quiere anotar observaciones durante el entrenamiento (ej. "técnica fallando en rep 5", "subir peso la próxima").

**Flujo esperado:**
1. Al registrar un set, hay un campo opcional de texto
2. Las notas aparecen en el historial al expandir ese set

---

### UC-14 — Configurar la rutina semanal ✅
**Prioridad: Alta**

El usuario puede asignar qué tipo de rutina (push / pull / leg / upper / etc.) corresponde a cada día de la semana.

**Flujo:**
1. Navega a la pestaña Ajustes
2. Ve los 7 días de la semana, cada uno con la rutina actualmente asignada (o "Descanso")
3. Toca un día → se despliega el selector con todas las rutinas disponibles
4. Selecciona una rutina o "Descanso"
5. Repite para los días que quiera cambiar
6. Pulsa "Guardar cambios" → se actualizan los `days_of_the_week` de los routine_types en la BD
7. La pestaña Rutina refleja los cambios inmediatamente

---

### UC-13 — Ver progreso de fuerza por ejercicio
**Prioridad: Media**

El usuario quiere saber si está progresando en un ejercicio específico a lo largo del tiempo.

**Flujo esperado:**
1. Desde el historial o desde la tarjeta de un ejercicio, accede al detalle
2. Ve un gráfico de línea: fechas vs. peso máximo levantado en ese ejercicio
3. Ve su personal record (PR) marcado

---

## Matriz de estado

| ID | Caso de uso | Estado |
|---|---|---|
| UC-01 | Ver la rutina del día | ✅ Implementado |
| UC-02 | Navegar entre días | ✅ Implementado |
| UC-03 | Ver detalle de ejercicio | ✅ Implementado |
| UC-04 | Marcar sets como completados | ✅ Implementado (persiste en BD) |
| UC-05 | Ver historial | ✅ Implementado |
| UC-06 | Filtrar historial | ✅ Implementado |
| UC-07 | Ver insights | ✅ Implementado |
| UC-08 | Registrar peso por set | ⛔ Pendiente — `weight_kg` se guarda null |
| UC-09 | Guardar entrenamiento | ✅ Implementado (auto-save por ejercicio) |
| UC-10 | Temporizador de descanso | ⛔ Pendiente |
| UC-11 | Editar / eliminar log | ⛔ Pendiente |
| UC-12 | Notas por set | ⛔ Pendiente |
| UC-13 | Progreso de fuerza | ⛔ Pendiente |
| UC-14 | Configurar rutina semanal | ✅ Implementado |

## Gaps críticos pendientes (por prioridad)

1. **UC-08 — Peso por set** (Alta): el campo existe en la BD y en los tipos, pero el flujo no captura el valor del usuario. Impacta el volumen calculado en Insights (hoy asume kg = 0 en sets sin peso).
2. **UC-10 — Temporizador** (Media): existe el componente `RestTimer` en el código pero sin integrar.
3. **UC-11 — Editar log** (Media): el endpoint `DELETE /api/training-logs/:id` ya existe; falta la UI.
4. **UC-13 — Progreso de fuerza** (Media): requiere gráfico de línea por ejercicio, nuevo endpoint o query filtrada por `exerciseId`.
