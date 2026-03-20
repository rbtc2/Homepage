'use client';

import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

const HERO_SLIDES = [
  {
    title: '배너 헤드라인 1',
    description: '슬라이드 배너에 들어갈 부제·요약 문구가 이 위치에 배치됩니다. 현재는 레이아웃용 스켈레톤입니다.',
    backgroundImage: null,
  },
  {
    title: '배너 헤드라인 2',
    description: '슬라이드 배너에 들어갈 부제·요약 문구가 이 위치에 배치됩니다. 현재는 레이아웃용 스켈레톤입니다.',
    backgroundImage: null,
  },
  {
    title: '배너 헤드라인 3',
    description: '슬라이드 배너에 들어갈 부제·요약 문구가 이 위치에 배치됩니다. 현재는 레이아웃용 스켈레톤입니다.',
    backgroundImage: null,
  },
  {
    title: '배너 헤드라인 4',
    description: '슬라이드 배너에 들어갈 부제·요약 문구가 이 위치에 배치됩니다. 현재는 레이아웃용 스켈레톤입니다.',
    backgroundImage: null,
  },
];

const BG_BASE = '/images/hero/slides';

function getNextIndex(current, delta, total) {
  return (current + delta + total) % total;
}

export default function HeroBanner() {
  const [index, setIndex] = useState(0);
  const [titleClass, setTitleClass] = useState('hero__title');
  const [bgImage, setBgImage] = useState(null);
  const isAnimatingRef = useRef(false);
  const titleRef = useRef(null);

  const slide = HERO_SLIDES[index];
  const viewportStyle = bgImage
    ? { '--hero-slide-bg-image': `url("${bgImage}")` }
    : undefined;

  function animateTo(newIndex, direction) {
    if (newIndex === index || isAnimatingRef.current) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const newSlide = HERO_SLIDES[newIndex];
    const newBg = newSlide.backgroundImage
      ? `${BG_BASE}/${newSlide.backgroundImage}`
      : null;

    if (prefersReduced) {
      setIndex(newIndex);
      setBgImage(newBg);
      return;
    }

    isAnimatingRef.current = true;
    const titleEl = titleRef.current;
    const leaveClass = direction > 0 ? 'hero__title--leave-next' : 'hero__title--leave-prev';
    const enterFromClass = direction > 0 ? 'hero__title--enter-from-next' : 'hero__title--enter-from-prev';

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      isAnimatingRef.current = false;
    };
    const safetyId = setTimeout(settle, 400);

    const afterLeave = () => {
      // 콘텐츠 업데이트 + 진입 시작 위치 즉시 적용 (transition 없음)
      flushSync(() => {
        setIndex(newIndex);
        setBgImage(newBg);
        setTitleClass(`hero__title hero__title--no-motion ${enterFromClass}`);
      });
      // 리플로우 강제: 브라우저가 off-screen 위치를 인식하도록
      void titleEl.offsetHeight;
      // transition 재활성화 (no-motion 제거), 여전히 off-screen 위치
      flushSync(() => {
        setTitleClass(`hero__title ${enterFromClass}`);
      });
      // 다음 프레임에서 진입 클래스 제거 → CSS transition 실행
      requestAnimationFrame(() => {
        setTitleClass('hero__title');
      });

      const onEnterEnd = (e) => {
        if (e.target !== titleEl) return;
        if (e.propertyName !== 'opacity' && e.propertyName !== 'transform') return;
        titleEl.removeEventListener('transitionend', onEnterEnd);
        clearTimeout(safetyId);
        settle();
      };
      titleEl.addEventListener('transitionend', onEnterEnd);
    };

    // 이탈 애니메이션 시작
    setTitleClass(`hero__title ${leaveClass}`);
    const onLeaveEnd = (e) => {
      if (e.target !== titleEl) return;
      if (e.propertyName !== 'opacity' && e.propertyName !== 'transform') return;
      titleEl.removeEventListener('transitionend', onLeaveEnd);
      afterLeave();
    };
    titleEl.addEventListener('transitionend', onLeaveEnd);
  }

  return (
    <section className="hero" aria-label="메인 배너 슬라이드 영역 (준비 중)">
      <div className="hero__viewport" id="hero-viewport" style={viewportStyle}>
        <div className="hero__bg" aria-hidden="true"></div>
        <div className="hero__slide">
          <div className="hero__layout">
            <div className="hero__visual" aria-hidden="true">
              <div className="hero__visual-frame"></div>
            </div>
            <div className="hero__copy">
              <h2
                className={titleClass}
                id="hero-title"
                ref={titleRef}
                aria-live="polite"
              >
                {slide.title}
              </h2>
              <p className="hero__desc">{slide.description}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="hero__ctrl hero__ctrl--prev"
          aria-label="이전 슬라이드"
          onClick={() => animateTo(getNextIndex(index, -1, HERO_SLIDES.length), -1)}
        >
          <svg className="hero__chevron" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          className="hero__ctrl hero__ctrl--next"
          aria-label="다음 슬라이드"
          onClick={() => animateTo(getNextIndex(index, +1, HERO_SLIDES.length), +1)}
        >
          <svg className="hero__chevron" width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
