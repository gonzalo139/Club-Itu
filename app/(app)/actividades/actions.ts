"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function crearActividad(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("actividades").insert({
    nombre: String(formData.get("nombre") ?? ""),
    monto_cuota: Number(formData.get("monto_cuota") ?? 0),
    activa: true,
  });

  if (error) {
    redirect(`/actividades?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/actividades");
  redirect("/actividades");
}

export async function inscribirSocio(formData: FormData) {
  const supabase = await createClient();

  const socioId = String(formData.get("socio_id") ?? "");
  const actividadId = String(formData.get("actividad_id") ?? "");

  const { error } = await supabase.from("socio_actividades").insert({
    socio_id: socioId,
    actividad_id: actividadId,
    fecha_inscripcion: new Date().toISOString().slice(0, 10),
  });

  if (error) {
    redirect(`/actividades?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/actividades");
  redirect("/actividades");
}

export async function darDeBajaInscripcion(inscripcionId: string) {
  const supabase = await createClient();
  await supabase.from("socio_actividades").delete().eq("id", inscripcionId);
  revalidatePath("/actividades");
}
