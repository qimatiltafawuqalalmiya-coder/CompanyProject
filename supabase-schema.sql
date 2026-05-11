create table if not exists drivers (
  id text primary key,
  name text not null,
  iqamaid text,
  phone text,
  nationality text,
  dept text,
  iqama date,
  workpermit date,
  license date,
  insurance date,
  drivercard date,
  ajeer date,
  passport date,
  medical date,
  visa date
);

create table if not exists vehicles (
  id text primary key,
  plate text not null,
  make text,
  year text,
  color text,
  driver text,
  type text,
  insurance date,
  ishtamara date,
  tafweed date,
  mulkiya date,
  maintenance date,
  gps text
);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on drivers to anon, authenticated;
grant select, insert, update, delete on vehicles to anon, authenticated;
