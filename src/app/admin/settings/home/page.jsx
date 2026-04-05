export const metadata = { title: '홈페이지 노출 | 사이트 설정 | 관리자' };

export default function AdminSettingsHomePage() {
  return (
    <>
      <header className="adm-main__hd">
        <h1 className="adm-main__title">홈페이지 노출</h1>
        <p className="adm-main__sub">
          메인 영역 카피, 상단 공지 띠 문구 등 방문자가 처음 보는 영역과 관련된 설정입니다.
        </p>
      </header>

      <div className="adm-settings__card adm-settings__card--page">
        <div className="adm-settings__card-bd">
          <div className="an-field">
            <label className="an-field__label" htmlFor="adm-set-hero-lead">
              메인 헤드라인 (예시)
            </label>
            <input
              id="adm-set-hero-lead"
              className="an-field__input"
              type="text"
              placeholder="한 줄 슬로건"
              readOnly
              aria-readonly="true"
            />
          </div>
          <div className="an-field">
            <label className="an-field__label" htmlFor="adm-set-strip">
              공지 띠 문구 (예시)
            </label>
            <textarea
              id="adm-set-strip"
              className="an-field__textarea"
              rows={3}
              placeholder="짧은 안내 문구"
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
