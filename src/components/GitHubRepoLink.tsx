import { Github } from "lucide-react";
import { GITHUB_REPO_URL } from "@/lib/club-links";
import { cn } from "@/lib/utils";

interface GitHubRepoLinkProps {
  className?: string;
}

export function GitHubRepoLink({ className }: GitHubRepoLinkProps) {
  return (
    <a
      href={GITHUB_REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ver código en GitHub"
      title="Código en GitHub"
      className={cn(
        "fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-black/70 text-zinc-400 shadow-lg backdrop-blur-md transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400",
        className,
      )}
    >
      <Github className="h-5 w-5" aria-hidden />
    </a>
  );
}
