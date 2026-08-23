/**
 * darkmode.js — Dark / Light mode toggle for subhankarnag.github.io
 *
 * Strategy:
 *  1. On load: read saved preference from localStorage, or fall back to
 *     the OS-level prefers-color-scheme media query.
 *  2. Apply theme immediately (before first paint) by setting
 *     data-theme="dark" on <html>.
 *  3. Inject a toggle button into the Minimal Mistakes masthead nav.
 *  4. Persist the user's choice in localStorage.
 */

(function () {
  "use strict";

  /* ── 1. Determine initial theme ── */
  var STORAGE_KEY = "dm-theme";
  var saved = localStorage.getItem(STORAGE_KEY);
  var prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

  var isDark = saved ? saved === "dark" : prefersDark;

  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  // Apply immediately to avoid flash of wrong theme
  applyTheme(isDark);

  /* ── 2. Build the toggle button DOM ── */
  function buildButton() {
    var btn = document.createElement("button");
    btn.id = "dm-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.setAttribute("title", "Toggle dark / light mode");

    btn.innerHTML =
      '<span class="dm-label" aria-hidden="true"></span>' +
      '<span class="dm-track">' +
        '<span class="dm-knob">' +
          '<span class="dm-icon-sun">☀</span>' +
          '<span class="dm-icon-moon">☽</span>' +
        "</span>" +
      "</span>";

    return btn;
  }

  /* ── 3. Inject button into masthead & wire up events ── */
  function init() {
    // Guard: don't inject twice
    if (document.getElementById("dm-toggle")) return;

    var btn = buildButton();

    // Try to find the Minimal Mistakes greedy-nav visible-links list
    // Fallback locations in order of preference
    var target =
      document.querySelector(".greedy-nav__visible-links") ||
      document.querySelector(".greedy-nav") ||
      document.querySelector(".masthead__inner-wrap") ||
      document.querySelector(".masthead");

    if (!target) return; // masthead not in DOM yet — shouldn't happen with DOMContentLoaded

    target.appendChild(btn);

    btn.addEventListener("click", function () {
      isDark = !isDark;
      applyTheme(isDark);
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    });
  }

  /* ── 4. Run init after DOM is ready ── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ── 5. Sync with OS preference changes (e.g. user changes system theme) ── */
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function (e) {
      // Only auto-follow OS if user hasn't manually set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        isDark = e.matches;
        applyTheme(isDark);
      }
    });
  }
})();
