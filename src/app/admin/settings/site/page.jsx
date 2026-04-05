export const metadata = { title: '사이트 기본 정보 | 사이트 설정 | 관리자' };

export default function AdminSettingsSitePage() {
  return (
    <>
      <header className="adm-main__hd">
        <h1 className="adm-main__title">사이트 기본 정보</h1>
        <p className="adm-main__sub">
          조직명, 대표 연락처 등 공통 메타 정보(푸터·문의 안내 등)에 쓰일 수 있는 항목입니다.
        </p>
      </header>

      <div className="adm-settings__card adm-settings__card--page">
        <div className="adm-settings__card-bd">
          <div className="an-field">
            <label className="an-field__label" htmlFor="adm-set-site-name">
              사이트·조직 표시명
            </label>
            <input
              id="adm-set-site-name"
              className="an-field__input"
              type="text"
              placeholder="예: 국제인권연대 월드라이츠"
              readOnly
              aria-readonly="true"
            />
          </div>
          <div className="an-field">
            <label className="an-field__label" htmlFor="adm-set-contact-email">
              대표 문의 이메일
            </label>
            <input
              id="adm-set-contact-email"
              className="an-field__input"
              type="email"
              placeholder="contact@example.org"
              readOnly
              aria-readonly="true"
            />
          </div>
          <div className="an-field">
            <label className="an-field__label" htmlFor="adm-set-phone">
              대표 전화 (선택)
            </label>
            <input
              id="adm-set-phone"
              className="an-field__input"
              type="text"
              placeholder="02-0000-0000"
              readOnly
              aria-readonly="true"
            />
          </div>
          <div className="adm-settings__actions">
            <button type="button" className="an-btn an-btn--primary" disabled>
              저장
            </button>
            <span className="adm-settings__action-hint">API 연결 예정</span>
          </div>
        </div>
      </div>
    </>
  );
}
