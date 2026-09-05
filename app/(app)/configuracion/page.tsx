import { createClient } from "@/lib/supabase/server";
import {
  actualizarMontoCategoria,
  crearCategoria,
  eliminarCategoria,
  actualizarMontoActividad,
} from "./actions";
import { EliminarCategoriaButton } from "./eliminar-categoria-button";

export default async function ConfiguracionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: categorias }, { data: actividades }] = await Promise.all([
    supabase.from("categorias").select("id, nombre, monto_cuota, activa").order("nombre"),
    supabase.from("actividades").select("id, nombre, monto_cuota, activa").order("nombre"),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-club-navy-800">
        Configuración
      </h1>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium text-club-navy-800">
          Categorías de socio y valor de cuota
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Este monto es el que se usa cada vez que apretás &ldquo;Generar
          cuotas del mes&rdquo; en la sección Cuotas.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {(categorias ?? []).map((categoria) => (
            <div
              key={categoria.id}
              className="flex items-center gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <form
                action={actualizarMontoCategoria}
                className="flex flex-1 items-center gap-3"
              >
                <input type="hidden" name="id" value={categoria.id} />
                <span className="flex-1 text-sm font-medium text-club-navy-800">
                  {categoria.nombre}
                </span>
                <span className="text-sm text-zinc-500">$</span>
                <input
                  name="monto_cuota"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={categoria.monto_cuota}
                  className="w-32 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button
                  type="submit"
                  className="rounded-md bg-club-sky-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-club-sky-600"
                >
                  Guardar
                </button>
              </form>

              <form action={eliminarCategoria}>
                <input type="hidden" name="id" value={categoria.id} />
                <EliminarCategoriaButton nombre={categoria.nombre} />
              </form>
            </div>
          ))}

          {(categorias ?? []).length === 0 && (
            <p className="text-sm text-zinc-500">Todavía no hay categorías cargadas.</p>
          )}
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-zinc-600 dark:text-zinc-400">
            + Agregar categoría nueva
          </summary>
          <form
            action={crearCategoria}
            className="mt-3 flex flex-wrap items-end gap-3"
          >
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Nombre
              </label>
              <input
                name="nombre"
                required
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Monto cuota
              </label>
              <input
                name="monto_cuota"
                type="number"
                step="0.01"
                min="0"
                defaultValue={0}
                className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
            </div>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Crear
            </button>
          </form>
        </details>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium text-club-navy-800">
          Actividades y cuota adicional
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Si una actividad tiene costo extra sobre la cuota social, cargalo
          acá (dejalo en 0 si está incluida).
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {(actividades ?? []).map((actividad) => (
            <form
              key={actividad.id}
              action={actualizarMontoActividad}
              className="flex items-center gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <input type="hidden" name="id" value={actividad.id} />
              <span className="flex-1 text-sm font-medium text-club-navy-800">
                {actividad.nombre}
              </span>
              <span className="text-sm text-zinc-500">$</span>
              <input
                name="monto_cuota"
                type="number"
                step="0.01"
                min="0"
                defaultValue={actividad.monto_cuota}
                className="w-32 rounded-md border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
              />
              <button
                type="submit"
                className="rounded-md bg-club-sky-500 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-club-sky-600"
              >
                Guardar
              </button>
            </form>
          ))}

          {(actividades ?? []).length === 0 && (
            <p className="text-sm text-zinc-500">Todavía no hay actividades cargadas.</p>
          )}
        </div>
      </section>
    </div>
  );
}
