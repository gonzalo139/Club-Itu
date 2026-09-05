import { createClient } from "@/lib/supabase/server";
import { crearSocio } from "../actions";

export default async function NuevoSocioPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nombre")
    .eq("activa", true)
    .order("nombre");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-club-navy-800">
        Nuevo socio
      </h1>

      <form
        action={crearSocio}
        className="flex max-w-lg flex-col gap-4 rounded-lg border border-border bg-surface p-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="nombre" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="apellido" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="dni" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            DNI
          </label>
          <input
            id="dni"
            name="dni"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="telefono" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Teléfono
            </label>
            <input
              id="telefono"
              name="telefono"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="categoria_id" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Categoría
          </label>
          <select
            id="categoria_id"
            name="categoria_id"
            required
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
          >
            {(categorias ?? []).map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="mt-2 rounded-md bg-club-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-club-sky-600"
        >
          Guardar socio
        </button>
      </form>
    </div>
  );
}
