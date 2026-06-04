import { Link } from "react-router-dom";

const CURSOR_LOGO = "/cursor-cube-logo.png";
const CLUB_LOGO = "/club-ia-uleam.png";

const logoFrame =
  "size-full rounded-xl object-contain bg-white/[0.08] p-1.5 ring-1 ring-white/15";

interface EventBrandProps {
  compact?: boolean;
}

export function EventBrand({ compact }: EventBrandProps) {
  const box = compact ? "h-9 w-9" : "h-11 w-11";

  return (
    <Link
      to="/"
      aria-label="Meetup Cursor, Club de IA ULEAM — inicio"
      className="group flex min-w-0 items-center gap-3"
    >
      <div className="flex shrink-0 items-center gap-2" aria-hidden>
        <span className={`inline-flex ${box}`}>
          <img src={CURSOR_LOGO} alt="" className={logoFrame} />
        </span>
        <span className="text-sm font-light text-zinc-600 select-none">×</span>
        <span className={`inline-flex ${box}`}>
          <img src={CLUB_LOGO} alt="" className={logoFrame} />
        </span>
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate font-semibold text-white group-hover:text-zinc-200">
          Meetup <span className="text-zinc-400">Cursor</span>
        </p>
        <p className="truncate text-xs text-zinc-500">Club de IA · ULEAM</p>
      </div>
    </Link>
  );
}
