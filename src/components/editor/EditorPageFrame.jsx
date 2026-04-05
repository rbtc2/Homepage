'use client';

import EditorActionBar from './EditorActionBar';

/**
 * 에디터 공통 레이아웃: `.ep` + 액션 바 + `main.ep__main` + `div.ep__paper` + 하단 슬롯(컨텍스트 메뉴 등)
 *
 * @param {object} props
 * @param {string} props.backHref
 * @param {string} props.pageTitle
 * @param {boolean} props.saving
 * @param {() => void} props.onSave
 * @param {string} props.primaryLabel
 * @param {string} [props.paperClassName] - `ep__paper`에 추가할 클래스 (예: `press-ep`)
 * @param {import('react').ReactNode} props.children - 페이퍼 안쪽 본문
 * @param {import('react').ReactNode} [props.footer] - `.ep` 최하단 (컨텍스트 메뉴 오버레이 등)
 */
export default function EditorPageFrame({
  backHref,
  pageTitle,
  saving,
  onSave,
  primaryLabel,
  paperClassName,
  children,
  footer,
}) {
  const paperClass = paperClassName ? `ep__paper ${paperClassName}` : 'ep__paper';

  return (
    <div className="ep">
      <EditorActionBar
        backHref={backHref}
        pageTitle={pageTitle}
        saving={saving}
        onSave={onSave}
        primaryLabel={primaryLabel}
      />
      <main className="ep__main">
        <div className={paperClass}>{children}</div>
      </main>
      {footer}
    </div>
  );
}
