'use client';

import { useMemo, useState } from 'react';

const BG_BASE = '/images/hero/slides';

/** 배경만 쓰는 풀블리드 슬라이드. 파일명은 public/images/hero/slides/ 기준 */
const HERO_SLIDES = [
  { backgroundImage: 'slide-01.svg', label: '배너 이미지 1' },
  { backgroundImage: 'slide-02.svg', label: '배너 이미지 2' },
  { backgroundImage: 'slide-03.svg', label: '배너 이미지 3' },
  { backgroundImage: 'slide-04.svg', label: '배너 이미지 4' },
];

function getNextIndex(current, delta, total) {
  return (current + delta + total) % total;
}

function slideUrl(filename) {
  return `${BG_BASE}/${filename}`;
}

export default function HeroBanner() {
  const [index, setIndex] = useState(0);

  const slide = HERO_SLIDES[index];
  const bgImage = useMemo(
    () => (slide.backgroundImage ? slideUrl(slide.backgroundImage) : null),
    [slide.backgroundImage],
  );

  const viewportStyle = bgImage
    ? { '--hero-slide-bg-image': `url("${bgImage}")` }
    : undefined;

  function goTo(newIndex) {
    if (newIndex === index) return;
    setIndex(newIndex);
  }

  return (
    <section className="hero" aria-label="메인 배너 슬라이드">
      <div className="hero__viewport" id="hero-viewport" style={viewportStyle}>
        <div className="hero__bg" aria-hidden="true" />
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
