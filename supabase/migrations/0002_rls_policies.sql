-- Habilita Row Level Security y define quién puede acceder a qué.
-- Este es un sistema de administración interno (comisión directiva),
-- no una app pública: solo usuarios autenticados pueden leer/escribir.

alter table categorias enable row level security;
alter table socios enable row level security;
alter table cuotas enable row level security;
alter table pagos enable row level security;

create policy "Autenticados pueden leer categorias"
  on categorias for select
  to authenticated
  using (true);

create policy "Autenticados pueden escribir categorias"
  on categorias for all
  to authenticated
  using (true)
  with check (true);

create policy "Autenticados pueden leer socios"
  on socios for select
  to authenticated
  using (true);

create policy "Autenticados pueden escribir socios"
  on socios for all
  to authenticated
  using (true)
  with check (true);

create policy "Autenticados pueden leer cuotas"
  on cuotas for select
  to authenticated
  using (true);

create policy "Autenticados pueden escribir cuotas"
  on cuotas for all
  to authenticated
  using (true)
  with check (true);

create policy "Autenticados pueden leer pagos"
  on pagos for select
  to authenticated
  using (true);

create policy "Autenticados pueden escribir pagos"
  on pagos for all
  to authenticated
  using (true)
  with check (true);
