
create type public.app_role as enum ('admin', 'contributor', 'user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text, avatar_url text, email text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;
grant execute on function public.has_role(uuid, public.app_role) to anon, authenticated, service_role;

create policy "Anyone can view roles" on public.user_roles for select using (true);
create policy "Only admins can insert roles" on public.user_roles for insert with check (public.has_role(auth.uid(), 'admin'));
create policy "Only admins can delete roles" on public.user_roles for delete using (public.has_role(auth.uid(), 'admin'));

create table public.contributor_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pen_name text not null, reason text not null, sample_link text,
  status text not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id)
);
alter table public.contributor_applications enable row level security;
create policy "Users can view own application" on public.contributor_applications for select using (auth.uid() = user_id);
create policy "Admins can view all applications" on public.contributor_applications for select using (public.has_role(auth.uid(), 'admin'));
create policy "Users can insert own application" on public.contributor_applications for insert with check (auth.uid() = user_id);
create policy "Users can update own pending application" on public.contributor_applications for update using (auth.uid() = user_id and status = 'pending');
create policy "Admins can update any application" on public.contributor_applications for update using (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare _is_first boolean;
begin
  insert into public.profiles (id, display_name, avatar_url, email) values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  select not exists (select 1 from public.user_roles where role = 'admin') into _is_first;
  if _is_first then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
    insert into public.user_roles (user_id, role) values (new.id, 'contributor');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.handle_application_approved() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved' and (old.status is distinct from 'approved') then
    insert into public.user_roles (user_id, role) values (new.user_id, 'contributor') on conflict do nothing;
    new.reviewed_at := now();
  end if;
  if new.status = 'rejected' and (old.status is distinct from 'rejected') then new.reviewed_at := now(); end if;
  return new;
end; $$;

create trigger on_application_status_change before update on public.contributor_applications for each row execute function public.handle_application_approved();

create or replace function public.update_updated_at_column() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create table public.comics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null default '',
  description text not null default '',
  cover_id text not null default '',
  genres text[] not null default '{}',
  featured boolean not null default false,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_comics_featured on public.comics (featured) where featured = true;

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  comic_id uuid not null references public.comics(id) on delete cascade,
  title text not null,
  pages text[] not null default '{}',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);
create index on public.chapters(comic_id, order_index);

alter table public.comics enable row level security;
alter table public.chapters enable row level security;

create policy "Comics viewable by everyone" on public.comics for select using (true);
create policy "Contributors can create comics" on public.comics for insert with check (auth.uid() = created_by and (public.has_role(auth.uid(),'contributor') or public.has_role(auth.uid(),'admin')));
create policy "Owner or admin can update comics" on public.comics for update using (auth.uid() = created_by or public.has_role(auth.uid(),'admin'));
create policy "Owner or admin can delete comics" on public.comics for delete using (auth.uid() = created_by or public.has_role(auth.uid(),'admin'));

create policy "Chapters viewable by everyone" on public.chapters for select using (true);
create policy "Owner or admin can insert chapters" on public.chapters for insert with check (exists (select 1 from public.comics c where c.id = comic_id and (c.created_by = auth.uid() or public.has_role(auth.uid(),'admin'))));
create policy "Owner or admin can update chapters" on public.chapters for update using (exists (select 1 from public.comics c where c.id = comic_id and (c.created_by = auth.uid() or public.has_role(auth.uid(),'admin'))));
create policy "Owner or admin can delete chapters" on public.chapters for delete using (exists (select 1 from public.comics c where c.id = comic_id and (c.created_by = auth.uid() or public.has_role(auth.uid(),'admin'))));

create trigger comics_updated_at before update on public.comics for each row execute function public.update_updated_at_column();

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  comic_id uuid not null,
  chapter_id uuid,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_comments_comic on public.comments(comic_id, created_at desc);
create index idx_comments_chapter on public.comments(chapter_id, created_at desc);
create index idx_comments_user on public.comments(user_id);
alter table public.comments enable row level security;
create policy "Comments viewable by everyone" on public.comments for select using (true);
create policy "Auth users can insert own comment" on public.comments for insert with check (auth.uid() = user_id);
create policy "Owner or admin can update comment" on public.comments for update using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'::app_role));
create policy "Owner or admin can delete comment" on public.comments for delete using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'::app_role));
create trigger update_comments_updated_at before update on public.comments for each row execute function public.update_updated_at_column();

create or replace function public.validate_comment() returns trigger language plpgsql set search_path = public as $$
begin
  if length(btrim(new.content)) < 1 then raise exception 'Bình luận không được trống'; end if;
  if length(new.content) > 2000 then raise exception 'Bình luận tối đa 2000 ký tự'; end if;
  return new;
end; $$;
create trigger validate_comment_trg before insert or update on public.comments for each row execute function public.validate_comment();

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  comic_id uuid not null,
  score smallint not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, comic_id)
);
create index idx_ratings_comic on public.ratings(comic_id);
alter table public.ratings enable row level security;
create policy "Ratings viewable by everyone" on public.ratings for select using (true);
create policy "Auth users can insert own rating" on public.ratings for insert with check (auth.uid() = user_id);
create policy "Owner can update own rating" on public.ratings for update using (auth.uid() = user_id);
create policy "Owner or admin can delete rating" on public.ratings for delete using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'::app_role));
create trigger update_ratings_updated_at before update on public.ratings for each row execute function public.update_updated_at_column();

create or replace function public.validate_rating() returns trigger language plpgsql set search_path = public as $$
begin
  if new.score < 1 or new.score > 5 then raise exception 'Điểm đánh giá phải từ 1 đến 5'; end if;
  return new;
end; $$;
create trigger validate_rating_trg before insert or update on public.ratings for each row execute function public.validate_rating();

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.handle_application_approved() from public, anon, authenticated;
revoke execute on function public.validate_rating() from public, anon, authenticated;
revoke execute on function public.validate_comment() from public, anon, authenticated;
revoke execute on function public.update_updated_at_column() from public, anon, authenticated;

alter table public.comments replica identity full;
do $$
begin
  begin alter publication supabase_realtime add table public.comments; exception when duplicate_object then null; end;
end $$;
