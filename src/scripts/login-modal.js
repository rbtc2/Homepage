(function () {
  const openBtn = document.querySelector("[data-login-open]");
  const modal = document.getElementById("login-modal");
  if (!openBtn || !modal) return;

  const closers = modal.querySelectorAll("[data-modal-close]");

  function setOpen(open) {
    modal.hidden = !open;
    modal.setAttribute("aria-hidden", open ? "false" : "true");
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      const closeBtn = modal.querySelector(".login-modal__close");
      closeBtn?.focus({ preventScroll: true });
    } else {
      openBtn.focus({ preventScroll: true });
    }
  }

  openBtn.addEventListener("click", function () {
    setOpen(true);
  });

  closers.forEach(function (el) {
    el.addEventListener("click", function () {
      setOpen(false);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.hidden) {
      setOpen(false);
    }
  });

  const form = document.getElementById("login-modal-form");
  form?.addEventListener("submit", function (e) {
    e.preventDefault();
  });
})();
