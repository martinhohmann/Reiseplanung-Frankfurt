// Nico Privé – Frankfurt zu Fuß
// Gemeinsames Script: mobile Navigation, Service Worker.
// (Gleiche Struktur wie madeira-2026/js/app.js, ohne Countdown – kein festes Reisedatum.)

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector("nav.main-nav");
    if (toggle && nav) {
      toggle.addEventListener("click", function () {
        nav.classList.toggle("open");
      });
      // Menü nach Klick auf einen Anker-Link wieder schließen
      nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
          nav.classList.remove("open");
        });
      });
    }
  });

  // --- Service Worker (Offline-Fähigkeit) ---
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      if (window.location.protocol.startsWith("http")) {
        var base = document.body.getAttribute("data-base") || "./";
        navigator.serviceWorker.register(base + "service-worker.js", { scope: base }).catch(function (err) {
          console.log("Service Worker Registrierung fehlgeschlagen:", err);
        });
      }
    });
  }
})();
