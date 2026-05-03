-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Contacts table
create table if not exists public.contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text not null,
  birthday_day integer not null check (birthday_day between 1 and 31),
  birthday_month integer not null check (birthday_month between 1 and 12),
  birthday_year integer check (birthday_year > 1900 and birthday_year < 2100),
  relationship text not null,
  interests text not null default '',
  budget_range text not null default '£20-£50',
  notes text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- User settings table
create table if not exists public.user_settings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text,
  phone text,
  reminder_days integer[] default '{30,14,7}' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS policies
alter table public.contacts enable row level security;
alter table public.user_settings enable row level security;

-- Contacts policies
create policy "Users can view their own contacts"
  on public.contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own contacts"
  on public.contacts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own contacts"
  on public.contacts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own contacts"
  on public.contacts for delete
  using (auth.uid() = user_id);

-- Settings policies
create policy "Users can view their own settings"
  on public.user_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.user_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.user_settings for update
  using (auth.uid() = user_id);

-- Service role bypass (for cron jobs)
create policy "Service role can read all contacts"
  on public.contacts for select
  using (auth.role() = 'service_role');

create policy "Service role can read all settings"
  on public.user_settings for select
  using (auth.role() = 'service_role');

-- Updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger contacts_updated_at
  before update on public.contacts
  for each row execute function public.handle_updated_at();

create trigger user_settings_updated_at
  before update on public.user_settings
  for each row execute function public.handle_updated_at();
