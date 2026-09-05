import { createClient } from "@/lib/supabase/server";

function primerDiaDelMes() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export default async function ReportesPage() {
  const supabase = await createClient();

  const [{ count: morosos }, { data: pagosDelMes }] = await Promise.all([
    supabase
      .from("cuotas")
      .select("*", { count: "exact", head: true })
      .in("estado", ["pendiente", "vencida"]),
    supabase.from("pagos").select("monto").gte("fecha_pago", primerDiaDelMes()),
  ]);

  const totalIngresos = (pagosDelMes ?? []).reduce(
    (acc, pago) => acc + Number(pago.monto),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Reportes
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Socios morosos
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {morosos ?? 0} cuotas pendientes o vencidas.
          </p>
          <a
            href="/api/reportes/morosos"
            className="mt-4 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Descargar CSV
          </a>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Ingresos del mes
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {totalIngresos.toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}{" "}
            recaudados este mes.
          </p>
          <a
            href="/api/reportes/ingresos"
            className="mt-4 inline-block rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Descargar CSV
          </a>
        </div>
      </div>

      <p className="text-xs text-zinc-500">
        Los archivos CSV se abren directo en Excel o Google Sheets.
      </p>
    </div>
  );
}
