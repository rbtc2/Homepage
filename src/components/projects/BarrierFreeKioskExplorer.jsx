'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const REGIONS = ['전체', '서울', '경기', '부산'];
const REGION_META = {
  서울: { lat: 37.5665, lng: 126.978, level: 8 },
  경기: { lat: 37.4138, lng: 127.5183, level: 9 },
  부산: { lat: 35.1796, lng: 129.0756, level: 8 },
};
const DEFAULT_CENTER = { lat: 36.35, lng: 127.9, level: 13 };
const REGION_POLYGONS = {
  서울: [
    { lat: 37.701, lng: 126.764 },
    { lat: 37.704, lng: 127.183 },
    { lat: 37.426, lng: 127.184 },
    { lat: 37.423, lng: 126.766 },
  ],
  경기: [
    { lat: 38.294, lng: 126.385 },
    { lat: 38.296, lng: 127.806 },
    { lat: 36.894, lng: 127.808 },
    { lat: 36.892, lng: 126.387 },
  ],
  부산: [
    { lat: 35.405, lng: 128.752 },
    { lat: 35.407, lng: 129.315 },
    { lat: 34.916, lng: 129.317 },
    { lat: 34.914, lng: 128.754 },
  ],
};
const CATEGORY_META = [
  { key: 'physicalSpace', label: '물리적 공간' },
  { key: 'operationVisual', label: '조작·시각 편의' },
  { key: 'digitalLanguage', label: '디지털·언어 편의' },
  { key: 'voiceAlternative', label: '음성·대체 수단' },
  { key: 'interactionManagement', label: '상호작용·관리' },
];

function scoreLabel(score) {
  if (score >= 85) return '우수';
  if (score >= 70) return '보통';
  return '개선 필요';
}

function boolLabel(value) {
  return value ? '가능' : '미흡';
}

export default function BarrierFreeKioskExplorer({ initialPoints }) {
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [selectedId, setSelectedId] = useState(initialPoints[0]?.id ?? null);
  const [mapError, setMapError] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const pointMarkersRef = useRef([]);
  const regionPolygonsRef = useRef([]);

  const points = useMemo(() => {
    if (selectedRegion === '전체') return initialPoints;
    return initialPoints.filter((item) => item.region === selectedRegion);
  }, [initialPoints, selectedRegion]);

  const selectedPoint = useMemo(
    () => points.find((item) => item.id === selectedId) ?? points[0] ?? null,
    [points, selectedId],
  );

  useEffect(() => {
    if (!selectedPoint && points[0]) {
      setSelectedId(points[0].id);
    }
  }, [points, selectedPoint]);

  useEffect(() => {
    const appKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
    if (!appKey) {
      setMapError('카카오맵 키가 설정되지 않아 지도를 불러올 수 없습니다.');
      return;
    }

    const scriptId = 'kakao-maps-sdk';
    const existing = document.getElementById(scriptId);
    if (!existing) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          if (!mapRef.current) return;
          const center = new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
          const map = new window.kakao.maps.Map(mapRef.current, {
            center,
            level: DEFAULT_CENTER.level,
          });
          mapInstanceRef.current = map;
          setMapError('');
        });
      };
      script.onerror = () => setMapError('카카오맵 SDK 로딩에 실패했습니다.');
      document.head.appendChild(script);
    } else {
      window.kakao.maps.load(() => {
        if (!mapRef.current || mapInstanceRef.current) return;
        const center = new window.kakao.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng);
        const map = new window.kakao.maps.Map(mapRef.current, {
          center,
          level: DEFAULT_CENTER.level,
        });
        mapInstanceRef.current = map;
        setMapError('');
      });
    }
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.kakao?.maps) return;

    pointMarkersRef.current.forEach((marker) => marker.setMap(null));
    regionPolygonsRef.current.forEach((polygon) => polygon.setMap(null));
    pointMarkersRef.current = [];
    regionPolygonsRef.current = [];

    const currentCenter = REGION_META[selectedRegion] ?? DEFAULT_CENTER;
    map.setCenter(new window.kakao.maps.LatLng(currentCenter.lat, currentCenter.lng));
    map.setLevel(currentCenter.level);

    points.forEach((item) => {
      if (typeof item.lat !== 'number' || typeof item.lng !== 'number') return;
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(item.lat, item.lng),
      });
      marker.setMap(map);
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedRegion(item.region);
        setSelectedId(item.id);
      });
      pointMarkersRef.current.push(marker);
    });

    Object.entries(REGION_POLYGONS).forEach(([region, coords]) => {
      const isActive = region === selectedRegion;
      const path = coords.map((coord) => new window.kakao.maps.LatLng(coord.lat, coord.lng));
      const polygon = new window.kakao.maps.Polygon({
        path,
        strokeWeight: isActive ? 3 : 2,
        strokeColor: isActive ? '#124fa6' : '#7f8ea3',
        strokeOpacity: 0.95,
        strokeStyle: 'solid',
        fillColor: isActive ? '#124fa6' : '#9eb4d3',
        fillOpacity: isActive ? 0.22 : 0.12,
      });
      polygon.setMap(map);
      window.kakao.maps.event.addListener(polygon, 'mouseover', () => {
        polygon.setOptions({ fillOpacity: isActive ? 0.26 : 0.18 });
      });
      window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
        polygon.setOptions({ fillOpacity: isActive ? 0.22 : 0.12 });
      });
      window.kakao.maps.event.addListener(polygon, 'click', () => {
        setSelectedRegion(region);
      });
      regionPolygonsRef.current.push(polygon);
    });
  }, [points, selectedRegion]);

  return (
    <section className="bfk" aria-labelledby="bfk-heading">
      <div className="bfk__inner">
        <h2 id="bfk-heading" className="bfk__heading">
          배리어프리 키오스크 접근성 데이터 뷰어
        </h2>
        <p className="bfk__summary">
          좌측 행정구역을 선택하면 우측에 시설별 5개 접근성 축 평가 결과가 표시됩니다.
        </p>

        <div className="bfk__layout">
          <aside className="bfk__map" aria-label="한국 지도 영역">
            <div className="bfk__map-head">
              <strong>지도 영역</strong>
              <span>행정구역 폴리곤(서울/경기/부산)을 클릭하면 우측 목록이 필터됩니다.</span>
            </div>
            <div className="bfk__map-panel">
              <div ref={mapRef} className="bfk__kakao-map" role="img" aria-label="카카오 지도" />
              {mapError && <p className="bfk__map-error">{mapError}</p>}
              <p className="bfk__map-text">빠른 필터</p>
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
                    <div className="bfk__axis">
                      {CATEGORY_META.map((axis) => (
                        <span key={axis.key} className="bfk__axis-chip">
                          {axis.label} {item.categoryScores?.[axis.key] ?? '-'}
                        </span>
                      ))}
                    </div>
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
                  {CATEGORY_META.map((axis) => (
                    <div key={axis.key}>
                      <dt>{axis.label}</dt>
                      <dd>{selectedPoint.categoryScores?.[axis.key] ?? '-'}</dd>
                    </div>
                  ))}
                </dl>

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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
