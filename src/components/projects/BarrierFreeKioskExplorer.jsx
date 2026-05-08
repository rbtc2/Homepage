'use client';

import { useMemo, useState } from 'react';

const REGIONS = ['전체', '서울', '경기', '부산'];
function boolLabel(value) {
  return value ? '가능' : '미흡';
}

export default function BarrierFreeKioskExplorer({ initialPoints }) {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedId, setSelectedId] = useState(initialPoints[0]?.id ?? null);
  const [searchField, setSearchField] = useState('facilityName');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchNotice, setSearchNotice] = useState('');

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
          배리어프리 키오스크 접근성 데이터 뷰어
        </h2>
        <p className="bfk__summary">
          지도 없이 데이터 중심으로 탐색할 수 있도록 목록/상세 화면을 분리했습니다.
        </p>

        <div className="bfk__controls">
          <div className="bfk__region-list" aria-label="지역 필터">
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

          <form
            className="bfk__search"
            onSubmit={(event) => {
              event.preventDefault();
              setSearchNotice('검색 기능은 준비 중입니다. 현재는 지역 선택과 목록 클릭으로 확인해 주세요.');
            }}
            aria-label="키오스크 데이터 검색"
          >
            <label className="bfk__search-label" htmlFor="bfk-search-keyword">
              데이터 검색 (스켈레톤)
            </label>
            <div className="bfk__search-row">
              <select
                className="bfk__search-select"
                value={searchField}
                onChange={(event) => setSearchField(event.target.value)}
                aria-label="검색 항목"
              >
                <option value="facilityName">시설명</option>
                <option value="district">지역(구/시)</option>
                <option value="facilityType">시설 유형</option>
              </select>
              <input
                id="bfk-search-keyword"
                className="bfk__search-input"
                type="search"
                value={searchKeyword}
                onChange={(event) => setSearchKeyword(event.target.value)}
                placeholder="예: 송파구청"
              />
              <button type="submit" className="bfk__search-btn">
                검색
              </button>
            </div>
          </form>
        </div>
        <p className="bfk__search-help">
          실제 필터링 로직은 다음 단계에서 Supabase 데이터 조회와 연결됩니다.
        </p>
        {searchNotice && (
          <p className="bfk__search-notice" role="status" aria-live="polite">
            {searchNotice}
          </p>
        )}

        <div className="bfk__layout">
          <section className="bfk__panel bfk__panel--list" aria-label="시설 목록">
            <div className="bfk__meta">
              <p>
                선택 지역: <strong>{selectedRegion}</strong>
              </p>
              <p>
                노출 건수: <strong>{points.length}</strong>
              </p>
            </div>

            <ul className="bfk__list">
              {points.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`bfk__item${selectedPoint?.id === item.id ? ' is-active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="bfk__item-top">
                      <strong>{item.facilityName}</strong>
                      <span className="bfk__pill">{item.facilityType}</span>
                    </div>
                    <p className="bfk__item-sub">
                      {item.region} {item.district}
                    </p>
                    <div className="bfk__item-flags">
                      <span>고대비 {boolLabel(item.digitalLanguage?.hasHighContrastMode)}</span>
                      <span>음성안내 {boolLabel(item.voiceAlternative?.hasVoiceGuide)}</span>
                      <span>호출벨 {boolLabel(item.interactionManagement?.callBellReachable)}</span>
                    </div>
                  </button>
                </li>
              ))}
              {points.length === 0 && (
                <li className="bfk__empty">선택 지역에 등록된 데이터가 없습니다.</li>
              )}
            </ul>
          </section>

          <section className="bfk__panel bfk__panel--detail" aria-label="시설 상세">
            {selectedPoint ? (
              <article className="bfk__detail" aria-label="선택 시설 상세">
                <h3 className="bfk__detail-title">{selectedPoint.facilityName}</h3>
                <p className="bfk__detail-sub">
                  {selectedPoint.region} {selectedPoint.district} · {selectedPoint.facilityType}
                </p>
                <div className="bfk__checklist">
                  <section className="bfk__check-section">
                    <h4>물리적 공간 (무릎 공간)</h4>
                    <ul>
                      <li>공간 높이: {selectedPoint.physicalSpace?.kneeSpaceHeightCm ?? '-'}cm</li>
                      <li>
                        전면 활동 공간: {selectedPoint.physicalSpace?.frontActivityAreaSqm ?? '-'}m2
                      </li>
                    </ul>
                  </section>

                  <section className="bfk__check-section">
                    <h4>조작 및 시각 편의</h4>
                    <ul>
                      <li>
                        휠체어 착석 높이 조작: {boolLabel(selectedPoint.operationVisual?.wheelchairSeatedReachable)}
                      </li>
                      <li>점자 블록 적정성: {boolLabel(selectedPoint.operationVisual?.brailleBlockAdequate)}</li>
                    </ul>
                  </section>

                  <section className="bfk__check-section">
                    <h4>디지털 및 언어 편의</h4>
                    <ul>
                      <li>
                        외국어 메뉴 정확성: {boolLabel(selectedPoint.digitalLanguage?.foreignLanguageAccurate)}
                      </li>
                      <li>고대비 모드: {boolLabel(selectedPoint.digitalLanguage?.hasHighContrastMode)}</li>
                      <li>큰 글씨 모드: {boolLabel(selectedPoint.digitalLanguage?.hasLargeTextMode)}</li>
                    </ul>
                  </section>

                  <section className="bfk__check-section">
                    <h4>음성 및 대체 수단</h4>
                    <ul>
                      <li>음성 안내: {boolLabel(selectedPoint.voiceAlternative?.hasVoiceGuide)}</li>
                      <li>볼륨 조절: {boolLabel(selectedPoint.voiceAlternative?.hasVolumeControl)}</li>
                      <li>수어 지원: {boolLabel(selectedPoint.voiceAlternative?.hasSignLanguageSupport)}</li>
                      <li>문자 대체수단: {boolLabel(selectedPoint.voiceAlternative?.hasTextAlternative)}</li>
                      <li>원격제어 보조수단: {boolLabel(selectedPoint.voiceAlternative?.hasRemoteAssist)}</li>
                    </ul>
                  </section>

                  <section className="bfk__check-section">
                    <h4>상호작용 및 관리</h4>
                    <ul>
                      <li>호출벨 도달 가능: {boolLabel(selectedPoint.interactionManagement?.callBellReachable)}</li>
                      <li>
                        상시 지원 인력 응대: {boolLabel(
                          selectedPoint.interactionManagement?.staffSupportConfirmed,
                        )}
                      </li>
                    </ul>
                  </section>
                </div>
              </article>
            ) : (
              <p className="bfk__empty">표시할 상세 데이터가 없습니다.</p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}
