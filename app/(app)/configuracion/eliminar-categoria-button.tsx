"use client";

export function EliminarCategoriaButton({ nombre }: { nombre: string }) {
  return (
    <button
      type="submit"
      onClick={(evento) => {
        if (!confirm(`¿Eliminar la categoría "${nombre}"? Esta acción no se puede deshacer.`)) {
          evento.preventDefault();
        }
      }}
      className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
    >
      Eliminar
    </button>
  );
}
