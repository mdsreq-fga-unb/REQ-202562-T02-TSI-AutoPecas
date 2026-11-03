/* Catálogo de requisitos: abre o registro alvo de um link direto e permite
   expandir ou recolher todos os registros da página. */
(function () {
  function openTarget() {
    var hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    var el;
    try {
      el = document.querySelector(hash);
    } catch (err) {
      return;
    }
    if (!el) return;
    var record = el.closest ? el.closest("details.req-record") : null;
    if (record) {
      record.open = true;
      record.scrollIntoView({ block: "start" });
    }
  }

  function wireToggle() {
    var toggle = document.querySelector(".catalog-toggle");
    if (!toggle) return;
    var records = document.querySelectorAll("details.req-record");
    if (!records.length) return;
    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      var expand = toggle.dataset.state !== "expanded";
      records.forEach(function (record) {
        record.open = expand;
      });
      toggle.dataset.state = expand ? "expanded" : "collapsed";
      toggle.textContent = expand
        ? "Recolher todos os registros"
        : "Expandir todos os registros";
    });
  }

  function init() {
    wireToggle();
    openTarget();
  }

  // O tema Material troca de página sem recarregar (navigation.instant).
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(init);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
  window.addEventListener("hashchange", openTarget);
})();
