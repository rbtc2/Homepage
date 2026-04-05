export const metadata = { title: '관리자 계정 | 사이트 설정 | 관리자' };

export default function AdminSettingsAccountPage() {
  return (
    <>
      <header className="adm-main__hd">
        <h1 className="adm-main__title">관리자 계정</h1>
        <p className="adm-main__sub">
          로그인 비밀번호 변경 등. 해시 저장·세션 정책은 백엔드 설계 후 연동합니다.
        </p>
      </header>

      <div className="adm-settings__card adm-settings__card--page">
        <div className="adm-settings__card-bd">
          <div className="an-field">
            <label className="an-field__label" htmlFor="adm-set-cur-pw">
              현재 비밀번호
            </label>
            <input
              id="adm-set-cur-pw"
              className="an-field__input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              readOnly
              aria-readonly="true"
            />
          </div>
          <div className="an-field">
            <label className="an-field__label" htmlFor="adm-set-new-pw">
              새 비밀번호
            </label>
            <input
              id="adm-set-new-pw"
              className="an-field__input"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상 권장"
              readOnly
              aria-readonly="true"
            />
          </div>
          <div className="an-field">
            <label className="an-field__label" htmlFor="adm-set-new-pw2">
              새 비밀번호 확인
            </label>
            <input
              id="adm-set-new-pw2"
              className="an-field__input"
              type="password"
              autoComplete="new-password"
              placeholder="한 번 더 입력"
              readOnly
              aria-readonly="true"
            />
          </div>
          <div className="adm-settings__actions">
            <button type="button" className="an-btn an-btn--primary" disabled>
              비밀번호 변경
            </button>
            <span className="adm-settings__action-hint">DB 해시 로그인 연동 예정</span>
          </div>
        </div>
      </div>
    </>
  );
}
