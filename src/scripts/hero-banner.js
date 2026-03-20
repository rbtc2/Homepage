(() => {
  const SLIDE_TITLES = ["배너 헤드라인 1", "배너 헤드라인 2", "배너 헤드라인 3", "배너 헤드라인 4"];

  function getNextIndex(currentIndex, delta, total) {
    // delta: +1 (next), -1 (prev)
    return (currentIndex + delta + total) % total;
  }

  function initHeroBanner() {
    const titleEl = document.getElementById("hero-title");
    const descEl = document.querySelector(".hero__desc");
    const prevBtn = document.querySelector(".hero__ctrl--prev");
    const nextBtn = document.querySelector(".hero__ctrl--next");

    if (!titleEl || !prevBtn || !nextBtn || !descEl) return;

    // Keep description as-is for now; only cycle the headline text.
    const initialDesc = descEl.textContent?.trim() ?? "";

    let index = 0;

    function render() {
      titleEl.textContent = SLIDE_TITLES[index];
      // Ensure we don't accidentally clear the existing description.
      if (!descEl.textContent) descEl.textContent = initialDesc;
    }

    prevBtn.addEventListener("click", () => {
      index = getNextIndex(index, -1, SLIDE_TITLES.length);
      render();
    });

    nextBtn.addEventListener("click", () => {
      index = getNextIndex(index, +1, SLIDE_TITLES.length);
      render();
    });

    render();
  }

  window.addEventListener("DOMContentLoaded", initHeroBanner);
})();

