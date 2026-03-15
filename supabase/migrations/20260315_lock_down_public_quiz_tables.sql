drop policy if exists "No direct access to quiz_submissions"
  on public.quiz_submissions;

drop policy if exists "No direct access to quiz_submission_answers"
  on public.quiz_submission_answers;

drop policy if exists "No direct access to quiz_future_answers"
  on public.quiz_future_answers;

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
