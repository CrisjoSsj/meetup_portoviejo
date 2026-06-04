# Meetup Portoviejo — Rooms, Realtime y MCP

App para demostrar **Cursor**, **Supabase MCP** y **Vercel** en una meetup. Cada sesión usa una **Room** (`slug`); los datos históricos **nunca se borran** — al reiniciar solo se crea una sala nueva.

## Stack

- React 19 + TypeScript + **Vite**
- **Tailwind CSS v4** + componentes estilo shadcn/ui
- **Supabase** — tablas `rooms` y `participants`, RLS demo, **Realtime**
- **Recharts** — gráficos del dashboard
- **qrcode.react** — QR dinámico
- **Vercel** — SPA con rewrites

## Rutas

| Ruta | Uso |
|------|-----|
| `/` | Landing — solo enlace de registro para asistentes |
| `/join/:roomSlug` | Registro público (nombre, email, número 1–100) |
| `/login` | Acceso organizador (`admin` / `admin`) |
| `/admin/:roomSlug` | Dashboard + panel de control + QR (requiere login) |

Sala inicial tras migración: **`demo`**

## Setup local

```bash
npm install
cp env.sample .env.local
# Edita VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
npm run dev
```

Abre http://localhost:5173

## 1. Base de datos (Supabase)

Ejecuta en SQL Editor o con **Supabase MCP**:

```text
supabase/migrations/20240603100000_rooms_participants.sql
```

Tablas pensadas para consultas MCP:

- `rooms` — `id`, `name`, `slug`, `created_at`, `is_active`
- `participants` — `room_id`, `name`, `email`, `selected_number`, `status` (`registered` \| `finalist` \| `winner`)

Restricciones por sala:

- `unique (room_id, email)`
- `unique (room_id, selected_number)`

## 2. Variables en Vercel

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto |
| `VITE_SUPABASE_ANON_KEY` | Clave anon / publishable (nunca `service_role`) |

Framework preset: **Vite**. El `vercel.json` ya reescribe rutas al `index.html`.

```bash
npx vercel --prod
```

## 3. Panel de control (demo en vivo)

En `/admin/:roomSlug`:

| Botón | Efecto |
|-------|--------|
| **Ronda 1: 50 al azar** | Elige 50 registrados al azar → `status = finalist` |
| **Ronda 2: 25 al azar** | De los finalistas, conserva 25 al azar; el resto vuelve a `registered` |
| **Ronda 3: 10 al azar** | De los finalistas, conserva 10 al azar; el resto vuelve a `registered` |
| **Ronda 4: 1 ganador** | 1 finalista al azar → `status = winner` |
| **Reiniciar sala** | Marca sala actual `is_active = false`, crea **nueva** room vacía (mismo nombre, slug nuevo) |

## 4. Prompts MCP sugeridos (meetup)

Con Supabase MCP conectado al mismo proyecto:

1. *«Muéstrame cuántos participantes hay registrados en la sala `demo`.»*
2. *«Elige 50 registrados al azar y conviértelos en finalistas.»*
3. *«De los finalistas, conserva 25 al azar y devuelve el resto a registrado.»*
4. *«De los finalistas, conserva 10 al azar.»*
5. *«Elige 1 ganador al azar entre los finalistas.»*
6. *«Muéstrame estadísticas de la sala `demo`: total registrados, finalistas y ganadores.»*
7. *«¿Qué número fue el más popular en la sala activa?»*
8. *«¿Cuántas personas se registraron en los últimos 5 minutos?»*

Ejemplo SQL útil:

```sql
select selected_number, count(*) as total
from participants
where room_id = (select id from rooms where slug = 'demo')
group by selected_number
order by total desc
limit 1;
```

## 5. Guion rápido (~15 min)

| Min | Acción |
|-----|--------|
| 0–2 | Mostrar `/` y modelo `rooms` + `participants` |
| 2–6 | **MCP**: ejecutar migración, confirmar sala `demo` |
| 6–9 | **Vercel**: deploy + env vars |
| 9–12 | QR → `/join/demo`, registrar asistentes en móviles |
| 12–15 | `/admin/demo`: Realtime, finalistas, ganadores, MCP SQL |

## Seguridad

RLS permite lectura/escritura **anónima** a propósito para la demo. En producción: auth en admin, políticas restrictivas, rate limiting.

## Scripts

```bash
npm run dev      # http://localhost:5173
npm run build    # verificar antes del meetup
npm run preview  # build local
```

## Estructura

```text
src/
  pages/           Home, Join, Admin
  components/      UI, gráficos, QR, controles demo
  hooks/           room + participants + realtime
  lib/             supabase, acciones de sala, tipos
supabase/migrations/
public/
```
