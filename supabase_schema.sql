-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  partner_email text,
  streak integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;

-- Policies for Profiles
create policy "Users can view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on profiles
  for insert with check (auth.uid() = id);

-- MEMORIES TABLE
create table memories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text not null, -- 'peak', 'crisis_repair', etc.
  content text,
  media_url text,
  media_type text, -- 'video', 'audio', 'text'
  prompt_text text,
  template text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table memories enable row level security;

-- Policies for Memories
create policy "Users can view their own memories" on memories
  for select using (auth.uid() = user_id);

create policy "Users can insert their own memories" on memories
  for insert with check (auth.uid() = user_id);

-- PULSE ENTRIES TABLE
create table pulse_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  entry text not null,
  prompt_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table pulse_entries enable row level security;

-- Policies for Pulse Entries
create policy "Users can view their own pulse entries" on pulse_entries
  for select using (auth.uid() = user_id);

create policy "Users can insert their own pulse entries" on pulse_entries
  for insert with check (auth.uid() = user_id);

-- STORAGE BUCKET SETUP
-- Note: You'll need to create a bucket named 'memories' in the Storage dashboard.
-- This policy allows authenticated users to upload files to their own folder.
-- (This is a simplified policy; for production, you might want stricter folder checks)

-- Policy to allow authenticated uploads to 'memories' bucket
-- create policy "Allow authenticated uploads"
-- on storage.objects for insert
-- with check ( bucket_id = 'memories' and auth.role() = 'authenticated' );

-- Policy to allow viewing own files
-- create policy "Allow viewing own files"
-- on storage.objects for select
-- using ( bucket_id = 'memories' and auth.uid() = owner );
