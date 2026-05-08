'use client';

import { useMemo, useState } from 'react';

const REGIONS = ['전체', '서울', '경기', '부산'];

function scoreLabel(score) {
  if (score >= 85) return '우수';
  if (score >= 70) return '보통';
  return '개선 필요';
}

export default function BarrierFreeKioskExplorer({ initialPoints }) {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedId, setSelectedId] = useState(initialPoints[0]?.id ?? null);

  const points = useMemo(() => {
    if (selectedRegion === '전체') return initialPoints;
    return initialPoints.filter((item) => item.region === selectedRegion);
  }, [initialPoints, selectedRegion]);

  const selectedPoint = useMemo(
    () => points.find((item) => item.id === selectedId) ?? points[0] ?? null,
    [points, selectedId],
  );

  return (
    <section className="bfk" aria-labelledby="bfk-heading">
      <div className="bfk__inner">
        <h2 id="bfk-heading" className="bfk__heading">
          지역 선택형 접근성 데이터 뷰어 (MVP)
        </h2>
        <p className="bfk__summary">
          좌측 지역을 선택하면 우측 시설 목록과 접근성 점수가 함께 갱신됩니다.
        </p>

        <div className="bfk__layout">
          <aside className="bfk__map" aria-label="한국 지도 영역">
            <div className="bfk__map-head">
              <strong>지도 영역</strong>
              <span>차기 단계에서 실제 지도 SDK 연동</span>
            </div>
            <div className="bfk__map-panel">
              <p className="bfk__map-text">대한민국 지역 선택</p>
              <div className="bfk__region-list">
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    className={`bfk__region-btn${selectedRegion === region ? ' is-active' : ''}`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="bfk__side">
            <div className="bfk__meta">
              <p>
                선택 지역: <strong>{selectedRegion}</strong>
              </p>
              <p>
                노출 건수: <strong>{points.length}</strong>
              </p>
            </div>

            <ul className="bfk__list" aria-label="시설 목록">
              {points.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`bfk__item${selectedPoint?.id === item.id ? ' is-active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="bfk__item-top">
                      <strong>{item.facilityName}</strong>
                      <span className="bfk__badge">{scoreLabel(item.overallScore)}</span>
                    </div>
                    <p className="bfk__item-sub">
                      {item.region} {item.district} · {item.facilityType}
                    </p>
                    <p className="bfk__item-score">종합 점수 {item.overallScore}점</p>
                  </button>
                </li>
              ))}
              {points.length === 0 && (
                <li className="bfk__empty">선택 지역에 등록된 데이터가 없습니다.</li>
              )}
            </ul>

            {selectedPoint && (
              <article className="bfk__detail" aria-label="선택 시설 상세">
                <h3 className="bfk__detail-title">{selectedPoint.facilityName}</h3>
                <p className="bfk__detail-sub">
                  {selectedPoint.region} {selectedPoint.district} · {selectedPoint.facilityType}
                </p>
                <dl className="bfk__metrics">
                  <div>
                    <dt>물리 접근성</dt>
                    <dd>{selectedPoint.accessPhysical}</dd>
                  </div>
                  <div>
                    <dt>시각 접근성</dt>
                    <dd>{selectedPoint.accessVisual}</dd>
                  </div>
                  <div>
                    <dt>청각 접근성</dt>
                    <dd>{selectedPoint.accessHearing}</dd>
                  </div>
                  <div>
                    <dt>종합 점수</dt>
                    <dd>{selectedPoint.overallScore}</dd>
                  </div>
                </dl>
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
