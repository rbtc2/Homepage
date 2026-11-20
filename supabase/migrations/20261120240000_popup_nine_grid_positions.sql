-- 팝업 위치를 9그리드(상·중·하 × 좌·중·우)로 확장

ALTER TABLE public.site_popups
  DROP CONSTRAINT IF EXISTS site_popups_position_check;

ALTER TABLE public.site_popups
  ADD CONSTRAINT site_popups_position_check
  CHECK (
    position IN (
      'center',
      'top-left',
      'top-center',
      'top-right',
      'middle-left',
      'middle-right',
      'bottom-left',
      'bottom-center',
      'bottom-right'
    )
  );
