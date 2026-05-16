alter table public.profiles
  add column if not exists dietary_restrictions text[] not null default '{}',
  add column if not exists disliked_ingredients text[] not null default '{}',
  add column if not exists food_goal text not null default 'balanced'
    check (food_goal in ('balanced', 'lighter', 'cutting', 'bulking', 'more_protein', 'maintain_weight')),
  add column if not exists meal_focus text[] not null default '{}',
  add column if not exists cooking_time text not null default 'flexible'
    check (cooking_time in ('quick', 'medium', 'flexible')),
  add column if not exists preference_notes text;
