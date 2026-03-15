create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;

create table if not exists public.quiz_submissions (
  id uuid primary key default extensions.gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  result_run_token_hash text,
  submission_version text not null,
  answered_count smallint not null check (answered_count between 10 and 20),
  priority_count smallint not null check (priority_count between 0 and 20),
  selected_party_id text not null,
  top_party_id text not null,
  top_party_score smallint not null check (top_party_score between 0 and 100),
  economic_x smallint not null check (economic_x between -100 and 100),
  openness_y smallint not null check (openness_y between -100 and 100),
  axis_coverage smallint not null check (axis_coverage between 0 and 100),
  future_completed_count smallint not null default 0 check (future_completed_count between 0 and 5),
  match_scores jsonb not null
);

create table if not exists public.quiz_submission_answers (
  submission_id uuid not null references public.quiz_submissions(id) on delete cascade,
  question_id text not null,
  stance smallint not null check (stance between -2 and 2),
  is_priority boolean not null default false,
  primary key (submission_id, question_id)
);

create table if not exists public.quiz_future_answers (
  submission_id uuid not null references public.quiz_submissions(id) on delete cascade,
  question_id text not null,
  stance smallint not null check (stance between -2 and 2),
  scenario_id text not null,
  primary key (submission_id, question_id)
);

create table if not exists public.quiz_result_views (
  run_token_hash text primary key,
  created_at timestamptz not null default timezone('utc', now()),
  ip_hash text not null,
  user_agent_hash text
);

create table if not exists private.quiz_submission_rate_limits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default timezone('utc', now()),
  ip_hash text not null,
  user_agent_hash text
);

create table if not exists private.quiz_result_view_rate_limits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default timezone('utc', now()),
  ip_hash text not null
);

create index if not exists quiz_submissions_created_at_idx
  on public.quiz_submissions (created_at desc);

create unique index if not exists quiz_submissions_result_run_token_hash_idx
  on public.quiz_submissions (result_run_token_hash)
  where result_run_token_hash is not null;

create index if not exists quiz_submissions_top_party_idx
  on public.quiz_submissions (top_party_id);

create index if not exists quiz_submission_answers_question_idx
  on public.quiz_submission_answers (question_id, stance);

create index if not exists quiz_future_answers_question_idx
  on public.quiz_future_answers (question_id, scenario_id);

create index if not exists quiz_result_views_created_at_idx
  on public.quiz_result_views (created_at desc);

create index if not exists quiz_submission_rate_limits_ip_created_at_idx
  on private.quiz_submission_rate_limits (ip_hash, created_at desc);

create index if not exists quiz_result_view_rate_limits_ip_created_at_idx
  on private.quiz_result_view_rate_limits (ip_hash, created_at desc);

alter table public.quiz_submissions enable row level security;
alter table public.quiz_submission_answers enable row level security;
alter table public.quiz_future_answers enable row level security;
alter table public.quiz_result_views enable row level security;

revoke all on public.quiz_submissions from anon, authenticated;
revoke all on public.quiz_submission_answers from anon, authenticated;
revoke all on public.quiz_future_answers from anon, authenticated;
revoke all on public.quiz_result_views from anon, authenticated;
revoke all on private.quiz_submission_rate_limits from public, anon, authenticated;
revoke all on private.quiz_result_view_rate_limits from public, anon, authenticated;

create policy "No direct access to quiz_submissions"
  on public.quiz_submissions
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct access to quiz_submission_answers"
  on public.quiz_submission_answers
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct access to quiz_future_answers"
  on public.quiz_future_answers
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "No direct access to quiz_result_views"
  on public.quiz_result_views
  as restrictive
  for all
  to anon, authenticated
  using (false)
  with check (false);

