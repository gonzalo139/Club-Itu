-- Core schema: categorías de socio, socios, cuotas y pagos.
-- Diseñado para un club de barrio: simple, sin sobre-ingeniería.

create extension if not exists "pgcrypto";

-- Categorías de socio (ej: Activo, Cadete, Vitalicio, Jubilado)
create table categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  monto_cuota numeric(10, 2) not null default 0,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

-- Socios
create table socios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  dni text unique,
  email text,
  telefono text,
  categoria_id uuid not null references categorias(id) on delete restrict,
  fecha_ingreso date not null default current_date,
  estado text not null default 'activo' check (estado in ('activo', 'inactivo', 'suspendido')),
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_socios_categoria on socios(categoria_id);
create index idx_socios_estado on socios(estado);

-- Cuotas: una fila por socio por período (mes/año), generada automáticamente
create table cuotas (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null references socios(id) on delete cascade,
  periodo date not null, -- se normaliza siempre al día 1 del mes, ej: 2026-09-01
  monto numeric(10, 2) not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'pagada', 'vencida', 'anulada')),
  fecha_vencimiento date not null,
  created_at timestamptz not null default now(),
  unique (socio_id, periodo)
);

create index idx_cuotas_socio on cuotas(socio_id);
create index idx_cuotas_periodo on cuotas(periodo);
create index idx_cuotas_estado on cuotas(estado);

-- Pagos: registran el cobro de una cuota (o un pago general no atado a una cuota puntual)
create table pagos (
  id uuid primary key default gen_random_uuid(),
  cuota_id uuid references cuotas(id) on delete set null,
  socio_id uuid not null references socios(id) on delete cascade,
  monto numeric(10, 2) not null,
  metodo text not null default 'efectivo' check (metodo in ('efectivo', 'transferencia', 'otro')),
  fecha_pago date not null default current_date,
  observaciones text,
  created_at timestamptz not null default now()
);

create index idx_pagos_socio on pagos(socio_id);
create index idx_pagos_cuota on pagos(cuota_id);

-- Trigger simple para mantener updated_at en socios
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_socios_updated_at
before update on socios
for each row execute function set_updated_at();

-- Al registrar un pago, marcar la cuota asociada como pagada
create or replace function marcar_cuota_pagada()
returns trigger as $$
begin
  if new.cuota_id is not null then
    update cuotas set estado = 'pagada' where id = new.cuota_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_pagos_marcar_cuota
after insert on pagos
for each row execute function marcar_cuota_pagada();

-- Categorías iniciales de ejemplo (ajustar según el club)
insert into categorias (nombre, monto_cuota) values
  ('Activo', 5000),
  ('Cadete', 2500),
  ('Vitalicio', 0);
