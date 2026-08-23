/**
 * darkmode.js — Dark / Light mode toggle for subhankarnag.github.io
 *
 * Responsibilities:
 *  1. Reads saved theme from localStorage or OS preference.
 *  2. Applies data-theme="dark" on <html> immediately (before paint) to avoid flash.
 *  3. Injects the dark mode toggle button into .masthead__inner-wrap (outside greedy-nav)
 *     so that greedy-nav width calculations and responsive collapsing work flawlessly.
 *  4. Tags project headings with .project-heading class for custom styling.
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

  /* Apply BEFORE first paint */
  applyTheme(isDark);

  /* ── 2. Build toggle button DOM ── */
  function buildButton() {
    var btn = document.createElement("button");
    btn.id = "dm-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.setAttribute("title",      "Toggle dark / light mode");
    btn.setAttribute("type",       "button");

    btn.innerHTML =
      '<span class="dm-track">' +
        '<span class="dm-knob">' +
          '<span class="dm-icon-sun" aria-hidden="true">☀</span>' +
          '<span class="dm-icon-moon" aria-hidden="true">☽</span>' +
        "</span>" +
      "</span>";

    return btn;
  }

  /* ── 3. Tag project h3s with .project-heading class ── */
  function tagProjectHeadings() {
    var projectsAnchor = document.getElementById("projects");
    if (!projectsAnchor) return;

    var el = projectsAnchor.nextElementSibling;
    while (el) {
      if (el.tagName === "H2") break; // stop at next section
      if (el.tagName === "H3") {
        el.classList.add("project-heading");
      }
      el = el.nextElementSibling;
    }
  }

  /* ── 4. Inject toggle button into .masthead__inner-wrap ── */
  function init() {
    if (document.getElementById("dm-toggle")) return;

    var btn = buildButton();

    // Inject into .masthead__inner-wrap (outside greedy-nav to prevent clipping)
    var innerWrap = document.querySelector(".masthead__inner-wrap");
    var masthead  = document.querySelector(".masthead");

    if (innerWrap) {
      innerWrap.appendChild(btn);
    } else if (masthead) {
      masthead.appendChild(btn);
    }

    btn.addEventListener("click", function () {
      isDark = !isDark;
      applyTheme(isDark);
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    });

    tagProjectHeadings();

    // Trigger resize event so greedy-nav recalibrates visible vs hidden links
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  }

  /* ── 5. Run when DOM is ready ── */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* ── 6. Follow OS preference changes if no manual override exists ── */
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