create or replace function public.save_quiz_submission(
  submission jsonb,
  answers jsonb,
  future_answers jsonb,
  result_run_token_hash text,
  request_ip_hash text,
  request_user_agent_hash text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  new_submission_id uuid := extensions.gen_random_uuid();
  existing_submission_id uuid;
  attempts_in_last_day integer;
begin
  if request_ip_hash is null or char_length(request_ip_hash) < 32 then
    raise exception using errcode = 'P0001', message = 'invalid_request_fingerprint';
  end if;

  if result_run_token_hash is null or char_length(result_run_token_hash) < 32 then
    raise exception using errcode = 'P0001', message = 'invalid_result_run_token';
  end if;

  select id
  into existing_submission_id
  from public.quiz_submissions
  where public.quiz_submissions.result_run_token_hash = save_quiz_submission.result_run_token_hash
  limit 1;

  if existing_submission_id is not null then
    raise exception using errcode = 'P0001', message = 'duplicate_run_save';
  end if;

  insert into public.quiz_result_views (run_token_hash, ip_hash, user_agent_hash)
  values (result_run_token_hash, request_ip_hash, request_user_agent_hash)
  on conflict (run_token_hash) do nothing;

  select count(*)
  into attempts_in_last_day
  from private.quiz_submission_rate_limits
  where ip_hash = request_ip_hash
    and created_at >= now() - interval '24 hours';

  if attempts_in_last_day >= 5 then
    raise exception using errcode = 'P0001', message = 'rate_limit_exceeded';
  end if;

  insert into private.quiz_submission_rate_limits (ip_hash, user_agent_hash)
  values (request_ip_hash, request_user_agent_hash);

  insert into public.quiz_submissions (
    id,
    result_run_token_hash,
    submission_version,
    answered_count,
    priority_count,
    selected_party_id,
    top_party_id,
    top_party_score,
    economic_x,
    openness_y,
    axis_coverage,
    future_completed_count,
    match_scores
  )
  values (
    new_submission_id,
    result_run_token_hash,
    submission ->> 'version',
    (submission ->> 'answeredCount')::smallint,
    (submission ->> 'priorityCount')::smallint,
    submission ->> 'selectedPartyId',
    submission ->> 'topPartyId',
    (submission ->> 'topPartyScore')::smallint,
    (submission -> 'userMapPosition' ->> 'x')::smallint,
    (submission -> 'userMapPosition' ->> 'y')::smallint,
    (submission -> 'userMapPosition' ->> 'coverage')::smallint,
    coalesce(jsonb_array_length(future_answers), 0)::smallint,
    submission -> 'matchScores'
  );

  insert into public.quiz_submission_answers (
    submission_id,
    question_id,
    stance,
    is_priority
  )
  select
    new_submission_id,
    answer ->> 'questionId',
    (answer ->> 'stance')::smallint,
    coalesce((answer ->> 'isPriority')::boolean, false)
  from jsonb_array_elements(answers) as answer;

  insert into public.quiz_future_answers (
    submission_id,
    question_id,
    stance,
    scenario_id
  )
  select
    new_submission_id,
    answer ->> 'questionId',
    (answer ->> 'stance')::smallint,
    answer ->> 'scenarioId'
  from jsonb_array_elements(future_answers) as answer;

  return jsonb_build_object('submissionId', new_submission_id);
end;
$$;

create or replace function public.register_quiz_result_view(
  result_run_token_hash text,
  request_ip_hash text,
  request_user_agent_hash text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, private
as $$
declare
  attempts_in_last_day integer;
begin
  if request_ip_hash is null or char_length(request_ip_hash) < 32 then
    raise exception using errcode = 'P0001', message = 'invalid_request_fingerprint';
  end if;

  if result_run_token_hash is null or char_length(result_run_token_hash) < 32 then
    raise exception using errcode = 'P0001', message = 'invalid_result_run_token';
  end if;

  if exists (
    select 1
    from public.quiz_result_views
    where run_token_hash = result_run_token_hash
  ) then
    return jsonb_build_object('tracked', false);
  end if;

  select count(*)
  into attempts_in_last_day
  from private.quiz_result_view_rate_limits
  where ip_hash = request_ip_hash
    and created_at >= now() - interval '24 hours';

  if attempts_in_last_day >= 50 then
    raise exception using errcode = 'P0001', message = 'view_rate_limit_exceeded';
  end if;

  insert into private.quiz_result_view_rate_limits (ip_hash)
  values (request_ip_hash);

  insert into public.quiz_result_views (run_token_hash, ip_hash, user_agent_hash)
  values (result_run_token_hash, request_ip_hash, request_user_agent_hash)
  on conflict (run_token_hash) do nothing;

  return jsonb_build_object('tracked', true);
end;
$$;

create or replace function public.get_quiz_public_summary()
returns jsonb
language sql
security definer
set search_path = public
as $$
with submission_totals as (
  select
    count(*)::int as total_submissions,
    round(avg(top_party_score)::numeric, 1) as average_top_score,
    round(avg(answered_count)::numeric, 1) as average_answered_count,
    round(avg(economic_x)::numeric, 1) as average_economic_x,
    round(avg(openness_y)::numeric, 1) as average_openness_y
  from public.quiz_submissions
),
view_totals as (
  select
    count(*)::int as total_result_views
  from public.quiz_result_views
),
party_counts as (
  select
    top_party_id as party_id,
    count(*)::int as count
  from public.quiz_submissions
  group by top_party_id
),
party_distribution as (
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'partyId', party_id,
        'count', count,
        'share',
          case
            when totals.total_submissions = 0 then 0
            else round((count::numeric / totals.total_submissions::numeric) * 100, 1)
          end
      )
      order by count desc, party_id asc
    ),
    '[]'::jsonb
  ) as items
  from party_counts
  cross join submission_totals as totals
),
future_grouped as (
  select
    question_id,
    scenario_id,
    count(*)::int as count
  from public.quiz_future_answers
  group by question_id, scenario_id
),
future_with_totals as (
  select
    question_id,
    scenario_id,
    count,
    sum(count) over (partition by question_id)::int as total
  from future_grouped
),
future_question_scenarios as (
  select
    question_id,
    total,
    jsonb_agg(
      jsonb_build_object(
        'scenarioId', scenario_id,
        'count', count,
        'share',
          case
            when total = 0 then 0
            else round((count::numeric / total::numeric) * 100, 1)
          end
      )
      order by count desc, scenario_id asc
    ) as scenarios
  from future_with_totals
  group by question_id, total
),
future_question_distribution as (
  select
    question_id,
    total,
    scenarios
  from future_question_scenarios
),
future_distribution as (
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'questionId', question_id,
        'total', total,
        'scenarios', scenarios
      )
      order by question_id asc
    ),
    '[]'::jsonb
  ) as items
  from future_question_distribution
)
select jsonb_build_object(
  'generatedAt', to_char(timezone('utc', now()), 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  'totalResultViews', views.total_result_views,
  'savedResultsCount', totals.total_submissions,
  'saveRate',
    case
      when views.total_result_views = 0 then null
      else round((totals.total_submissions::numeric / views.total_result_views::numeric) * 100, 1)
    end,
  'totalSubmissions', totals.total_submissions,
  'averageTopScore', totals.average_top_score,
  'averageAnsweredCount', totals.average_answered_count,
  'averageEconomicX', totals.average_economic_x,
  'averageOpennessY', totals.average_openness_y,
  'topPartyDistribution', party_distribution.items,
  'futureScenarioDistribution', future_distribution.items
)
from submission_totals as totals
cross join view_totals as views
cross join party_distribution
cross join future_distribution;
$$;

revoke all on function public.save_quiz_submission(jsonb, jsonb, jsonb, text, text, text)
  from public, anon, authenticated;
revoke all on function public.register_quiz_result_view(text, text, text)
  from public, anon, authenticated;
revoke all on function public.get_quiz_public_summary()
  from public, anon, authenticated;

grant execute on function public.save_quiz_submission(jsonb, jsonb, jsonb, text, text, text)
  to service_role;
grant execute on function public.register_quiz_result_view(text, text, text)
  to service_role;
grant execute on function public.get_quiz_public_summary()
  to service_role;
