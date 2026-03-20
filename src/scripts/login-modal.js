(function () {
  const openBtn = document.querySelector("[data-login-open]");
  const modal = document.getElementById("login-modal");
  if (!openBtn || !modal) return;

  const closers = modal.querySelectorAll("[data-modal-close]");
  const form = document.getElementById("login-modal-form");
  const idInput = document.getElementById("login-modal-email");
  const passwordInput = document.getElementById("login-modal-password");
  const submitBtn = form?.querySelector('button[type="submit"]') ?? null;
  const errorEl = document.getElementById("login-modal-error");

  const ADMIN_ID = "admin";
  const ADMIN_PASSWORD = "admin";

  function setOpen(open) {
    modal.hidden = !open;
    modal.setAttribute("aria-hidden", open ? "false" : "true");
    openBtn.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      const closeBtn = modal.querySelector(".login-modal__close");
      closeBtn?.focus({ preventScroll: true });

      // Reset transient state when opening.
      errorEl && (errorEl.hidden = true);
      syncSubmitState();
    } else {
      openBtn.focus({ preventScroll: true });
    }
  }

  function syncSubmitState() {
    if (!submitBtn || !idInput || !passwordInput) return;
    const id = idInput.value.trim();
    const pw = passwordInput.value;
    const canSubmit = Boolean(id && pw);

    submitBtn.disabled = !canSubmit;
    submitBtn.setAttribute("aria-disabled", (!canSubmit).toString());
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

  idInput?.addEventListener("input", syncSubmitState);
  passwordInput?.addEventListener("input", syncSubmitState);

  form?.addEventListener("submit", function (e) {
    e.preventDefault();

    const id = idInput?.value.trim() ?? "";
    const pw = passwordInput?.value ?? "";

    if (id === ADMIN_ID && pw === ADMIN_PASSWORD) {
      // Navigate to the static admin page.
      window.location.assign("admin.html");
      return;
    }

    if (errorEl) {
      errorEl.textContent = "아이디/비밀번호가 올바르지 않습니다.";
      errorEl.hidden = false;
    }
  });
})();
