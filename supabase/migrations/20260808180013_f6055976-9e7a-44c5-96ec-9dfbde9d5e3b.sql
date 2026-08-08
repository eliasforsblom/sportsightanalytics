REVOKE ALL ON FUNCTION public.increment_post_views(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.increment_post_views(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.increment_post_views(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.increment_post_views(uuid) TO service_role;