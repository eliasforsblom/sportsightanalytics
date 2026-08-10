CREATE TABLE IF NOT EXISTS public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  path text NOT NULL,
  referrer text,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  visit_date date NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date
);

GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read page views"
ON public.page_views FOR SELECT TO authenticated
USING ((auth.jwt() ->> 'email') = ANY (ARRAY['forsblomelias@gmail.com','john.ahlstedt.plym@gmail.com']));

CREATE INDEX IF NOT EXISTS page_views_visit_date_idx ON public.page_views (visit_date);
CREATE INDEX IF NOT EXISTS page_views_session_idx ON public.page_views (session_id);
CREATE INDEX IF NOT EXISTS page_views_path_idx ON public.page_views (path);