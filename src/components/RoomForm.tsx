import { useEffect, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { slugifyBase } from "@/lib/room-actions";
import type { Room } from "@/lib/types";

export interface RoomFormValues {
  name: string;
  slug: string;
  isActive: boolean;
}

interface RoomFormProps {
  initial?: Room | null;
  submitLabel: string;
  onSubmit: (values: RoomFormValues) => Promise<void>;
  onCancel?: () => void;
}

export function RoomForm({ initial, submitLabel, onSubmit, onCancel }: RoomFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(slugifyBase(name));
    }
  }, [name, slugTouched]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ name, slug, isActive });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="room-name">Nombre</Label>
        <Input
          id="room-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Meetup Portoviejo"
          required
          minLength={2}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="room-slug">Slug (URL)</Label>
        <Input
          id="room-slug"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value.toLowerCase());
          }}
          placeholder="mi-sala"
          required
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          disabled={loading}
        />
        <p className="text-xs text-slate-500">Solo minúsculas, números y guiones.</p>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-white/20 bg-black/40 accent-sky-500"
        />
        Sala activa (acepta registros)
      </label>
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Guardando…
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
