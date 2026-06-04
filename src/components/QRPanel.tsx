import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, ExternalLink, Link2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { joinUrl } from "@/lib/utils";

interface QRPanelProps {
  roomSlug: string;
  showEnter?: boolean;
}

export function QRPanel({ roomSlug, showEnter = false }: QRPanelProps) {
  const url = joinUrl(roomSlug);
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <Card className="border-sky-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-sky-400" aria-hidden />
          QR y acceso a la sala
        </CardTitle>
        <CardDescription>
          Comparte el QR o el enlace para que los asistentes se registren.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="rounded-2xl bg-white p-4 shadow-2xl">
          <QRCodeSVG value={url} size={showEnter ? 200 : 160} level="M" includeMargin />
        </div>
        <div className="w-full flex-1 space-y-3">
          <p className="break-all rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-sky-200">
            {url}
          </p>
          <Button variant="secondary" className="w-full" onClick={() => void copyLink()}>
            {copied ? (
              <>
                <Check className="h-4 w-4" aria-hidden />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden />
                Copiar enlace
              </>
            )}
          </Button>
          {showEnter && (
            <>
              <Button asChild className="w-full">
                <Link to={`/join/${roomSlug}`} target="_blank" rel="noopener noreferrer">
                  <LogIn className="h-4 w-4" aria-hidden />
                  Ingresar a la sala
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
                </Link>
              </Button>
              <p className="text-center text-xs text-slate-500">
                Abre la vista de registro como la verían los asistentes.
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
