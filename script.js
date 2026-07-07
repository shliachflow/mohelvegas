(function () {
  "use strict";
  var menu = document.getElementById("mobile-menu");
  var menuToggle = document.getElementById("menu-toggle");
  var menuClose = document.getElementById("menu-close");
  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openMenu() {
    if (!menu || !menuToggle) return;
    menu.removeAttribute("inert");
    menu.classList.add("open");
    menu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (menuClose) menuClose.focus({ preventScroll: true });
  }

  function closeMenu() {
    if (!menu || !menuToggle) return;
    menu.classList.remove("open");
    menu.setAttribute("aria-hidden", "true");
    menu.setAttribute("inert", "");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (menu.contains(document.activeElement)) menuToggle.focus({ preventScroll: true });
  }

  if (menuToggle) menuToggle.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (!menu || !menu.classList.contains("open")) return;
    if (e.key === "Escape") { closeMenu(); return; }
    if (e.key !== "Tab") return;
    var focusable = Array.prototype.slice.call(menu.querySelectorAll(FOCUSABLE));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      closeMenu();
    });
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -56px 0px" });
    document.querySelectorAll("[data-r]").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll("[data-r]").forEach(function (el) { el.classList.add("in"); });
  }
}());
