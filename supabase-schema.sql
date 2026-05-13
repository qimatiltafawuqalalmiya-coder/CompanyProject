create extension if not exists pgcrypto;

create table if not exists drivers (
  id text primary key,
  name text not null,
  iqamaid text,
  phone text,
  nationality text,
  dept text,
  company text,
  registrationno text,
  responsible text,
  drivertype text,
  iqama date,
  workpermit date,
  license date,
  insurance date,
  drivercardno text,
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
  operationcardno text,
  operationcardexpiry date,
  fahas date,
  gps text
);

alter table drivers add column if not exists drivercardno text;
alter table drivers add column if not exists company text;
alter table drivers add column if not exists registrationno text;
alter table drivers add column if not exists responsible text;
alter table drivers add column if not exists drivertype text;

alter table vehicles add column if not exists operationcardno text;
alter table vehicles add column if not exists operationcardexpiry date;
alter table vehicles add column if not exists fahas date;

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

create table if not exists maroor_violations (
  uid uuid primary key default gen_random_uuid(),
  id text,
  violationno text not null,
  plate text,
  driver text,
  violationdate date,
  violationtime time,
  referenceno text,
  city text,
  amount text,
  status text,
  paiddate date,
  notes text
);

create table if not exists efaa_violations (
  uid uuid primary key default gen_random_uuid(),
  id text,
  violationno text not null,
  plate text,
  driver text,
  violationdate date,
  violationtime time,
  referenceno text,
  city text,
  amount text,
  status text,
  paiddate date,
  notes text
);

alter table maroor_violations add column if not exists uid uuid default gen_random_uuid();
alter table maroor_violations alter column uid set default gen_random_uuid();
update maroor_violations set uid = gen_random_uuid() where uid is null;
alter table maroor_violations alter column uid set not null;
alter table maroor_violations add column if not exists violationtime time;
alter table maroor_violations add column if not exists referenceno text;
alter table maroor_violations add column if not exists city text;
alter table maroor_violations add column if not exists paiddate date;

alter table efaa_violations add column if not exists uid uuid default gen_random_uuid();
alter table efaa_violations alter column uid set default gen_random_uuid();
update efaa_violations set uid = gen_random_uuid() where uid is null;
alter table efaa_violations alter column uid set not null;
alter table efaa_violations add column if not exists violationtime time;
alter table efaa_violations add column if not exists referenceno text;
alter table efaa_violations add column if not exists city text;
alter table efaa_violations add column if not exists paiddate date;

alter table maroor_violations drop constraint if exists maroor_violations_pkey;
alter table efaa_violations drop constraint if exists efaa_violations_pkey;

alter table maroor_violations add primary key (uid);
alter table efaa_violations add primary key (uid);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on drivers to anon, authenticated;
grant select, insert, update, delete on vehicles to anon, authenticated;
grant select, insert, update, delete on employees to anon, authenticated;
grant select, insert, update, delete on maroor_violations to anon, authenticated;
grant select, insert, update, delete on efaa_violations to anon, authenticated;
