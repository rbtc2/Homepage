-- Supabase Data API: public 스키마 테이블에 명시적 GRANT 보강
-- (2026-10-30 이후 신규 테이블·마이그레이션 재구성 시 PostgREST 접근에 필요)
-- wr_news, site_popups, admin_drafts는 각자 마이그레이션에 GRANT가 이미 있음

-- 공개 읽기(anon/authenticated SELECT) + 서버 쓰기(service_role)
GRANT SELECT ON TABLE public.notices TO anon, authenticated;
GRANT ALL ON TABLE public.notices TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.notices_id_seq TO service_role;

GRANT SELECT ON TABLE public.disclosures TO anon, authenticated;
GRANT ALL ON TABLE public.disclosures TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.disclosures_id_seq TO service_role;

GRANT SELECT ON TABLE public.gallery TO anon, authenticated;
GRANT ALL ON TABLE public.gallery TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.gallery_id_seq TO service_role;

GRANT SELECT ON TABLE public.archive TO anon, authenticated;
GRANT ALL ON TABLE public.archive TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.archive_id_seq TO service_role;

GRANT SELECT ON TABLE public.press_coverage TO anon, authenticated;
GRANT ALL ON TABLE public.press_coverage TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.press_coverage_id_seq TO service_role;

-- site_settings: 단일 행(smallint PK), 시퀀스 없음
GRANT SELECT ON TABLE public.site_settings TO anon, authenticated;
GRANT ALL ON TABLE public.site_settings TO service_role;
