import { createClient } from "@/lib/supabase/server";
import { generarCsv } from "@/lib/csv";

export async function GET() {
  const supabase = await createClient();

  const { data: cuotas } = await supabase
    .from("cuotas")
    .select("periodo, monto, fecha_vencimiento, socios(nombre, apellido, dni)")
    .in("estado", ["pendiente", "vencida"])
    .order("periodo");

  const filas = (cuotas ?? []).map((cuota) => {
    const socio = cuota.socios as unknown as {
      nombre: string;
      apellido: string;
      dni: string | null;
    } | null;

    return [
      socio?.apellido ?? "",
      socio?.nombre ?? "",
      socio?.dni ?? "",
      new Date(cuota.periodo).toLocaleDateString("es-AR", {
        month: "long",
        year: "numeric",
      }),
      Number(cuota.monto),
      new Date(cuota.fecha_vencimiento).toLocaleDateString("es-AR"),
    ];
  });

  const csv = generarCsv(
    ["Apellido", "Nombre", "DNI", "Período", "Monto", "Vencimiento"],
    filas
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="morosos.csv"`,
    },
  });
}
