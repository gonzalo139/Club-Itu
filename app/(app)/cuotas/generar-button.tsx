"use client";

import { useState, useTransition } from "react";
import { generarCuotasDelMes } from "./actions";

export function GenerarCuotasButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const result = await generarCuotasDelMes();
            setError(result.error);
          })
        }
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
      >
        {isPending ? "Generando..." : "Generar cuotas del mes"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
