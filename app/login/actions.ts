"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Los usuarios internos del club (sin email real) se crean en Supabase con
// un email falso bajo este dominio, ej. "mari@clubitu.local". Acá se permite
// que la persona ingrese solo su nombre de usuario ("mari") en vez de tener
// que escribir ese email completo.
const DOMINIO_USUARIOS_INTERNOS = "clubitu.com.ar";

export async function login(formData: FormData) {
  const usuario = String(formData.get("usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const email = usuario.includes("@")
    ? usuario
    : `${usuario.toLowerCase()}@${DOMINIO_USUARIOS_INTERNOS}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
