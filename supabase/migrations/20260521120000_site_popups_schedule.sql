-- 팝업 노출: 즉시(on/off) vs 기간 예약(KST 시각)

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
  DROP COLUMN IF EXISTS start_date,
  DROP COLUMN IF EXISTS end_date;

DROP INDEX IF EXISTS site_popups_active_dates_idx;

CREATE INDEX IF NOT EXISTS site_popups_schedule_idx
  ON public.site_popups (display_mode, is_active, start_at, end_at);
