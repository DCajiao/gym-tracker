# GymTracker

App personal para trackear la rutina semanal del gimnasio. Muestra ejercicios por día, permite marcar series como completadas, y visualiza el historial y estadísticas de entrenamiento.

## Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend:** Node.js + Express (ESM)
- **Base de datos:** PostgreSQL en Supabase, accedido con Prisma (adapter `@prisma/adapter-pg`)
- **Migraciones:** SQL versionado en `database_migrations/` con runner propio

## Requisitos

- Node.js 20+
- Una base de datos PostgreSQL (Supabase recomendado)

## Setup inicial

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env con tu DATABASE_URL de Supabase

# 3. Aplicar migraciones, seed y generar cliente Prisma
npm run db:setup

# 4. Correr en desarrollo (frontend + backend)
npm run dev:all
```

El frontend queda en `http://localhost:8080` y el backend en `http://localhost:3001`.

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev:all` | Frontend + backend juntos |
| `npm run dev` | Solo frontend (Vite) |
| `npm run dev:server` | Solo backend (con hot reload) |
| `npm run build` | Build del frontend |
| `npm run start:server` | Backend en modo producción |
| `npm run db:migrate` | Aplica migraciones nuevas |
| `npm run db:seed` | Pobla con datos mock (idempotente) |
| `npm run db:generate` | Regenera el cliente Prisma |
| `npm run db:pull` | Introspect DB → actualiza schema.prisma |
| `npm run lint` | ESLint |
| `npm run test` | Tests (Vitest) |

## Agregar una migración

1. Crear `database_migrations/NN_descripcion.sql` (ej: `01_add_notes_column.sql`)
2. `npm run db:migrate`
3. `npm run db:pull && npm run db:generate`

Nunca modificar un archivo de migración ya aplicado — siempre crear uno nuevo.

## API

El backend expone:

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/history` | Todos los logs ordenados por fecha desc |
| GET | `/api/history/:date` | Log de una fecha (yyyy-MM-dd) |
| POST | `/api/history` | Guardar/actualizar un entrenamiento |

## Deploy en Render

- **Frontend:** Static Site → build command `npm run build`, publish dir `dist`
- **Backend:** Web Service (privado) → start command `node server/index.js`, variable `DATABASE_URL` configurada en el dashboard
- Configurar `FRONTEND_URL` en el backend para el header CORS
