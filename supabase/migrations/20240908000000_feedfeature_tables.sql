-- Create feedback_items table to store user feedback
create table
  public.feedback_items (
    id uuid not null default gen_random_uuid(),
    content text not null,
    type text not null, -- 'feature_request', 'bug_report', 'plan_suggestion'
    votes integer not null default 0,
    status text not null default 'new', -- 'new', 'planned', 'in_progress', 'completed', 'declined'
    product_id text not null,
    created_by uuid not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint feedback_items_pkey primary key (id)
  ) tablespace pg_default;

-- Create testimonials table to store user testimonials
create table
  public.testimonials (
    id uuid not null default gen_random_uuid(),
    content text not null,
    rating integer not null, -- 1-5 stars
    feedback_item_id uuid null, -- Can be linked to a feedback item
    product_id text not null,
    created_by uuid not null,
    approved boolean not null default false,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint testimonials_pkey primary key (id),
    constraint testimonials_feedback_item_id_fkey foreign key (feedback_item_id) references feedback_items (id) on delete set null
  ) tablespace pg_default;

-- Create badges table to store founder badges
create table
  public.badges (
    id uuid not null default gen_random_uuid(),
    name text not null,
    description text not null,
    icon text not null,
    product_id text not null,
    criteria jsonb not null, -- Criteria for earning the badge
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint badges_pkey primary key (id)
  ) tablespace pg_default;

-- Create leaderboard_entries table to store product rankings
create table
  public.leaderboard_entries (
    id uuid not null default gen_random_uuid(),
    product_id text not null,
    product_name text not null,
    score integer not null default 0, -- Computed from feedback, testimonials, etc.
    feedback_count integer not null default 0,
    testimonial_count integer not null default 0,
    badge_count integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint leaderboard_entries_pkey primary key (id)
  ) tablespace pg_default;

-- Create products table to store product information
create table
  public.products (
    id uuid not null default gen_random_uuid(),
    name text not null,
    description text not null,
    slug text not null unique,
    website_url text not null,
    logo_url text null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint products_pkey primary key (id)
  ) tablespace pg_default;

-- Grant access to authenticated users to read the feedback_items table
create policy "Enable read access for all users to feedback_items" on "public"."feedback_items" as PERMISSIVE for SELECT to authenticated using ( true );

-- Grant access to authenticated users to create feedback_items
create policy "Enable insert access for authenticated users to feedback_items" on "public"."feedback_items" as PERMISSIVE for INSERT to authenticated with check ( auth.uid() = created_by );

-- Grant access to authenticated users to read the testimonials table
create policy "Enable read access for all users to testimonials" on "public"."testimonials" as PERMISSIVE for SELECT to authenticated using ( approved = true );

-- Grant access to authenticated users to create testimonials
create policy "Enable insert access for authenticated users to testimonials" on "public"."testimonials" as PERMISSIVE for INSERT to authenticated with check ( auth.uid() = created_by );

-- Grant access to authenticated users to read the badges table
create policy "Enable read access for all users to badges" on "public"."badges" as PERMISSIVE for SELECT to authenticated using ( true );

-- Grant access to authenticated users to read the leaderboard_entries table
create policy "Enable read access for all users to leaderboard_entries" on "public"."leaderboard_entries" as PERMISSIVE for SELECT to authenticated using ( true );

-- Grant access to authenticated users to read the products table
create policy "Enable read access for all users to products" on "public"."products" as PERMISSIVE for SELECT to authenticated using ( true );

-- Grant access to authenticated users to create products
create policy "Enable insert access for authenticated users to products" on "public"."products" as PERMISSIVE for INSERT to authenticated with check ( auth.uid() = owner_id );
