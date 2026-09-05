"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MetodoPago } from "@/types/database";

export async function registrarPago(formData: FormData) {
  const supabase = await createClient();

  const cuotaId = String(formData.get("cuota_id") ?? "");
  const metodo = (String(formData.get("metodo") ?? "efectivo")) as MetodoPago;
  const observaciones = String(formData.get("observaciones") ?? "") || null;

  const { data: cuota, error: errorCuota } = await supabase
    .from("cuotas")
    .select("id, socio_id, monto")
    .eq("id", cuotaId)
    .single();

  if (errorCuota || !cuota) {
    redirect(`/pagos?error=${encodeURIComponent("Cuota no encontrada")}`);
  }

  const { error } = await supabase.from("pagos").insert({
    cuota_id: cuota.id,
    socio_id: cuota.socio_id,
    monto: cuota.monto,
    metodo,
    fecha_pago: new Date().toISOString().slice(0, 10),
    observaciones,
  });

  if (error) {
    redirect(`/pagos?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/pagos");
  revalidatePath("/cuotas");
  revalidatePath("/");
  redirect("/pagos");
}
