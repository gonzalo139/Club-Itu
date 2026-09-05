import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

async function obtenerBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "https";
  return `${protocol}://${host}`;
}

export default async function CarnetSocioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: socio } = await supabase
    .from("socios")
    .select("id, nombre, apellido, dni, estado, categorias(nombre)")
    .eq("id", id)
    .single();

  if (!socio) {
    notFound();
  }

  const baseUrl = await obtenerBaseUrl();
  const urlVerificacion = `${baseUrl}/verificar/${socio.id}`;
  const qrDataUrl = await QRCode.toDataURL(urlVerificacion, { margin: 1, width: 220 });

  const categoria = (socio.categorias as unknown as { nombre: string } | null)?.nombre;

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Carnet digital
      </h1>

      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          Club Itu
        </p>
        <p className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {socio.apellido}, {socio.nombre}
        </p>
        <p className="text-sm text-zinc-500">{categoria ?? "—"}</p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={`Código QR de verificación de ${socio.nombre} ${socio.apellido}`}
          width={220}
          height={220}
        />

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            socio.estado === "activo"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {socio.estado}
        </span>
      </div>

      <p className="max-w-sm text-center text-xs text-zinc-500">
        Escaneando este código, cualquier persona (sin necesidad de iniciar
        sesión) puede verificar la identidad y el estado del socio, sin ver
        datos sensibles como el DNI o el contacto.
      </p>
    </div>
  );
}
