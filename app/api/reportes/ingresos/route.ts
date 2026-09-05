import { createClient } from "@/lib/supabase/server";
import { generarCsv } from "@/lib/csv";

function primerDiaDelMes() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

export async function GET() {
  const supabase = await createClient();

  const { data: pagos } = await supabase
    .from("pagos")
    .select("monto, metodo, fecha_pago, observaciones, socios(nombre, apellido)")
    .gte("fecha_pago", primerDiaDelMes())
    .order("fecha_pago");

  const filas = (pagos ?? []).map((pago) => {
    const socio = pago.socios as unknown as { nombre: string; apellido: string } | null;

    return [
      socio?.apellido ?? "",
      socio?.nombre ?? "",
      Number(pago.monto),
      pago.metodo,
      new Date(pago.fecha_pago).toLocaleDateString("es-AR"),
      pago.observaciones ?? "",
    ];
  });

  const total = (pagos ?? []).reduce((acc, pago) => acc + Number(pago.monto), 0);
  filas.push(["", "", total, "", "", "TOTAL"]);

  const csv = generarCsv(
    ["Apellido", "Nombre", "Monto", "Método", "Fecha", "Observaciones"],
    filas
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ingresos-del-mes.csv"`,
    },
  });
}
