import { createClient } from "@/lib/supabase/server";

export default async function VerificarSocioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: socio } = await supabase
    .from("verificacion_socios")
    .select("nombre, apellido, estado, categoria")
    .eq("id", id)
    .single();

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Club Itu
        </p>

        {socio ? (
          <>
            <p className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {socio.apellido}, {socio.nombre}
            </p>
            <p className="mt-1 text-sm text-zinc-500">{socio.categoria}</p>
            <span
              className={`mt-4 inline-block rounded-full px-3 py-1 text-sm font-medium ${
                socio.estado === "activo"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              Socio {socio.estado}
            </span>
          </>
        ) : (
          <p className="mt-4 text-sm text-red-600">
            No se encontró ningún socio con este carnet.
          </p>
        )}
      </div>
    </div>
  );
}
