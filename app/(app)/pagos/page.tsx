import { createClient } from "@/lib/supabase/server";
import { registrarPago } from "./actions";

export default async function PagosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: cuotasPendientes }, { data: pagos }] = await Promise.all([
    supabase
      .from("cuotas")
      .select("id, periodo, monto, socios(nombre, apellido)")
      .in("estado", ["pendiente", "vencida"])
      .order("periodo"),
    supabase
      .from("pagos")
      .select("id, monto, metodo, fecha_pago, socios(nombre, apellido)")
      .order("fecha_pago", { ascending: false })
      .limit(50),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-club-navy-800">
        Pagos
      </h1>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="text-lg font-medium text-club-navy-800">
          Registrar pago
        </h2>

        <form action={registrarPago} className="mt-4 flex flex-wrap items-end gap-4">
          <div className="flex flex-1 min-w-[220px] flex-col gap-1">
            <label htmlFor="cuota_id" className="text-sm font-medium text-zinc-700">
              Cuota
            </label>
            <select
              id="cuota_id"
              name="cuota_id"
              required
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              {(cuotasPendientes ?? []).map((cuota) => {
                const socio = cuota.socios as unknown as {
                  nombre: string;
                  apellido: string;
                } | null;
                return (
                  <option key={cuota.id} value={cuota.id}>
                    {socio ? `${socio.apellido}, ${socio.nombre}` : "—"} —{" "}
                    {new Date(cuota.periodo).toLocaleDateString("es-AR", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    (
                    {Number(cuota.monto).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                    )
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="metodo" className="text-sm font-medium text-zinc-700">
              Método
            </label>
            <select
              id="metodo"
              name="metodo"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              <option value="efectivo">Efectivo</option>
              <option value="transferencia">Transferencia</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="flex flex-1 min-w-[200px] flex-col gap-1">
            <label htmlFor="observaciones" className="text-sm font-medium text-zinc-700">
              Observaciones
            </label>
            <input
              id="observaciones"
              name="observaciones"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-club-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-club-sky-600"
          >
            Registrar
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {(cuotasPendientes ?? []).length === 0 && (
          <p className="mt-3 text-sm text-zinc-500">
            No hay cuotas pendientes de pago.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-lg font-medium text-club-navy-800">
          Últimos pagos
        </h2>

        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-club-sky-50 text-club-navy-700">
              <tr>
                <th className="px-4 py-3 font-medium">Socio</th>
                <th className="px-4 py-3 font-medium">Monto</th>
                <th className="px-4 py-3 font-medium">Método</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(pagos ?? []).map((pago) => {
                const socio = pago.socios as unknown as {
                  nombre: string;
                  apellido: string;
                } | null;
                return (
                  <tr key={pago.id} className="bg-surface">
                    <td className="px-4 py-3 text-club-navy-800">
                      {socio ? `${socio.apellido}, ${socio.nombre}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">
                      {Number(pago.monto).toLocaleString("es-AR", {
                        style: "currency",
                        currency: "ARS",
                      })}
                    </td>
                    <td className="px-4 py-3 text-zinc-500">{pago.metodo}</td>
                    <td className="px-4 py-3 text-zinc-500">
                      {new Date(pago.fecha_pago).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                );
              })}

              {(pagos ?? []).length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                    Todavía no se registraron pagos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
