'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateSiteFooterSettings } from './actions';

export default function SiteSettingsForm({ initial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [officeAddress, setOfficeAddress] = useState(initial.officeAddress);
  const [representativeName, setRepresentativeName] = useState(initial.representativeName);
  const [mainPhone, setMainPhone] = useState(initial.mainPhone);
  const [faxNumber, setFaxNumber] = useState(initial.faxNumber);
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
        });
        setMessage({ type: 'ok', text: '저장했습니다. 홈페이지 푸터에 반영됩니다.' });
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
        <p className="adm-settings__card-desc adm-settings__card-desc--top">
          아래 내용은 방문자에게 보이는 사이트 하단(푸터)에 그대로 표시됩니다.
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

        {message ? (
          <p
            className={
              message.type === 'ok' ? 'adm-settings__feedback adm-settings__feedback--ok' : 'adm-settings__feedback adm-settings__feedback--err'
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
        </div>
      </div>
    </form>
  );
}
