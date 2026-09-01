(function () {
  "use strict";

  var STORAGE_KEY = "dm-theme";
  var saved = localStorage.getItem(STORAGE_KEY);
  
  // Default is Light Mode ("light")
  var isDark = saved ? (saved === "dark") : false;

  function updateThemeColorMeta(dark) {
    var meta = document.getElementById("meta-theme-color");
    if (meta) {
      meta.setAttribute("content", dark ? "#0b0f19" : "#ffffff");
    }
  }

  function applyTheme(dark) {
    var theme = dark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add("theme-" + theme);

    if (document.body) {
      document.body.setAttribute("data-theme", theme);
      document.body.classList.remove("theme-dark", "theme-light");
      document.body.classList.add("theme-" + theme);
    }
    updateThemeColorMeta(dark);
  }

  // Set theme immediately before paint to prevent flash
  applyTheme(isDark);

  function buildButton() {
    var btn = document.createElement("button");
    btn.id = "dm-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.setAttribute("title", "Toggle dark / light mode");
    btn.setAttribute("type", "button");

    btn.innerHTML =
      '<span class="dm-track">' +
        '<span class="dm-knob">' +
          '<span class="dm-icon-sun" aria-hidden="true">☀</span>' +
          '<span class="dm-icon-moon" aria-hidden="true">☽</span>' +
        "</span>" +
      "</span>";

    return btn;
  }

  function buildBackToTop() {
    var btn = document.createElement("button");
    btn.id = "back-to-top";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.setAttribute("title", "Back to top");
    btn.setAttribute("type", "button");
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(btn);

    function checkScroll() {
      if (window.pageYOffset > 350) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }

    window.addEventListener("scroll", checkScroll, { passive: true });
    checkScroll();
  }

  function initScrollSpy() {
    var sections = document.querySelectorAll("h2[id]");
    var navLinks = document.querySelectorAll(".greedy-nav a");
    if (!sections.length || !navLinks.length) return;

    function onScroll() {
      var scrollPos = window.pageYOffset + 120;
      var currentId = "";

      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) {
          currentId = sec.id;
        }
      });

      navLinks.forEach(function (link) {
        var href = link.getAttribute("href") || "";
        var hash = href.replace(/^(\/|#)/, "").replace(/^#/, "");
        if (hash && hash === currentId) {
          link.classList.add("active");
        } else if (href.includes("#")) {
          link.classList.remove("active");
        }
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setupMobileMenuAutoClose() {
    var hiddenLinks = document.querySelector(".greedy-nav .hidden-links");
    var toggleBtn = document.querySelector(".greedy-nav__toggle, .greedy-nav button");
    if (!hiddenLinks) return;

    var backdrop = document.getElementById("nav-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "nav-backdrop";
      document.body.appendChild(backdrop);
    }

    function closeMenu() {
      hiddenLinks.classList.add("hidden");
      backdrop.classList.remove("active");
      if (toggleBtn) toggleBtn.classList.remove("close");
    }

    function syncBackdrop() {
      if (!hiddenLinks.classList.contains("hidden")) {
        backdrop.classList.add("active");
      } else {
        backdrop.classList.remove("active");
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", function () {
        setTimeout(syncBackdrop, 20);
      });
    }

    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        syncBackdrop();
      });
      observer.observe(hiddenLinks, { attributes: true, attributeFilter: ["class"] });
    }

    // Close when tapping any link inside menu
    hiddenLinks.addEventListener("click", function (e) {
      if (e.target.tagName === "A" || e.target.closest("a")) {
        closeMenu();
      }
    });

    // Close on click or touch directly on the backdrop
    backdrop.addEventListener("click", closeMenu);
    backdrop.addEventListener("touchstart", function (e) {
      e.preventDefault();
      closeMenu();
    }, { passive: false });

    // Global outside click and touch handling
    function handleOutside(e) {
      if (!hiddenLinks.classList.contains("hidden")) {
        if (!hiddenLinks.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
          closeMenu();
        }
      }
    }

    document.addEventListener("click", handleOutside, true);
    document.addEventListener("touchstart", function (e) {
      if (!hiddenLinks.classList.contains("hidden")) {
        if (!hiddenLinks.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
          closeMenu();
        }
      }
    }, { passive: true });

    // Close on Escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !hiddenLinks.classList.contains("hidden")) {
        closeMenu();
      }
    });
  }

  function tagProjectHeadings() {
    var projectsAnchor = document.getElementById("projects");
    if (!projectsAnchor) return;

    var el = projectsAnchor.nextElementSibling;
    while (el) {
      if (el.tagName === "H2") break;
      if (el.tagName === "H3") {
        el.classList.add("project-heading");
      }
      el = el.nextElementSibling;
    }
  }

  function init() {
    applyTheme(isDark);

    if (document.getElementById("dm-toggle")) return;

    var btn = buildButton();
    var innerWrap = document.querySelector(".masthead__inner-wrap");
    var masthead = document.querySelector(".masthead");

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
    buildBackToTop();
    initScrollSpy();
    setupMobileMenuAutoClose();

    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

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
