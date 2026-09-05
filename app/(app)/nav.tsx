import Link from "next/link";
import { logout } from "@/app/login/actions";

const links = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/socios", label: "Socios", icon: "👥" },
  { href: "/cuotas", label: "Cuotas", icon: "🧾" },
  { href: "/pagos", label: "Pagos", icon: "💵" },
  { href: "/actividades", label: "Actividades", icon: "🏅" },
  { href: "/reportes", label: "Reportes", icon: "📁" },
  { href: "/configuracion", label: "Configuración", icon: "⚙️" },
];

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-club-navy-800 text-club-sky-50">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-club-sky-400 text-sm font-bold text-club-navy-900">
          SDI
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-white">C.S.D. Ituzaingó</p>
          <p className="text-xs text-club-sky-200">de Temperley</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-club-sky-100 transition-colors hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>

      <form action={logout} className="border-t border-white/10 px-3 py-4">
        <button
          type="submit"
          className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-club-sky-200 transition-colors hover:bg-white/10 hover:text-white"
        >
          ⏻ Salir
        </button>
      </form>
    </aside>
  );
}
