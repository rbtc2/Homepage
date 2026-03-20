(() => {
  /** 슬라이드별 ‘전체 뷰포트’ 배경 이미지 파일 경로 (public 기준). 파일은 여기에 둡니다. */
  const HERO_BG_IMAGE_BASE = "public/images/hero/slides";

  /**
   * 슬라이드 데이터
   * - backgroundImage: 파일명 문자열이면 `.hero__viewport` 전체에 cover 배경으로 표시됩니다.
   * - null 이면 배경 이미지 없음 → 그라데이션만 보입니다. (현재 기본값 전부 null)
   */
  const HERO_SLIDES = [
    {
      title: "배너 헤드라인 1",
      description:
        "슬라이드 배너에 들어갈 부제·요약 문구가 이 위치에 배치됩니다. 현재는 레이아웃용 스켈레톤입니다.",
      backgroundImage: null,
    },
    {
      title: "배너 헤드라인 2",
      description:
        "슬라이드 배너에 들어갈 부제·요약 문구가 이 위치에 배치됩니다. 현재는 레이아웃용 스켈레톤입니다.",
      backgroundImage: null,
    },
    {
      title: "배너 헤드라인 3",
      description:
        "슬라이드 배너에 들어갈 부제·요약 문구가 이 위치에 배치됩니다. 현재는 레이아웃용 스켈레톤입니다.",
      backgroundImage: null,
    },
    {
      title: "배너 헤드라인 4",
      description:
        "슬라이드 배너에 들어갈 부제·요약 문구가 이 위치에 배치됩니다. 현재는 레이아웃용 스켈레톤입니다.",
      backgroundImage: null,
    },
  ];

  const LEAVE_NEXT = "hero__title--leave-next";
  const LEAVE_PREV = "hero__title--leave-prev";
  const NO_MOTION = "hero__title--no-motion";
  const ENTER_FROM_NEXT = "hero__title--enter-from-next";
  const ENTER_FROM_PREV = "hero__title--enter-from-prev";

  function getNextIndex(currentIndex, delta, total) {
    return (currentIndex + delta + total) % total;
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function stripTitleMotionClasses(titleEl) {
    titleEl.classList.remove(LEAVE_NEXT, LEAVE_PREV, NO_MOTION, ENTER_FROM_NEXT, ENTER_FROM_PREV);
  }

  function applyHeroViewportBackground(viewportEl, slide) {
    const file = slide?.backgroundImage;
    if (typeof file === "string" && file.trim() !== "") {
      const url = `${HERO_BG_IMAGE_BASE}/${file}`.replace(/\\/g, "/");
      viewportEl.style.setProperty("--hero-slide-bg-image", `url("${url}")`);
    } else {
      viewportEl.style.removeProperty("--hero-slide-bg-image");
    }
  }

  function applySlideContent(index, titleEl, descEl, viewportEl) {
    const slide = HERO_SLIDES[index];
    if (!slide) return;

    titleEl.textContent = slide.title;
    descEl.textContent = slide.description;
    applyHeroViewportBackground(viewportEl, slide);
  }

  function initHeroBanner() {
    const viewportEl = document.getElementById("hero-viewport");
    const titleEl = document.getElementById("hero-title");
    const descEl = document.querySelector(".hero__desc");
    const prevBtn = document.querySelector(".hero__ctrl--prev");
    const nextBtn = document.querySelector(".hero__ctrl--next");

    if (!viewportEl || !titleEl || !prevBtn || !nextBtn || !descEl) return;

    let index = 0;
    let isAnimating = false;

    function renderImmediate() {
      stripTitleMotionClasses(titleEl);
      applySlideContent(index, titleEl, descEl, viewportEl);
    }

    function animateTo(newIndex, direction) {
      if (newIndex === index) return;

      if (prefersReducedMotion()) {
        index = newIndex;
        renderImmediate();
        return;
      }

      if (isAnimating) return;
      isAnimating = true;

      const leaveClass = direction > 0 ? LEAVE_NEXT : LEAVE_PREV;
      const enterFromClass = direction > 0 ? ENTER_FROM_NEXT : ENTER_FROM_PREV;

      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        isAnimating = false;
      };

      const safetyMs = 400;
      const safetyId = window.setTimeout(settle, safetyMs);

      const afterLeave = () => {
        index = newIndex;
        applySlideContent(index, titleEl, descEl, viewportEl);

        titleEl.classList.remove(leaveClass);
        titleEl.classList.add(NO_MOTION, enterFromClass);
        void titleEl.offsetHeight;
        titleEl.classList.remove(NO_MOTION);

        requestAnimationFrame(() => {
          titleEl.classList.remove(enterFromClass);
        });

        const onEnterEnd = (e) => {
          if (e.target !== titleEl) return;
          if (e.propertyName !== "opacity" && e.propertyName !== "transform") return;
          titleEl.removeEventListener("transitionend", onEnterEnd);
          window.clearTimeout(safetyId);
          settle();
        };

        titleEl.addEventListener("transitionend", onEnterEnd);
      };

      const onLeaveEnd = (e) => {
        if (e.target !== titleEl) return;
        if (e.propertyName !== "opacity" && e.propertyName !== "transform") return;
        titleEl.removeEventListener("transitionend", onLeaveEnd);
        afterLeave();
      };

      titleEl.addEventListener("transitionend", onLeaveEnd);
      titleEl.classList.add(leaveClass);
    }

    prevBtn.addEventListener("click", () => {
      const newIndex = getNextIndex(index, -1, HERO_SLIDES.length);
      animateTo(newIndex, -1);
    });

    nextBtn.addEventListener("click", () => {
      const newIndex = getNextIndex(index, +1, HERO_SLIDES.length);
      animateTo(newIndex, +1);
    });

    renderImmediate();
  }

  window.addEventListener("DOMContentLoaded", initHeroBanner);
})();
