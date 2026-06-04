import { ClubCommunityLink } from "@/components/ClubCommunityLink";
import { EventBrand } from "@/components/EventBrand";

interface AppShellProps {
  children: React.ReactNode;
  badge?: string;
}

export function AppShell({ children, badge }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <header className="relative z-10 border-b border-white/[0.06] bg-black/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <EventBrand />
          {badge && (
            <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-zinc-400 sm:inline">
              {badge}
            </span>
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-black/40 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-center text-xs text-zinc-500 sm:flex-row sm:px-6 sm:text-left">
          <p className="text-zinc-600">Portoviejo · 2026</p>
          <ClubCommunityLink variant="footer" />
          <p className="text-zinc-600">MCP · Supabase · Realtime</p>
        </div>
      </footer>
    </div>
  );
}
