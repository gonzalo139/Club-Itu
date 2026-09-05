// Carga socios de prueba en Supabase para probar el CRM con datos realistas.
//
// Uso:
//   SEED_EMAIL=tu@email.com SEED_PASSWORD=tu-contraseña SEED_CANTIDAD=30 \
//     node scripts/seed-socios.mjs
//
// Requiere las variables NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY
// en .env.local (ya deberían estar si seguiste el setup del README).
// Se loguea con un usuario real (SEED_EMAIL/SEED_PASSWORD) porque las tablas
// tienen RLS: solo usuarios autenticados pueden insertar.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function cargarEnvLocal() {
  try {
    const contenido = readFileSync(new URL("../.env.local", import.meta.url), "utf-8");
    for (const linea of contenido.split("\n")) {
      const match = linea.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  } catch {
    // Si no existe .env.local, se espera que las variables ya estén en el entorno.
  }
}

cargarEnvLocal();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SEED_EMAIL = process.env.SEED_EMAIL;
const SEED_PASSWORD = process.env.SEED_PASSWORD;
const CANTIDAD = Number(process.env.SEED_CANTIDAD ?? 30);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY (revisá .env.local)");
  process.exit(1);
}

if (!SEED_EMAIL || !SEED_PASSWORD) {
  console.error("Faltan SEED_EMAIL y SEED_PASSWORD. Ejemplo:");
  console.error("  SEED_EMAIL=tu@email.com SEED_PASSWORD=tu-contraseña node scripts/seed-socios.mjs");
  process.exit(1);
}

const NOMBRES = [
  "Juan", "María", "Carlos", "Ana", "Pedro", "Laura", "Miguel", "Sofía",
  "Diego", "Valentina", "Martín", "Camila", "Franco", "Julieta", "Nicolás",
  "Florencia", "Lucas", "Agustina", "Matías", "Rocío", "Facundo", "Micaela",
  "Ezequiel", "Antonella", "Gonzalo", "Paula", "Federico", "Carla", "Emiliano",
  "Daniela",
];

const APELLIDOS = [
  "González", "Rodríguez", "Gómez", "Fernández", "López", "Díaz", "Martínez",
  "Pérez", "García", "Sánchez", "Romero", "Sosa", "Torres", "Álvarez",
  "Ruiz", "Ramírez", "Flores", "Acosta", "Benítez", "Medina", "Herrera",
  "Aguirre", "Vega", "Molina", "Silva", "Ortiz", "Núñez", "Rojas", "Castro",
  "Ibáñez",
];

function elegirAlAzar(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

function generarDni() {
  return String(Math.floor(20000000 + Math.random() * 25000000));
}

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
  });

  if (authError) {
    console.error("No se pudo iniciar sesión:", authError.message);
    process.exit(1);
  }

  const { data: categorias, error: errorCategorias } = await supabase
    .from("categorias")
    .select("id, nombre");

  if (errorCategorias || !categorias || categorias.length === 0) {
    console.error("No hay categorías cargadas. Corré primero la migración 0001_core_schema.sql.");
    process.exit(1);
  }

  const dnisUsados = new Set();
  const socios = Array.from({ length: CANTIDAD }, () => {
    const nombre = elegirAlAzar(NOMBRES);
    const apellido = elegirAlAzar(APELLIDOS);
    let dni = generarDni();
    while (dnisUsados.has(dni)) dni = generarDni();
    dnisUsados.add(dni);

    const categoria = elegirAlAzar(categorias);
    const estado = Math.random() < 0.85 ? "activo" : "inactivo";

    return {
      nombre,
      apellido,
      dni,
      email: `${normalizar(nombre)}.${normalizar(apellido)}${dni.slice(-3)}@example.com`,
      telefono: `11${Math.floor(10000000 + Math.random() * 89999999)}`,
      categoria_id: categoria.id,
      estado,
      fecha_ingreso: new Date(
        2015 + Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 12),
        1 + Math.floor(Math.random() * 28)
      )
        .toISOString()
        .slice(0, 10),
      notas: null,
    };
  });

  const { data: insertados, error: errorInsert } = await supabase
    .from("socios")
    .insert(socios)
    .select("id");

  if (errorInsert) {
    console.error("Error insertando socios:", errorInsert.message);
    process.exit(1);
  }

  console.log(`Listo: se cargaron ${insertados.length} socios de prueba.`);
}

main();
