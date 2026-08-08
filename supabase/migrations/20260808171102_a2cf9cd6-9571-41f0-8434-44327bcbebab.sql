-- 1. Analytics policy scoped to authenticated
DROP POLICY IF EXISTS "Allow admins to manage analytics" ON public.analytics;
CREATE POLICY "Allow admins to manage analytics"
ON public.analytics
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'email') = ANY (ARRAY['forsblomelias@gmail.com','john.ahlstedt.plym@gmail.com']))
WITH CHECK ((auth.jwt() ->> 'email') = ANY (ARRAY['forsblomelias@gmail.com','john.ahlstedt.plym@gmail.com']));

-- 2. Restrict post-videos uploads to admins
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;
CREATE POLICY "Admins can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'post-videos'
  AND (auth.jwt() ->> 'email') = ANY (ARRAY['forsblomelias@gmail.com','john.ahlstedt.plym@gmail.com'])
);

CREATE POLICY "Admins can update videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'post-videos'
  AND (auth.jwt() ->> 'email') = ANY (ARRAY['forsblomelias@gmail.com','john.ahlstedt.plym@gmail.com'])
)
WITH CHECK (
  bucket_id = 'post-videos'
  AND (auth.jwt() ->> 'email') = ANY (ARRAY['forsblomelias@gmail.com','john.ahlstedt.plym@gmail.com'])
);

CREATE POLICY "Admins can delete videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'post-videos'
  AND (auth.jwt() ->> 'email') = ANY (ARRAY['forsblomelias@gmail.com','john.ahlstedt.plym@gmail.com'])
);

-- 3. Fix mutable search_path on security definer function
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.posts
  SET views = COALESCE(views, 0) + 1
  WHERE id = post_id AND draft IS FALSE;
END;
$function$;