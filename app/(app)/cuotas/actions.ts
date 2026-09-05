"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function primerDiaDelMes(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
}

function fechaVencimiento(date = new Date()) {
  // Vence el día 10 del mes correspondiente.
  return new Date(date.getFullYear(), date.getMonth(), 10).toISOString().slice(0, 10);
}

export async function generarCuotasDelMes() {
  const supabase = await createClient();
  const periodo = primerDiaDelMes();

  const { data: socios, error: errorSocios } = await supabase
    .from("socios")
    .select("id, categoria_id, categorias(monto_cuota)")
    .eq("estado", "activo");

  if (errorSocios || !socios) {
    return { error: errorSocios?.message ?? "No se pudieron obtener los socios" };
  }

  const cuotasAInsertar = socios.map((socio) => ({
    socio_id: socio.id,
    periodo,
    monto: Number(
      (socio.categorias as unknown as { monto_cuota: number } | null)?.monto_cuota ?? 0
    ),
    estado: "pendiente" as const,
    fecha_vencimiento: fechaVencimiento(),
  }));

  const { error } = await supabase
    .from("cuotas")
    .upsert(cuotasAInsertar, { onConflict: "socio_id,periodo", ignoreDuplicates: true });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cuotas");
  return { error: null };
}
