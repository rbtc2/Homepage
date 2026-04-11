'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const BG_BASE = '/images/hero/slides';

/** 자동 슬라이드 간격(ms) */
const AUTO_PLAY_MS = 6000;

/** 배경만 쓰는 풀블리드 슬라이드. 파일명은 public/images/hero/slides/ 기준 */
const HERO_SLIDES = [
  { backgroundImage: 'slide-01.webp', label: '배너 이미지 1' },
  { backgroundImage: 'slide-02.webp', label: '배너 이미지 2' },
  { backgroundImage: 'slide-03.svg', label: '배너 이미지 3' },
  { backgroundImage: 'slide-04.svg', label: '배너 이미지 4' },
];

function getNextIndex(current, delta, total) {
  return (current + delta + total) % total;
}

function slideUrl(filename) {
  return `${BG_BASE}/${filename}`;
}

function urlForSlide(slide) {
  return slide?.backgroundImage ? slideUrl(slide.backgroundImage) : null;
}

export default function HeroBanner() {
  const firstUrl = urlForSlide(HERO_SLIDES[0]);
  const [index, setIndex] = useState(0);
  const [urlA, setUrlA] = useState(firstUrl);
  const [urlB, setUrlB] = useState(firstUrl);
  /** 어느 레이어가 위(불투명)인지 — 교차 시 상대 레이어에 다음 이미지를 깔고 전환 */
  const [topLayer, setTopLayer] = useState('a');

  const indexRef = useRef(index);
  const topLayerRef = useRef(topLayer);
  indexRef.current = index;
  topLayerRef.current = topLayer;

  /** 호버·포커스(키보드) 시 자동 재생 일시정지 */
  const [interactionPaused, setInteractionPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const onMq = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  useEffect(() => {
    const onVis = () => setTabHidden(document.hidden);
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const goTo = useCallback((newIndex) => {
    if (newIndex === indexRef.current) return;
    const nextUrl = urlForSlide(HERO_SLIDES[newIndex]);
    const incoming = topLayerRef.current === 'a' ? 'b' : 'a';
    if (incoming === 'b') {
      setUrlB(nextUrl);
    } else {
      setUrlA(nextUrl);
    }
    setTopLayer(incoming);
    setIndex(newIndex);
  }, []);

  const autoPlayBlocked =
    interactionPaused || tabHidden || prefersReducedMotion || HERO_SLIDES.length < 2;

  useEffect(() => {
    if (autoPlayBlocked) return undefined;
    const id = window.setInterval(() => {
      goTo(getNextIndex(indexRef.current, 1, HERO_SLIDES.length));
    }, AUTO_PLAY_MS);
    return () => window.clearInterval(id);
  }, [autoPlayBlocked, goTo]);

  const slide = HERO_SLIDES[index];

  function handleBlurCapture(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setInteractionPaused(false);
    }
  }

  function handleMouseLeave(e) {
    const root = e.currentTarget;
    queueMicrotask(() => {
      if (!root.contains(document.activeElement)) {
        setInteractionPaused(false);
      }
    });
  }

  const styleA = urlA ? { backgroundImage: `url("${urlA}")` } : undefined;
  const styleB = urlB ? { backgroundImage: `url("${urlB}")` } : undefined;

  return (
    <section className="hero" aria-label="메인 배너 슬라이드">
      <div
        className="hero__viewport"
        id="hero-viewport"
        onMouseEnter={() => setInteractionPaused(true)}
        onMouseLeave={handleMouseLeave}
        onFocusCapture={() => setInteractionPaused(true)}
        onBlurCapture={handleBlurCapture}
      >
        <div className="hero__bgs" aria-hidden="true">
          <div
            className={`hero__bg hero__bg--layer ${topLayer === 'a' ? 'hero__bg--visible' : ''}`}
            style={styleA}
          />
          <div
            className={`hero__bg hero__bg--layer ${topLayer === 'b' ? 'hero__bg--visible' : ''}`}
            style={styleB}
          />
        </div>
        <div className="hero__slide hero__slide--images-only">
          <p className="hero__sr-only" aria-live="polite">
            {slide.label}, {index + 1}번째 슬라이드, 전체 {HERO_SLIDES.length}장 중
          </p>
        </div>

        <button
          type="button"
          className="hero__ctrl hero__ctrl--prev"
          aria-label="이전 슬라이드"
          onClick={() => goTo(getNextIndex(index, -1, HERO_SLIDES.length))}
        >
          <svg className="hero__chevron" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="hero__ctrl hero__ctrl--next"
          aria-label="다음 슬라이드"
          onClick={() => goTo(getNextIndex(index, +1, HERO_SLIDES.length))}
        >
          <svg className="hero__chevron" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <nav className="hero__dots" aria-label="배너 슬라이드 선택">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={i}
              type="button"
              className={`hero__dot ${i === index ? 'hero__dot--active' : ''}`}
              aria-label={`${s.label} 보기`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => goTo(i)}
            >
              <span className="hero__dot-mark" aria-hidden="true" />
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
