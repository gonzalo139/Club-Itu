import { createClient } from "@/lib/supabase/server";
import { crearActividad, inscribirSocio, darDeBajaInscripcion } from "./actions";

export default async function ActividadesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: actividades }, { data: socios }, { data: inscripciones }] =
    await Promise.all([
      supabase.from("actividades").select("id, nombre, monto_cuota, activa").order("nombre"),
      supabase
        .from("socios")
        .select("id, nombre, apellido")
        .eq("estado", "activo")
        .order("apellido"),
      supabase
        .from("socio_actividades")
        .select("id, actividad_id, socios(nombre, apellido)")
        .order("id"),
    ]);

  const inscripcionesPorActividad = new Map<
    string,
    { id: string; socio: { nombre: string; apellido: string } | null }[]
  >();
  for (const inscripcion of inscripciones ?? []) {
    const lista = inscripcionesPorActividad.get(inscripcion.actividad_id) ?? [];
    lista.push({
      id: inscripcion.id,
      socio: inscripcion.socios as unknown as { nombre: string; apellido: string } | null,
    });
    inscripcionesPorActividad.set(inscripcion.actividad_id, lista);
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Actividades
      </h1>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Nueva actividad
        </h2>
        <form action={crearActividad} className="mt-4 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="nombre" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              required
              placeholder="Fútbol, Vóley, Gimnasia..."
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="monto_cuota" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Cuota adicional (opcional)
            </label>
            <input
              id="monto_cuota"
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
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Crear actividad
          </button>
        </form>
      </section>

      <div className="flex flex-col gap-6">
        {(actividades ?? []).map((actividad) => {
          const inscriptos = inscripcionesPorActividad.get(actividad.id) ?? [];
          return (
            <section
              key={actividad.id}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                    {actividad.nombre}
                  </h3>
                  {Number(actividad.monto_cuota) > 0 && (
                    <p className="text-sm text-zinc-500">
                      Cuota adicional:{" "}
                      {Number(actividad.monto_cuota).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </p>
                  )}
                </div>
                <span className="text-sm text-zinc-500">
                  {inscriptos.length} inscriptos
                </span>
              </div>

              <form action={inscribirSocio} className="mt-4 flex flex-wrap items-end gap-3">
                <input type="hidden" name="actividad_id" value={actividad.id} />
                <div className="flex flex-1 min-w-[220px] flex-col gap-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Inscribir socio
                  </label>
                  <select
                    name="socio_id"
                    required
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  >
                    {(socios ?? []).map((socio) => (
                      <option key={socio.id} value={socio.id}>
                        {socio.apellido}, {socio.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  Inscribir
                </button>
              </form>

              {inscriptos.length > 0 && (
                <ul className="mt-4 flex flex-col gap-1 text-sm">
                  {inscriptos.map((inscripcion) => (
                    <li
                      key={inscripcion.id}
                      className="flex items-center justify-between border-t border-zinc-100 py-2 dark:border-zinc-900"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300">
                        {inscripcion.socio
                          ? `${inscripcion.socio.apellido}, ${inscripcion.socio.nombre}`
                          : "—"}
                      </span>
                      <form action={darDeBajaInscripcion.bind(null, inscripcion.id)}>
                        <button className="text-xs text-zinc-500 hover:text-red-600">
                          Quitar
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        {(actividades ?? []).length === 0 && (
          <p className="text-sm text-zinc-500">Todavía no hay actividades cargadas.</p>
        )}
      </div>
    </div>
  );
}
