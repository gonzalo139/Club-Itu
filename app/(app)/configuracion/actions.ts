"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function actualizarMontoCategoria(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const monto = Number(formData.get("monto_cuota") ?? 0);

  const { error } = await supabase
    .from("categorias")
    .update({ monto_cuota: monto })
    .eq("id", id);

  if (error) {
    redirect(`/configuracion?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/configuracion");
  redirect("/configuracion");
}

export async function crearCategoria(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("categorias").insert({
    nombre: String(formData.get("nombre") ?? ""),
    monto_cuota: Number(formData.get("monto_cuota") ?? 0),
    activa: true,
  });

  if (error) {
    redirect(`/configuracion?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/configuracion");
  redirect("/configuracion");
}

export async function eliminarCategoria(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");

  const { count: sociosConEstaCategoria } = await supabase
    .from("socios")
    .select("*", { count: "exact", head: true })
    .eq("categoria_id", id);

  if ((sociosConEstaCategoria ?? 0) > 0) {
    redirect(
      `/configuracion?error=${encodeURIComponent(
        `No se puede eliminar: hay ${sociosConEstaCategoria} socio(s) con esta categoría. Reasigná esos socios a otra categoría primero.`
      )}`
    );
  }

  const { error } = await supabase.from("categorias").delete().eq("id", id);

  if (error) {
    redirect(`/configuracion?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/configuracion");
  redirect("/configuracion");
}

export async function actualizarMontoActividad(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const monto = Number(formData.get("monto_cuota") ?? 0);

  const { error } = await supabase
    .from("actividades")
    .update({ monto_cuota: monto })
    .eq("id", id);

  if (error) {
    redirect(`/configuracion?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/configuracion");
  redirect("/configuracion");
}
