(() => {
  const SLIDE_TITLES = ["배너 헤드라인 1", "배너 헤드라인 2", "배너 헤드라인 3", "배너 헤드라인 4"];

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

  function initHeroBanner() {
    const titleEl = document.getElementById("hero-title");
    const descEl = document.querySelector(".hero__desc");
    const prevBtn = document.querySelector(".hero__ctrl--prev");
    const nextBtn = document.querySelector(".hero__ctrl--next");

    if (!titleEl || !prevBtn || !nextBtn || !descEl) return;

    const initialDesc = descEl.textContent?.trim() ?? "";

    let index = 0;
    let isAnimating = false;

    function renderImmediate() {
      stripTitleMotionClasses(titleEl);
      titleEl.textContent = SLIDE_TITLES[index];
      if (!descEl.textContent) descEl.textContent = initialDesc;
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
        titleEl.textContent = SLIDE_TITLES[index];
        if (!descEl.textContent) descEl.textContent = initialDesc;

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
      const newIndex = getNextIndex(index, -1, SLIDE_TITLES.length);
      animateTo(newIndex, -1);
    });

    nextBtn.addEventListener("click", () => {
      const newIndex = getNextIndex(index, +1, SLIDE_TITLES.length);
      animateTo(newIndex, +1);
    });

    renderImmediate();
  }

  window.addEventListener("DOMContentLoaded", initHeroBanner);
})();
