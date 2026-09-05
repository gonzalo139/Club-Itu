# C.S.D. Ituzaingó de Temperley — Sistema de gestión de socios

CRM simple para la administración de un club de barrio: socios, cuotas y pagos.
Sin servidores propios que mantener: se despliega en Vercel y usa Supabase (Postgres)
como base de datos.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, Tailwind)
- [Supabase](https://supabase.com) (Postgres + Auth)
- [Vercel](https://vercel.com) (hosting, deploy automático desde este repo)

## Setup local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear un proyecto en [supabase.com](https://supabase.com) (tiene free tier).

3. Correr la migración inicial: copiar el contenido de
   `supabase/migrations/0001_core_schema.sql` en el **SQL Editor** de Supabase
   y ejecutarlo. Esto crea las tablas `categorias`, `socios`, `cuotas` y `pagos`,
   junto con triggers básicos (actualizar `updated_at`, marcar una cuota como
   pagada al registrar su pago).

4. Copiar `.env.local.example` a `.env.local` y completar con las credenciales
   del proyecto de Supabase (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

5. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abrir [http://localhost:3000](http://localhost:3000).

## Estructura del proyecto

```
app/
  socios/     Alta, listado y detalle de socios
  cuotas/     Generación y listado de cuotas
  pagos/      Registro de pagos
lib/
  supabase/   Clientes de Supabase (browser y server)
supabase/
  migrations/ Schema SQL versionado
types/
  database.ts Tipos TypeScript del schema
```

## Alcance del MVP (Core)

- **Socios**: alta/baja, categorías, estado (activo/inactivo/suspendido)
- **Cuotas**: generación mensual por categoría, historial por socio
- **Pagos**: registro de pago, detección de cuotas pendientes/vencidas
- **Dashboard**: socios activos, recaudación del mes, morosos

Funcionalidades de nivel 2/3 (comunicación masiva, portal del socio, gestión
de actividades, etc.) se evalúan e implementan en fases posteriores, no forman
parte de este MVP.

## Usuarios sin email real (login por nombre de usuario)

Supabase Auth requiere un email por cuenta, pero no todos los miembros de la
comisión tienen (o quieren dar) un email real. Para esos casos, se crea el
usuario en Supabase con un email inventado bajo el dominio
`clubitu.com.ar`, por ejemplo `mari@clubitu.com.ar`. En el login de la app,
la persona escribe solo `mari` (sin el dominio) y el código arma el email
completo automáticamente.

Para crear uno de estos usuarios:

1. En Supabase → **Authentication → Users → Add user**.
2. Email: `nombredeusuario@clubitu.com.ar` (en minúsculas, sin espacios).
3. Password: la que quieras asignarle.
4. **Importante**: creá el usuario desde acá (el panel de Supabase), nunca
   con un formulario de "registrarme" público — el panel confirma la cuenta
   al instante sin intentar mandar un mail real (que fallaría, porque el
   dominio no existe). Si en algún momento se agrega una opción de
   autorregistro en la app, hay que asegurarse de que también fuerce la
   confirmación automática, o esas cuentas van a quedar sin poder
   loguearse.

Si alguien se olvida la contraseña, como el email no es real no hay
"recuperar contraseña" posible por mail — hay que resetearla manualmente
desde Supabase → Authentication → Users.

## Deploy

Conectar este repositorio en [Vercel](https://vercel.com/new) y configurar las
mismas variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`) en el proyecto de Vercel. Cada push a la rama
principal dispara un deploy automático.
