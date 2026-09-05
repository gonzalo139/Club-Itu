import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cambiarEstadoSocio } from "./actions";

const estadoStyles: Record<string, string> = {
  activo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inactivo: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  suspendido: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default async function SociosPage() {
  const supabase = await createClient();

  const { data: socios } = await supabase
    .from("socios")
    .select("id, nombre, apellido, dni, estado, categorias(nombre)")
    .order("apellido");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Socios
        </h1>
        <Link
          href="/socios/nuevo"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
        >
          + Nuevo socio
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">DNI</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {(socios ?? []).map((socio) => (
              <tr key={socio.id} className="bg-white dark:bg-zinc-950">
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-50">
                  {socio.apellido}, {socio.nombre}
                </td>
                <td className="px-4 py-3 text-zinc-500">{socio.dni ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {(socio.categorias as unknown as { nombre: string } | null)?.nombre ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${estadoStyles[socio.estado]}`}
                  >
                    {socio.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {socio.estado === "activo" ? (
                    <form
                      action={cambiarEstadoSocio.bind(null, socio.id, "inactivo")}
                    >
                      <button className="text-xs text-zinc-500 hover:text-red-600">
                        Dar de baja
                      </button>
                    </form>
                  ) : (
                    <form
                      action={cambiarEstadoSocio.bind(null, socio.id, "activo")}
                    >
                      <button className="text-xs text-zinc-500 hover:text-green-600">
                        Reactivar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}

            {(socios ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                  Todavía no hay socios cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
