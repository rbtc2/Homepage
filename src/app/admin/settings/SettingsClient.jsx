'use client';

/**
 * 사이트 설정 UI (스켈레톤).
 * 필드·버튼은 시각용이며 저장/API는 추후 연결합니다.
 */
export default function SettingsClient() {
  return (
    <main className="adm-main">
      <div className="adm-main__inner adm-settings">
        <header className="adm-main__hd">
          <h1 className="adm-main__title">사이트 설정</h1>
          <p className="adm-main__sub">
            홈페이지에 노출되는 정보와 관리자 계정을 정리해 둔 화면입니다. 아래 항목은 UI만
            준비되어 있으며 저장은 추후 연결됩니다.
          </p>
        </header>

        <p className="adm-settings__notice" role="status">
          현재 화면은 레이아웃·폼 구조만 제공합니다. 변경 사항은 서버에 반영되지 않습니다.
        </p>

        <div className="adm-settings__grid">
          <section
            className="adm-settings__card"
            aria-labelledby="adm-settings-site-title"
          >
            <div className="adm-settings__card-hd">
              <h2 id="adm-settings-site-title" className="adm-settings__card-title">
                사이트 기본 정보
              </h2>
              <p className="adm-settings__card-desc">
                조직명, 대표 연락처 등 공통 메타 정보(푸터·문의 안내 등)에 쓰일 수 있는 항목입니다.
              </p>
            </div>
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
          </section>

          <section
            className="adm-settings__card"
            aria-labelledby="adm-settings-home-title"
          >
            <div className="adm-settings__card-hd">
              <h2 id="adm-settings-home-title" className="adm-settings__card-title">
                홈페이지 노출
              </h2>
              <p className="adm-settings__card-desc">
                메인 영역 카피, 상단 공지 띠 문구 등 방문자가 처음 보는 영역과 관련된 설정입니다.
              </p>
            </div>
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
          </section>

          <section
            className="adm-settings__card"
            aria-labelledby="adm-settings-security-title"
          >
            <div className="adm-settings__card-hd">
              <h2 id="adm-settings-security-title" className="adm-settings__card-title">
                관리자 계정
              </h2>
              <p className="adm-settings__card-desc">
                로그인 비밀번호 변경 등. 해시 저장·세션 정책은 백엔드 설계 후 연동합니다.
              </p>
            </div>
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
          </section>
        </div>
      </div>
    </main>
  );
}
