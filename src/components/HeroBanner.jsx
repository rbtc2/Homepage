'use client';

import { useState } from 'react';

const BG_BASE = '/images/hero/slides';

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

  const slide = HERO_SLIDES[index];

  function goTo(newIndex) {
    if (newIndex === index) return;
    const nextUrl = urlForSlide(HERO_SLIDES[newIndex]);
    const incoming = topLayer === 'a' ? 'b' : 'a';
    if (incoming === 'b') {
      setUrlB(nextUrl);
    } else {
      setUrlA(nextUrl);
    }
    setTopLayer(incoming);
    setIndex(newIndex);
  }

  const styleA = urlA ? { backgroundImage: `url("${urlA}")` } : undefined;
  const styleB = urlB ? { backgroundImage: `url("${urlB}")` } : undefined;

  return (
    <section className="hero" aria-label="메인 배너 슬라이드">
      <div className="hero__viewport" id="hero-viewport">
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
      </div>
    </section>
  );
}
