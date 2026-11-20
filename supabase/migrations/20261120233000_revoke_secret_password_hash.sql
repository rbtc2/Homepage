-- anon/authenticated 에게 비밀글 해시 컬럼 노출 차단.
-- GRANT SELECT ON TABLE 이후에도 컬럼 단위 REVOKE 를 다시 적용한다.
-- 공개 쿼리는 secret_password_hash 를 select 목록에서 제외해야 한다 (앱 코드 동기화).

REVOKE SELECT (secret_password_hash) ON public.archive FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.notices FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.disclosures FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.gallery FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.wr_news FROM anon, authenticated;
REVOKE SELECT (secret_password_hash) ON public.press_coverage FROM anon, authenticated;
