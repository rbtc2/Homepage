'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, useTransition } from 'react';
import { updateSiteFooterSettings } from './actions';

const TAB_SITE = 'site';
const TAB_DONATION = 'donation';

export default function SiteSettingsForm({ initial }) {
  const router = useRouter();
  const tabsId = useId();
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState(TAB_SITE);

  const [officeAddress, setOfficeAddress] = useState(initial.officeAddress);
  const [representativeName, setRepresentativeName] = useState(initial.representativeName);
  const [mainPhone, setMainPhone] = useState(initial.mainPhone);
  const [faxNumber, setFaxNumber] = useState(initial.faxNumber);
  const [signupApplicationUrl, setSignupApplicationUrl] = useState(
    initial.signupApplicationUrl ?? ''
  );

  const [message, setMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        await updateSiteFooterSettings({
          officeAddress,
          representativeName,
          mainPhone,
          faxNumber,
          signupApplicationUrl,
        });
        setMessage({
          type: 'ok',
          text: '저장했습니다. 사이트 푸터·회원가입 페이지에 반영됩니다.',
        });
        router.refresh();
      } catch (err) {
        setMessage({
          type: 'err',
          text: err?.message ?? '저장에 실패했습니다. 잠시 후 다시 시도해 주세요.',
        });
      }
    });
  };

  return (
    <form className="adm-settings__card adm-settings__card--page" onSubmit={handleSubmit} noValidate>
      <div className="adm-settings__card-bd">
        <div className="adm-site-tabs">
          <div
            role="tablist"
            aria-label="사이트 설정 구분"
            className="adm-site-tabs__list"
            id={`${tabsId}-list`}
          >
            <button
              type="button"
              role="tab"
              id={`${tabsId}-tab-${TAB_SITE}`}
              aria-controls={`${tabsId}-panel-${TAB_SITE}`}
              aria-selected={activeTab === TAB_SITE}
              tabIndex={activeTab === TAB_SITE ? 0 : -1}
              className={`adm-site-tabs__tab${activeTab === TAB_SITE ? ' adm-site-tabs__tab--active' : ''}`}
              onClick={() => setActiveTab(TAB_SITE)}
            >
              사이트 기본 정보
            </button>
            <button
              type="button"
              role="tab"
              id={`${tabsId}-tab-${TAB_DONATION}`}
              aria-controls={`${tabsId}-panel-${TAB_DONATION}`}
              aria-selected={activeTab === TAB_DONATION}
              tabIndex={activeTab === TAB_DONATION ? 0 : -1}
              className={`adm-site-tabs__tab${activeTab === TAB_DONATION ? ' adm-site-tabs__tab--active' : ''}`}
              onClick={() => setActiveTab(TAB_DONATION)}
            >
              단체 후원
            </button>
          </div>

          <div
            id={`${tabsId}-panel-${TAB_SITE}`}
            role="tabpanel"
            aria-labelledby={`${tabsId}-tab-${TAB_SITE}`}
            hidden={activeTab !== TAB_SITE}
            className="adm-site-tabs__panel"
          >
            <p className="adm-settings__card-desc adm-settings__card-desc--top">
              방문자에게 보이는 사이트 하단(푸터)에 그대로 표시됩니다.
            </p>

            <div className="an-field">
              <label className="an-field__label" htmlFor="adm-site-office">
                사무실 주소
              </label>
              <textarea
                id="adm-site-office"
                className="an-field__textarea"
                rows={2}
                value={officeAddress}
                onChange={(ev) => setOfficeAddress(ev.target.value)}
                placeholder="도로명·건물명·호수까지 입력"
                autoComplete="street-address"
              />
            </div>

            <div className="an-field">
              <label className="an-field__label" htmlFor="adm-site-rep">
                대표자
              </label>
              <input
                id="adm-site-rep"
                className="an-field__input"
                type="text"
                value={representativeName}
                onChange={(ev) => setRepresentativeName(ev.target.value)}
                placeholder="성명"
                autoComplete="name"
              />
            </div>

            <div className="an-field">
              <label className="an-field__label" htmlFor="adm-site-phone">
                대표번호
              </label>
              <input
                id="adm-site-phone"
                className="an-field__input"
                type="text"
                inputMode="tel"
                value={mainPhone}
                onChange={(ev) => setMainPhone(ev.target.value)}
                placeholder="예: 02-0000-0000"
                autoComplete="tel"
              />
            </div>

            <div className="an-field">
              <label className="an-field__label" htmlFor="adm-site-fax">
                팩스 번호
              </label>
              <input
                id="adm-site-fax"
                className="an-field__input"
                type="text"
                inputMode="tel"
                value={faxNumber}
                onChange={(ev) => setFaxNumber(ev.target.value)}
                placeholder="예: 0504-000-0000"
              />
            </div>
          </div>

          <div
            id={`${tabsId}-panel-${TAB_DONATION}`}
            role="tabpanel"
            aria-labelledby={`${tabsId}-tab-${TAB_DONATION}`}
            hidden={activeTab !== TAB_DONATION}
            className="adm-site-tabs__panel"
          >
            <p className="adm-settings__card-desc adm-settings__card-desc--top">
              헤더 「단체 후원」 메뉴의 「회원가입」 페이지(/member)에 있는 「회원가입 신청 링크」가 이동할 주소입니다. 구글폼 등 외부 신청 페이지 URL을 입력하세요.
            </p>

            <div className="an-field">
              <label className="an-field__label" htmlFor="adm-site-signup-url">
                회원가입 신청 링크 URL
              </label>
              <input
                id="adm-site-signup-url"
                className="an-field__input"
                type="url"
                value={signupApplicationUrl}
                onChange={(ev) => setSignupApplicationUrl(ev.target.value)}
                placeholder="https://…"
                autoComplete="url"
                spellCheck={false}
              />
              <p className="adm-settings__field-hint">
                반드시 http:// 또는 https:// 로 시작하는 전체 주소를 입력합니다. 칸을 비우고 저장하면 예시 주소(https://example.com)가 들어갑니다.
              </p>
            </div>
          </div>
        </div>

        {message ? (
          <p
            className={
              message.type === 'ok'
                ? 'adm-settings__feedback adm-settings__feedback--ok'
                : 'adm-settings__feedback adm-settings__feedback--err'
            }
            role="status"
          >
            {message.text}
          </p>
        ) : null}

        <div className="adm-settings__actions">
          <button type="submit" className="an-btn an-btn--primary" disabled={pending}>
            {pending ? '저장 중…' : '저장'}
          </button>
          <span className="adm-settings__action-hint">두 탭의 값이 한 번에 저장됩니다.</span>
        </div>
      </div>
    </form>
  );
}
