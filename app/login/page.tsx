import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-b from-club-navy-800 to-club-navy-900 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-surface p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-club-sky-400 text-base font-bold text-club-navy-900">
            SDI
          </span>
          <h1 className="mt-4 text-lg font-semibold text-foreground">
            C.S.D. Ituzaingó de Temperley
          </h1>
          <p className="mt-1 text-sm text-club-sky-600">
            Sistema de gestión de socios
          </p>
        </div>

        <form action={login} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="usuario" className="text-sm font-medium text-foreground">
              Usuario
            </label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              required
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-club-sky-400 focus:outline-none focus:ring-2 focus:ring-club-sky-200"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:border-club-sky-400 focus:outline-none focus:ring-2 focus:ring-club-sky-200"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-md bg-club-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-club-sky-600"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
