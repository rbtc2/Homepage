'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { assertActionOk } from '@/lib/assert-action-ok';
import { updateHistoryEnglish } from './actions';

export default function HistoryEnglishForm({ event }) {
  const router = useRouter();
  const [title, setTitle] = useState(
    String(event.titleEn ?? '').trim() ? event.titleEn : event.title
  );
  const [detail, setDetail] = useState(
    String(event.detailEn ?? '').trim() ? event.detailEn : event.detail
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      assertActionOk(await updateHistoryEnglish(event.id, { title, detail }));
      router.push('/admin/settings/history');
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="an" style={{ maxWidth: '40rem' }}>
      <p className="adm-main__sub" style={{ marginBottom: '1.25rem' }}>
        연도·월은 한국어 항목과 같습니다. 내용과 부가 설명만 영어로 작성하세요.
        처음이면 한국어를 복사해 두었습니다.
      </p>

      <div className="an-field-row" style={{ marginBottom: '1rem' }}>
        <div className="an-field">
          <span className="an-field__label">연도</span>
          <p className="an-field__input" style={{ margin: 0, background: 'var(--canvas)' }}>
            {event.year}
          </p>
        </div>
        <div className="an-field">
          <span className="an-field__label">월</span>
          <p className="an-field__input" style={{ margin: 0, background: 'var(--canvas)' }}>
            {event.month}월
          </p>
        </div>
      </div>

      <div className="an-field" style={{ marginBottom: '1rem' }}>
        <label className="an-field__label" htmlFor="history-title-en">
          English title <span className="an-field__req" aria-hidden="true">*</span>
        </label>
        <input
          id="history-title-en"
          type="text"
          className="an-field__input"
          placeholder="e.g. Inaugural general meeting"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
        />
      </div>

      <div className="an-field" style={{ marginBottom: '1.25rem' }}>
        <label className="an-field__label" htmlFor="history-detail-en">
          English note
        </label>
        <textarea
          id="history-detail-en"
          className="an-field__textarea"
          placeholder="Optional one-line description"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          maxLength={1000}
          rows={3}
        />
      </div>

      <div className="an-modal__ft" style={{ padding: 0, border: 0, justifyContent: 'flex-start', gap: '0.5rem' }}>
        <Link href="/admin/settings/history" className="an-btn an-btn--secondary">
          목록으로
        </Link>
        <button type="submit" className="an-btn an-btn--primary" disabled={saving}>
          {saving ? '저장 중…' : '영문 저장'}
        </button>
      </div>
    </form>
  );
}
