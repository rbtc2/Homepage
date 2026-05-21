const KST_TZ = 'Asia/Seoul';

const kstFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: KST_TZ,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const kstDisplayFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: KST_TZ,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
});

function partsToMap(parts) {
  return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

/** ISO(UTC) → datetime-local 입력값 (KST `YYYY-MM-DDTHH:mm`) */
export function isoToKstDatetimeLocal(iso) {
  if (!iso) return '';
  const map = partsToMap(kstFormatter.formatToParts(new Date(iso)));
  const hour = map.hour ?? map.hour12 ?? '00';
  const minute = map.minute ?? '00';
  return `${map.year}-${map.month}-${map.day}T${hour}:${minute}`;
}

/** datetime-local 입력값(KST) → ISO(UTC) */
export function kstDatetimeLocalToIso(kstLocal) {
  const trimmed = (kstLocal ?? '').trim();
  if (!trimmed) return null;
  const normalized = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  const ms = new Date(`${normalized}+09:00`).getTime();
  if (Number.isNaN(ms)) throw new Error('올바른 노출 시각을 입력해 주세요.');
  return new Date(ms).toISOString();
}

/** 현재 시각을 KST datetime-local 기본값으로 */
export function defaultKstDatetimeLocal(addMinutes = 0) {
  const ms = Date.now() + addMinutes * 60_000;
  return isoToKstDatetimeLocal(new Date(ms).toISOString());
}

/** KST 시각 표시 (목록·상세) */
export function formatKstDatetime(iso) {
  if (!iso) return '—';
  return kstDisplayFormatter.format(new Date(iso));
}

export function formatPopupPeriod(popup) {
  if (popup.displayMode === 'immediate') {
    return popup.isActive ? '즉시 노출 · 켜짐' : '즉시 노출 · 꺼짐';
  }
  if (!popup.startAt || !popup.endAt) return '기간 예약 (미설정)';
  return `${formatKstDatetime(popup.startAt)} ~ ${formatKstDatetime(popup.endAt)}`;
}

/** @returns {'active'|'inactive'|'scheduled'|'expired'} */
export function getPopupStatus(popup) {
  if (popup.displayMode === 'immediate') {
    return popup.isActive ? 'active' : 'inactive';
  }

  if (!popup.isActive) return 'inactive';

  const now = Date.now();
  const start = new Date(popup.startAt).getTime();
  const end = new Date(popup.endAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end)) return 'inactive';
  if (now < start) return 'scheduled';
  if (now > end) return 'expired';
  return 'active';
}
