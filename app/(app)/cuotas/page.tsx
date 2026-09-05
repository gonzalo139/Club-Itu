import { createClient } from "@/lib/supabase/server";
import { GenerarCuotasButton } from "./generar-button";

const estadoStyles: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  pagada: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  vencida: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  anulada: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
};

export default async function CuotasPage() {
  const supabase = await createClient();

  const { data: cuotas } = await supabase
    .from("cuotas")
    .select("id, periodo, monto, estado, fecha_vencimiento, socios(nombre, apellido)")
    .order("periodo", { ascending: false })
    .limit(200);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-club-navy-800">
          Cuotas
        </h1>
        <GenerarCuotasButton />
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-club-sky-50 text-club-navy-700">
            <tr>
              <th className="px-4 py-3 font-medium">Socio</th>
              <th className="px-4 py-3 font-medium">Período</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Vencimiento</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(cuotas ?? []).map((cuota) => {
              const socio = cuota.socios as unknown as {
                nombre: string;
                apellido: string;
              } | null;
              return (
                <tr key={cuota.id} className="bg-surface">
                  <td className="px-4 py-3 text-club-navy-800">
                    {socio ? `${socio.apellido}, ${socio.nombre}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(cuota.periodo).toLocaleDateString("es-AR", {
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {Number(cuota.monto).toLocaleString("es-AR", {
                      style: "currency",
                      currency: "ARS",
                    })}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {new Date(cuota.fecha_vencimiento).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${estadoStyles[cuota.estado]}`}
                    >
                      {cuota.estado}
                    </span>
                  </td>
                </tr>
              );
            })}

            {(cuotas ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Todavía no se generaron cuotas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
