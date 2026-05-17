'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const STORAGE_PREFIX = 'wr-popup-dismiss-';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isDismissedForToday(id) {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}${id}`) === todayKey();
  } catch {
    return false;
  }
}

function dismissForToday(id) {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, todayKey());
  } catch {
    /* ignore */
  }
}

function popupStyle(popup) {
  const style = {
    '--sp-offset-x': `${popup.offsetX ?? 0}px`,
    '--sp-offset-y': `${popup.offsetY ?? 0}px`,
  };
  if (popup.widthPx) style.width = `${popup.widthPx}px`;
  if (popup.heightPx) style.height = `${popup.heightPx}px`;
  return style;
}

function PopupMedia({ popup }) {
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="site-popup__img"
      src={popup.imageUrl}
      alt=""
      width={popup.widthPx || undefined}
      height={popup.heightPx || undefined}
    />
  );

  const link = (popup.linkUrl ?? '').trim();
  if (!link) {
    return <div className="site-popup__media site-popup__media--static">{img}</div>;
  }

  const external = /^https?:\/\//i.test(link);
  if (external) {
    return (
      <a
        className="site-popup__media"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {img}
      </a>
    );
  }

  return (
    <Link className="site-popup__media" href={link}>
      {img}
    </Link>
  );
}

function SitePopupCard({ popup, onClose, onDismissDay }) {
  return (
    <div
      className={`site-popup site-popup--${popup.position}`}
      style={popupStyle(popup)}
      role="dialog"
      aria-modal="false"
      aria-label={popup.title || '공지 팝업'}
    >
      <button
        type="button"
        className="site-popup__close"
        onClick={() => onClose(popup.id)}
        aria-label="팝업 닫기"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <PopupMedia popup={popup} />

      {popup.showCloseForDay ? (
        <button
          type="button"
          className="site-popup__dismiss-day"
          onClick={() => onDismissDay(popup.id)}
        >
          오늘 하루 보지 않기
        </button>
      ) : null}
    </div>
  );
}

export default function SitePopups({ popups }) {
  const pathname = usePathname();
  const [closedIds, setClosedIds] = useState([]);
  const [dismissedIds, setDismissedIds] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hidden = popups.filter((p) => isDismissedForToday(p.id)).map((p) => p.id);
    setDismissedIds(hidden);
    setReady(true);
  }, [popups]);

  const visible = useMemo(() => {
    if (!ready) return [];
    const hidden = new Set([...closedIds, ...dismissedIds]);
    return popups.filter((p) => !hidden.has(p.id));
  }, [popups, closedIds, dismissedIds, ready]);

  const handleClose = useCallback((id) => {
    setClosedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const handleDismissDay = useCallback((id) => {
    dismissForToday(id);
    setDismissedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  if (pathname?.startsWith('/admin')) return null;
  if (!visible.length) return null;

  return (
    <div className="site-popup-layer" aria-hidden={false}>
      <div className="site-popup-layer__backdrop" />
      {visible.map((popup) => (
        <SitePopupCard
          key={popup.id}
          popup={popup}
          onClose={handleClose}
          onDismissDay={handleDismissDay}
        />
      ))}
    </div>
  );
}
