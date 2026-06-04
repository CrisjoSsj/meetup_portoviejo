import { ExternalLink, Users } from "lucide-react";
import { CLUB_COMMUNITY_URL } from "@/lib/club-links";
import { cn } from "@/lib/utils";

interface ClubCommunityLinkProps {
  variant?: "footer" | "cta";
  className?: string;
}

export function ClubCommunityLink({ variant = "footer", className }: ClubCommunityLinkProps) {
  if (variant === "cta") {
    return (
      <a
        href={CLUB_COMMUNITY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group inline-flex items-center gap-2.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2.5 text-sm font-medium text-indigo-200 transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-white",
          className,
        )}
      >
        <Users className="h-4 w-4 shrink-0 text-indigo-400 group-hover:text-indigo-300" aria-hidden />
        Regístrate en la comunidad del Club de IA
        <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
      </a>
    );
  }

  return (
    <a
      href={CLUB_COMMUNITY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-1.5 text-indigo-400/90 transition-colors hover:text-indigo-300",
        className,
      )}
    >
      Comunidad Club de IA ULEAM
      <ExternalLink className="h-3 w-3 opacity-70" aria-hidden />
    </a>
  );
}
