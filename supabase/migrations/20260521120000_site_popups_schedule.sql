-- 기존 start_date / end_date 스키마 → display_mode + start_at / end_at (이미 적용된 환경은 no-op)

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'site_popups'
      AND column_name = 'start_date'
  ) THEN
    ALTER TABLE public.site_popups
      ADD COLUMN IF NOT EXISTS display_mode TEXT NOT NULL DEFAULT 'scheduled'
        CHECK (display_mode IN ('immediate', 'scheduled')),
      ADD COLUMN IF NOT EXISTS start_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS end_at TIMESTAMPTZ;

    UPDATE public.site_popups
    SET
      start_at = (start_date::timestamp AT TIME ZONE 'Asia/Seoul'),
      end_at = ((end_date::timestamp + interval '1 day') AT TIME ZONE 'Asia/Seoul') - interval '1 second',
      display_mode = CASE WHEN is_active THEN 'immediate' ELSE 'scheduled' END
    WHERE start_at IS NULL;

    ALTER TABLE public.site_popups
      DROP COLUMN start_date,
      DROP COLUMN end_date;

    DROP INDEX IF EXISTS site_popups_active_dates_idx;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS site_popups_schedule_idx
  ON public.site_popups (display_mode, is_active, start_at, end_at);
