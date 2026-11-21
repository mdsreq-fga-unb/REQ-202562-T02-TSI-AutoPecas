/* Planejamento de sprints: detalhes acessíveis e navegação por links diretos. */
(function () {
  function recordsIn(page) {
    return Array.prototype.slice.call(page.querySelectorAll("details.sprint-details"));
  }

  function syncControl(page) {
    var button = page.querySelector("[data-schedule-toggle]");
    if (!button) return;
    var expanded = recordsIn(page).every(function (record) { return record.open; });
    button.setAttribute("aria-expanded", expanded ? "true" : "false");
    button.textContent = expanded ? "Recolher todas as sprints" : "Expandir todas as sprints";
  }

  function openTarget() {
    var page = document.querySelector(".schedule-page");
    if (!page || !window.location.hash) return;
    var id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); }
    catch (error) { return; }
    var record = document.getElementById(id);
    if (!record || !page.contains(record) || !record.matches("details.sprint-details")) return;
    record.open = true;
    record.scrollIntoView({ block: "start" });
    syncControl(page);
  }

  function init() {
    var page = document.querySelector(".schedule-page");
    if (!page) return;
    var records = recordsIn(page);
    var button = page.querySelector("[data-schedule-toggle]");
    if (!records.length || !button) return;
    if (page.dataset.scheduleReady !== "true") {
      page.dataset.scheduleReady = "true";
      records.forEach(function (record) {
        record.addEventListener("toggle", function () { syncControl(page); });
      });
      button.addEventListener("click", function () {
        var expand = !records.every(function (record) { return record.open; });
        records.forEach(function (record) { record.open = expand; });
        syncControl(page);
      });
      page.querySelectorAll("[data-sprint-link]").forEach(function (link) {
        link.addEventListener("click", function () {
          var record = document.getElementById(new URL(link.href).hash.slice(1));
          if (record) record.open = true;
        });
      });
    }
    button.hidden = false;
    syncControl(page);
    openTarget();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  }
  window.addEventListener("hashchange", openTarget);
})();
