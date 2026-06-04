import { Link } from "react-router-dom";
import { ArrowRight, Circle, QrCode, Smartphone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { joinUrl } from "@/lib/utils";
import type { Room } from "@/lib/types";

interface RoomEntryCardProps {
  room: Room;
}

export function RoomEntryCard({ room }: RoomEntryCardProps) {
  const joinPath = `/join/${room.slug}`;
  const joinFullUrl = joinUrl(room.slug);

  if (!room.is_active) {
    return (
      <article className="rounded-2xl border border-white/8 bg-[#0d1117]/60 p-6 opacity-70">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-zinc-300">{room.name}</h3>
            <p className="mt-1 font-mono text-xs text-zinc-600">{joinPath}</p>
          </div>
          <Badge variant="secondary">
            <Circle className="mr-1 h-2 w-2 fill-current text-zinc-500" aria-hidden />
            Cerrada
          </Badge>
        </div>
        <Button className="mt-5 w-full" disabled variant="secondary">
          Sala cerrada
        </Button>
      </article>
    );
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#14141c] via-[#0f0f14] to-[#0a0a0c] shadow-2xl shadow-black/50 transition-[border-color,box-shadow] duration-300 hover:border-white/20 hover:shadow-emerald-950/20">
      <div
        className="pointer-events-none absolute -left-16 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-emerald-500/15 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col md:flex-row">
        {/* Panel QR */}
        <div className="flex flex-col items-center justify-center border-b border-white/[0.06] bg-white/[0.02] px-6 py-8 md:w-[13.5rem] md:shrink-0 md:border-b-0 md:border-r md:py-10">
          <div className="mb-4 flex items-center gap-2 text-emerald-400/90">
            <QrCode className="h-4 w-4" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Acceso rápido
            </span>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-60"
              aria-hidden
            />
            <div className="relative rounded-2xl bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/20">
              <QRCodeSVG value={joinFullUrl} size={128} level="M" includeMargin />
            </div>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-center text-xs text-zinc-500">
            <Smartphone className="h-3.5 w-3.5 shrink-0 text-zinc-600" aria-hidden />
            Abre la sala en tu móvil
          </p>
        </div>

        {/* Info + CTA */}
        <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Sala en vivo
                </p>
                <h3 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-[1.65rem]">
                  {room.name}
                </h3>
              </div>
              <Badge className="shrink-0 border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">
                <span className="relative mr-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <Circle className="relative h-2 w-2 fill-emerald-400 text-emerald-400" aria-hidden />
                </span>
                Activa
              </Badge>
            </div>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
              Elige tu número del 1 al 100 y regístrate en tiempo real para el sorteo del meetup.
            </p>

            <p className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/8 bg-black/30 px-3 py-1.5 font-mono text-xs text-zinc-500">
              <span className="text-zinc-600">/</span>
              join
              <span className="text-zinc-600">/</span>
              <span className="text-zinc-300">{room.slug}</span>
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="h-12 w-full rounded-xl bg-white text-base font-semibold text-black shadow-lg shadow-white/5 transition-transform hover:bg-zinc-100 active:scale-[0.99] sm:w-auto sm:min-w-[220px]"
          >
            <Link to={joinPath}>
              Unirse al sorteo
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
