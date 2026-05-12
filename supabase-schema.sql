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

create table if not exists employees (
  id text primary key,
  name text not null,
  mobile text,
  dateofbirth date,
  iqama text,
  company text,
  occupation text,
  contractstart date,
  contractend date,
  iqamaexpiry date,
  insurance date,
  ajeer date,
  passport date
);

alter table employees add column if not exists dateofbirth date;
alter table employees add column if not exists company text;
alter table employees add column if not exists contractstart date;
alter table employees add column if not exists contractend date;
alter table employees add column if not exists ajeer date;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on drivers to anon, authenticated;
grant select, insert, update, delete on vehicles to anon, authenticated;
grant select, insert, update, delete on employees to anon, authenticated;
