## Learned User Preferences

- Responder en español.
- Entregar código completo primero; explicación breve después con método socrático.
- Usar npm para dependencias y scripts (`npm install`, `npm run dev`, `npm run build`).
- Preferir Tailwind CSS y componentes estilo shadcn/ui para la UI.
- La landing pública no debe enlazar ni exponer el admin; el organizador entra solo por `/login`.
- Credenciales de demo del organizador: usuario `admin` y contraseña `admin`.

## Learned Workspace Facts

- App de meetup para demostrar MCP, Cursor, Supabase Realtime y deploy en Vercel.
- Stack actual: Vite + React + TypeScript + Tailwind v4 + Supabase (no Next.js).
- Modelo de datos: tablas `rooms` y `participants`; cada meetup usa un `slug` de sala.
- No hay borrado global de datos; «Reiniciar sala» desactiva la room actual y crea una nueva vacía.
- Rutas: `/join/:roomSlug` (público), `/login` (organizador), `/admin/:roomSlug` (protegido con sesión en `sessionStorage`).
- Variables de entorno del cliente: `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (plantilla en `env.sample`).
- Sala inicial tras migración: slug `demo`.
- Migración principal: `supabase/migrations/20240603100000_rooms_participants.sql`.
- Registro: nombre, email y número 1–100; email y número únicos por sala.
- Estados de participante: `registered`, `finalist`, `winner`.
- Auth de admin es solo demo en el cliente, no Supabase Auth.
- Deploy como SPA en Vercel con rewrites en `vercel.json`.
