-- Actividades/disciplinas (fútbol, vóley, gimnasia, etc.) e inscripciones de socios.

create table actividades (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  monto_cuota numeric(10, 2) not null default 0,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

create table socio_actividades (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references socios(id) on delete cascade,
  actividad_id uuid not null references actividades(id) on delete cascade,
  fecha_inscripcion date not null default current_date,
  created_at timestamptz not null default now(),
  unique (socio_id, actividad_id)
);

create index idx_socio_actividades_socio on socio_actividades(socio_id);
create index idx_socio_actividades_actividad on socio_actividades(actividad_id);

alter table actividades enable row level security;
alter table socio_actividades enable row level security;

create policy "Autenticados pueden leer actividades"
  on actividades for select
  to authenticated
  using (true);

create policy "Autenticados pueden escribir actividades"
  on actividades for all
  to authenticated
  using (true)
  with check (true);

create policy "Autenticados pueden leer inscripciones"
  on socio_actividades for select
  to authenticated
  using (true);

create policy "Autenticados pueden escribir inscripciones"
  on socio_actividades for all
  to authenticated
  using (true)
  with check (true);

-- Carnet digital: el QR de cada socio apunta a una página pública de
-- verificación. Esa página necesita leer un subconjunto mínimo y no
-- sensible de datos (nombre, apellido, estado, categoría) sin login,
-- para que un portero/controlador de acceso pueda escanear el carnet.
--
-- IMPORTANTE: esto se resuelve con una vista que NO usa security_invoker,
-- por lo que corre con los permisos de quien la creó (bypassea RLS) y
-- expone solo estas columnas. La tabla `socios` en sí NUNCA se abre a
-- `anon`: si lo hiciéramos, cualquiera con la anon key (pública, va en
-- el frontend) podría leer DNI, email y teléfono de todos los socios
-- consultando la tabla directamente desde la consola del navegador.

create view verificacion_socios as
  select
    s.id,
    s.nombre,
    s.apellido,
    s.estado,
    c.nombre as categoria
  from socios s
  join categorias c on c.id = s.categoria_id;

grant select on verificacion_socios to anon;
