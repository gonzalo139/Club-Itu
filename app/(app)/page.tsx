import { createClient } from "@/lib/supabase/server";

function startOfMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const periodo = startOfMonth();

  const [{ count: sociosActivos }, { data: pagosDelMes }, { count: cuotasMorosas }] =
    await Promise.all([
      supabase
        .from("socios")
        .select("*", { count: "exact", head: true })
        .eq("estado", "activo"),
      supabase
        .from("pagos")
        .select("monto")
        .gte("fecha_pago", periodo),
      supabase
        .from("cuotas")
        .select("*", { count: "exact", head: true })
        .in("estado", ["pendiente", "vencida"])
        .lt("periodo", periodo),
    ]);

  const recaudacionDelMes = (pagosDelMes ?? []).reduce(
    (acc, pago) => acc + Number(pago.monto),
    0
  );

  const stats = [
    { label: "Socios activos", value: sociosActivos ?? 0 },
    {
      label: "Recaudado este mes",
      value: recaudacionDelMes.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
    },
    { label: "Cuotas atrasadas", value: cuotasMorosas ?? 0 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-club-navy-800">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-club-navy-800">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
