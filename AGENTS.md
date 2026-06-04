## Learned User Preferences

- Responder en español.
- Entregar código completo primero; explicación breve después con método socrático.
- Usar npm para dependencias y scripts (`npm install`, `npm run dev`, `npm run build`).
- Preferir Tailwind CSS y componentes estilo shadcn/ui para la UI.
- La landing pública no debe enlazar ni exponer el admin; el organizador entra solo por `/login`.
- Credenciales de demo del organizador: usuario `admin` y contraseña `admin`.

## Learned Workspace Facts

- App de meetup Cursor × Club de IA ULEAM para demostrar MCP, Supabase Realtime y deploy en Vercel.
- Stack actual: Vite + React + TypeScript + Tailwind v4 + Supabase (no Next.js).
- Modelo de datos: tablas `rooms` y `participants`; cada meetup usa un `slug` de sala.
- No hay borrado global de datos; «Reiniciar sala» desactiva la room actual y crea una nueva vacía.
- Rutas: `/join/:roomSlug`, `/login` (organizador), `/admin/:roomSlug` (sesión en `sessionStorage`); auth admin solo demo en cliente, no Supabase Auth.
- Variables de entorno del cliente: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (plantilla en `env.sample`).
- Sala inicial tras migración: slug `demo`.
- Migración principal: `supabase/migrations/20240603100000_rooms_participants.sql`.
- Registro: nombre, email y número 1–100; email y número únicos por sala.
- Estados de participante: `registered`, `finalist`, `winner`.
- Embudo demo del admin: 4 rondas aleatorias (50 → 25 → 10 finalistas) y ronda final con 3 ganadores (`DEMO_FUNNEL` en `room-actions.ts`).
- Deploy como SPA en Vercel con rewrites en `vercel.json`.
