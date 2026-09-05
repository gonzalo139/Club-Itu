"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { EstadoSocio } from "@/types/database";

export async function crearSocio(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("socios").insert({
    nombre: String(formData.get("nombre") ?? ""),
    apellido: String(formData.get("apellido") ?? ""),
    dni: String(formData.get("dni") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    telefono: String(formData.get("telefono") ?? "") || null,
    categoria_id: String(formData.get("categoria_id") ?? ""),
    estado: "activo",
    fecha_ingreso: new Date().toISOString().slice(0, 10),
    notas: null,
  });

  if (error) {
    redirect(`/socios/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/socios");
  redirect("/socios");
}

export async function cambiarEstadoSocio(socioId: string, estado: EstadoSocio) {
  const supabase = await createClient();
  await supabase.from("socios").update({ estado }).eq("id", socioId);
  revalidatePath("/socios");
}
