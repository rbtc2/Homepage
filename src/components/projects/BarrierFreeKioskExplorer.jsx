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

function scoreLabel(score) {
  if (score >= 85) return '우수';
  if (score >= 70) return '보통';
  return '개선 필요';
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
          지역 선택형 접근성 데이터 뷰어 (MVP)
        </h2>
        <p className="bfk__summary">
          좌측 지역을 선택하면 우측 시설 목록과 접근성 점수가 함께 갱신됩니다.
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
