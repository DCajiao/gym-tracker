# GymTracker

App personal para trackear la rutina semanal del gimnasio. Muestra ejercicios por día según la rutina configurada en la DB, permite marcar series como completadas, y visualiza el historial y estadísticas de entrenamiento.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express (ESM), puerto 3001
- **Base de datos:** PostgreSQL en Supabase, accedido con Prisma (`@prisma/adapter-pg`)
- **Migraciones:** SQL numerados en `database_migrations/` con runner propio

## Requisitos

- Node.js 20+
- Base de datos PostgreSQL (Supabase recomendado)

## Setup inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Completar DATABASE_URL con la connection string de Supabase
# Ojo: caracteres especiales en la password deben ir URL-encoded (&→%26, %→%25)

# 3. Aplicar migraciones y generar cliente Prisma
npm run db:setup

# 4. Correr en desarrollo (frontend + backend)
npm run dev:all
```

Frontend: `http://localhost:8080` · Backend: `http://localhost:3001`

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev:all` | Frontend + backend juntos |
| `npm run dev` | Solo frontend (Vite) |
| `npm run dev:server` | Solo backend (con hot reload) |
| `npm run build` | Build del frontend |
| `npm run start:server` | Backend en modo producción |
| `npm run db:migrate` | Aplica migraciones nuevas |
| `npm run db:generate` | Regenera el cliente Prisma |
| `npm run db:pull` | Introspect DB → actualiza schema.prisma |
| `npm run lint` | ESLint |
| `npm run test` | Tests (Vitest) |

## Esquema de la base de datos

```
routine_type       — categorías (push/pull/leg) con días de la semana
exercises          — catálogo de ejercicios con series, reps target y muscle_tags
training_logs      — un registro por set ejecutado (peso, reps, timestamps, snapshot del ejercicio)
_migrations        — tabla interna del runner de migraciones
```

Los datos de prueba están en `database_migrations/01_seed_testing_data.sql` y se aplican con `npm run db:migrate`.

## Agregar una migración

1. Crear `database_migrations/NN_descripcion.sql`
2. `npm run db:migrate`
3. `npm run db:pull && npm run db:generate`

**Nunca modificar un archivo de migración ya aplicado** — siempre agregar uno nuevo.

## API

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/schedule` | Semana completa (7 días) con rutina y ejercicios |
| GET/POST | `/api/routine-types` | Tipos de rutina |
| GET/PUT/DELETE | `/api/routine-types/:id` | |
| GET/POST | `/api/exercises` | Catálogo de ejercicios (`?routineTypeId=N`) |
| GET/PUT/DELETE | `/api/exercises/:id` | |
| GET/POST | `/api/training-logs` | Logs de sets (`?date=yyyy-MM-dd`, `?exerciseId=N`) |
| GET/DELETE | `/api/training-logs/:id` | |

## Deploy en Render

- **Frontend:** Static Site → build command `npm run build`, publish dir `dist`
- **Backend:** Web Service (privado) → start command `node server/index.js`
- Variables en el dashboard de Render: `DATABASE_URL` y `FRONTEND_URL` (para CORS)
