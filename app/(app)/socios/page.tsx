import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cambiarEstadoSocio } from "./actions";

const estadoStyles: Record<string, string> = {
  activo: "bg-green-100 text-green-800",
  inactivo: "bg-zinc-100 text-zinc-600",
  suspendido: "bg-red-100 text-red-800",
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
        <h1 className="text-2xl font-semibold text-club-navy-800">
          Socios
        </h1>
        <Link
          href="/socios/nuevo"
          className="rounded-md bg-club-sky-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-club-sky-600"
        >
          + Nuevo socio
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-club-sky-50 text-club-navy-700">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">DNI</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(socios ?? []).map((socio) => (
              <tr key={socio.id} className="bg-surface">
                <td className="px-4 py-3 text-club-navy-800">
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
                  <Link
                    href={`/socios/${socio.id}/carnet`}
                    className="mr-3 text-xs text-zinc-500 hover:text-zinc-900"
                  >
                    Carnet
                  </Link>
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
