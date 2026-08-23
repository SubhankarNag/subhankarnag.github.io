/**
 * darkmode.js — Dark / Light mode toggle for subhankarnag.github.io
 *
 * Bug fixes applied:
 *  - BUG 4/5: CSS sibling selectors "#projects ~ * h3" were wrong (h3 are
 *    direct siblings of #projects, not nested). Instead, JS adds
 *    .project-heading class to the correct elements after DOM is ready.
 *  - BUG 7: Removed empty .dm-label span (was never populated).
 */

(function () {
  "use strict";

  /* ── 1. Determine initial theme ── */
  var STORAGE_KEY = "dm-theme";
  var saved       = localStorage.getItem(STORAGE_KEY);
  var prefersDark = window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches;

  var isDark = saved ? saved === "dark" : prefersDark;

  function applyTheme(dark) {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  /* Apply BEFORE first paint to avoid flash of wrong theme */
  applyTheme(isDark);

  /* ── 2. Build the toggle button (BUG 7 FIX: no empty label span) ── */
  function buildButton() {
    var btn = document.createElement("button");
    btn.id = "dm-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.setAttribute("title",      "Toggle dark / light mode");

    btn.innerHTML =
      '<span class="dm-track">' +
        '<span class="dm-knob">' +
          '<span class="dm-icon-sun" aria-hidden="true">☀</span>' +
          '<span class="dm-icon-moon" aria-hidden="true">☽</span>' +
        "</span>" +
      "</span>";

    return btn;
  }

  /* ── 3. BUG 4/5 FIX: Tag project h3s with .project-heading class ──
     The CSS selectors "#projects ~ * h3" were structurally wrong because
     h3 elements are DIRECT siblings of the #projects h2, not descendants
     of siblings. We fix this in JS by walking the DOM after it's ready.   */
  function tagProjectHeadings() {
    var projectsAnchor = document.getElementById("projects");
    if (!projectsAnchor) return;

    /* Walk forward siblings of the #projects h2 until the next h2 */
    var el = projectsAnchor.nextElementSibling;
    while (el) {
      if (el.tagName === "H2") break;   /* hit next section — stop */
      if (el.tagName === "H3") {
        el.classList.add("project-heading");
      }
      el = el.nextElementSibling;
    }
  }

  /* ── 4. Inject button into masthead & wire click ── */
  function init() {
    /* Guard against double-injection */
    if (document.getElementById("dm-toggle")) return;

    var btn = buildButton();

    /* Preferred injection point: visible links list in greedy-nav */
    var target =
      document.querySelector(".greedy-nav__visible-links") ||
      document.querySelector(".greedy-nav")                ||
      document.querySelector(".masthead__inner-wrap")      ||
      document.querySelector(".masthead");

    if (!target) return;

    target.appendChild(btn);

    btn.addEventListener("click", function () {
      isDark = !isDark;
      applyTheme(isDark);
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    });

    /* Run DOM-dependent fixes after button is in place */
    tagProjectHeadings();
  }

  /* ── 5. Run after DOM is ready ── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ── 6. Follow OS preference changes when user hasn't manually picked ── */
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function (e) {
        if (!localStorage.getItem(STORAGE_KEY)) {
          isDark = e.matches;
          applyTheme(isDark);
        }
      });
  }
})();
