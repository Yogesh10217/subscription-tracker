/**
 * main.js — Intelligence Designed To Evolve
 * Handles: stat count-up animations, mobile menu, nav active state.
 * No dependencies — vanilla ES2020.
 */

/* ═══════════════════════════════════════════════════════════════
   EASING
   ═══════════════════════════════════════════════════════════════ */

/** easeOutCubic — decelerating ramp, matches CSS cubic-bezier(0.22,1,0.36,1) feel */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ═══════════════════════════════════════════════════════════════
   COUNT-UP ANIMATION
   Uses rAF loop with easeOutCubic. Triggered once by
   IntersectionObserver (threshold 0.25) to count from 0 → target.
   Each stat gets a staggered start offset and unique duration.
   ═══════════════════════════════════════════════════════════════ */

/**
 * Animates a single element's text from 0 to target.
 * @param {HTMLElement} el
 * @param {number} target   - final numeric value
 * @param {number} decimals - fixed decimal places
 * @param {string} suffix   - appended after number (e.g. "ms", "%", "/7", "M")
 * @param {number} duration - animation duration in ms
 */
function runCountUp(el, target, decimals, suffix, duration) {
  const startTime = performance.now();

  function frame(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutCubic(progress);
    const value    = eased * target;

    el.textContent = value.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      // Snap to exact final value (no floating-point drift)
      el.textContent = target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(frame);
}

/**
 * Wire up IntersectionObserver for all [data-target] elements.
 * Each fires once when it enters the viewport.
 */
function initCountUps() {
  const statEls = document.querySelectorAll(".stat-value[data-target]");
  if (!statEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Observe only once
        observer.unobserve(entry.target);

        const el       = entry.target;
        const index    = parseInt(el.dataset.index    ?? "0",  10);
        const target   = parseFloat(el.dataset.target  ?? "0");
        const decimals = parseInt(el.dataset.decimals  ?? "0",  10);
        const suffix   = el.dataset.suffix             ?? "";

        // Stagger: later stats start later and run slightly longer
        const delay    = 480 + index * 90;
        const duration = 1500 + index * 80;

        setTimeout(() => {
          runCountUp(el, target, decimals, suffix, duration);
        }, delay);
      });
    },
    { threshold: 0.25 }
  );

  statEls.forEach((el, i) => {
    el.dataset.index = String(i);
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE MENU
   ─── State: isOpen flag + aria-expanded on burger
   ─── open():  show overlay + sheet, replay link animations,
                set aria, body.menu-open for scroll lock
   ─── close(): hide overlay + sheet, remove aria, remove lock
   ─── Close triggers: overlay click, Escape, link click, resize >720
   ═══════════════════════════════════════════════════════════════ */

function initMobileMenu() {
  const burger  = document.querySelector(".burger");
  const menu    = document.getElementById("mobile-menu");
  const overlay = document.getElementById("mobile-overlay");

  if (!burger || !menu || !overlay) return;

  let isOpen = false;

  /** Replay the staggered linkIn animation for each link/button */
  function replayLinkAnimations() {
    const animated = menu.querySelectorAll(".mobile-link, .mobile-sign-in");
    animated.forEach((el) => {
      // Force reflow by removing + re-adding animation
      el.style.animation = "none";
      // Reading offsetHeight triggers a synchronous layout (reflow)
      void el.offsetHeight;
      el.style.animation = "";
    });
  }

  function openMenu() {
    if (isOpen) return;
    isOpen = true;

    burger.setAttribute("aria-expanded", "true");
    burger.classList.add("open");

    menu.removeAttribute("hidden");
    overlay.classList.add("open");
    document.body.classList.add("menu-open");

    replayLinkAnimations();

    // Announce to screen readers
    menu.removeAttribute("aria-hidden");
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    burger.setAttribute("aria-expanded", "false");
    burger.classList.remove("open");

    menu.setAttribute("hidden", "");
    overlay.classList.remove("open");
    document.body.classList.remove("menu-open");

    menu.setAttribute("aria-hidden", "true");
  }

  // Burger toggle
  burger.addEventListener("click", () => {
    isOpen ? closeMenu() : openMenu();
  });

  // Overlay click → close
  overlay.addEventListener("click", closeMenu);

  // Escape key → close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closeMenu();
      burger.focus(); // return focus to trigger
    }
  });

  // Link or sign-in click → close + handle active state
  menu.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      closeMenu();
    });
  });

  const mobileSignIn = menu.querySelector(".mobile-sign-in");
  if (mobileSignIn) {
    mobileSignIn.addEventListener("click", closeMenu);
  }

  // Resize beyond mobile breakpoint → close automatically
  const mql = window.matchMedia("(min-width: 721px)");
  function handleResize(e) {
    if (e.matches && isOpen) closeMenu();
  }
  // Modern API
  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", handleResize);
  } else {
    // Legacy fallback
    mql.addListener(handleResize);
  }
}

/* ═══════════════════════════════════════════════════════════════
   NAV ACTIVE STATE
   Syncs active class between desktop nav-links and mobile links.
   ═══════════════════════════════════════════════════════════════ */

function initNavLinks() {
  const desktopLinks = document.querySelectorAll(".nav-link");
  const mobileLinks  = document.querySelectorAll(".mobile-link");

  /**
   * Set the active link by data-label value.
   * @param {string} label
   */
  function setActive(label) {
    desktopLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.label === label);
    });
    mobileLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.label === label);
    });
  }

  desktopLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setActive(link.dataset.label ?? "");
    });
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setActive(link.dataset.label ?? "");
    });
  });
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION GUARD
   If user prefers reduced motion, skip count-up animations entirely
   (CSS already handles the visual side; here we just set final values).
   ═══════════════════════════════════════════════════════════════ */

function respectReducedMotion() {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!mql.matches) return;

  // Snap stat values to their final state immediately
  document.querySelectorAll(".stat-value[data-target]").forEach((el) => {
    const target   = parseFloat(el.dataset.target   ?? "0");
    const decimals = parseInt(el.dataset.decimals   ?? "0", 10);
    const suffix   = el.dataset.suffix              ?? "";
    el.textContent = target.toFixed(decimals) + suffix;
  });
}

/* ═══════════════════════════════════════════════════════════════
   BOOT
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  respectReducedMotion();

  // Only run count-up if user allows motion (otherwise already snapped above)
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced) {
    initCountUps();
  }

  initMobileMenu();
  initNavLinks();
});
