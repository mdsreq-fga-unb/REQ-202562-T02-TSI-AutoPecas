/* Uma lista de histórias com filtros combináveis e navegação por IDs estáveis. */
(function () {
  var wired = new WeakSet();
  function init() {
    var catalog = document.querySelector('.backlog-catalog');
    if (!catalog || wired.has(catalog)) return;
    wired.add(catalog);
    catalog.dataset.wired = 'true';
    var search = catalog.querySelector('[data-backlog-search]');
    var filters = Array.from(catalog.querySelectorAll('[data-backlog-filter]'));
    var toggle = catalog.querySelector('.catalog-toggle');
    var reset = catalog.querySelector('[data-backlog-reset]');
    var counter = catalog.querySelector('[data-backlog-count]');
    var extraCounter = catalog.querySelector('[data-backlog-extra-count]');
    var records = Array.from(catalog.querySelectorAll('details.req-record'));
    var stories = records.filter(function (record) { return record.hasAttribute('data-cut'); });
    function normalize(value) {
      return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }
    stories.forEach(function (record) {
      var epic = record.closest('.backlog-epic[data-backlog-epic]');
      var title = epic ? epic.querySelector('h3').textContent : '';
      record._backlogSearch = normalize(record.dataset.search + ' ' + record.textContent + ' ' + title);
    });
    function matches(record, control) {
      var value = control.value;
      if (!value) return true;
      var key = control.dataset.backlogFilter;
      if (key === 'rnf') return record.dataset.rnfs.split(' ').indexOf(value) !== -1;
      if (key === 'evidence') {
        var evidence = record.dataset.evidence;
        return value === 'none' ? !evidence : evidence.split(' ').indexOf(value) !== -1;
      }
      if (key === 'detail' && value === 'refining') return record.dataset.refining === 'yes';
      return record.dataset[key] === value;
    }
    function updateToggle() {
      var visible = records.filter(function (record) { return !record.hidden; });
      var expanded = visible.length > 0 && visible.every(function (record) { return record.open; });
      toggle.textContent = expanded ? 'Recolher registros' : 'Expandir registros';
      toggle.setAttribute('aria-expanded', String(expanded));
    }
    function filter() {
      var words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
      var exactId = words.length === 1 && /^(?:us|rf)0*(\d+)$/.exec(words[0]);
      stories.forEach(function (record) {
        var textMatches = exactId ? Number(record.id.slice(2)) === Number(exactId[1]) :
          words.every(function (word) { return record._backlogSearch.indexOf(word) !== -1; });
        record.hidden = !textMatches || !filters.every(function (control) { return matches(record, control); });
      });
      catalog.querySelectorAll('.backlog-epic[data-backlog-epic]').forEach(function (epic) {
        epic.hidden = !Array.from(epic.querySelectorAll('details.req-record')).some(function (record) { return !record.hidden; });
      });
      var visible = stories.filter(function (record) { return !record.hidden; }).length;
      catalog.querySelector('[data-backlog-empty]').hidden = visible > 0;
      counter.textContent = visible + ' de ' + stories.length + ' histórias';
      var extraActive = filters.filter(function (control) { return control.value && control.closest('.backlog-filter-options'); }).length;
      extraCounter.textContent = extraActive ? ' (' + extraActive + ' ativos)' : '';
      reset.disabled = !search.value && !filters.some(function (control) { return Boolean(control.value); });
      updateToggle();
    }
    function clear() {
      search.value = '';
      filters.forEach(function (control) { control.value = ''; });
      filter();
    }
    function openTarget() {
      var target;
      try { target = document.getElementById(decodeURIComponent(window.location.hash.slice(1))); }
      catch (error) { return; }
      if (!target || !catalog.contains(target)) return;
      var record = target.closest('details.req-record');
      if (record) {
        clear();
        record.open = true;
        record.scrollIntoView({ block: 'start' });
        updateToggle();
      } else {
        var epic = target.closest('.backlog-epic[data-backlog-epic]');
        if (epic && epic.hidden) {
          clear();
          target.scrollIntoView({ block: 'start' });
        }
      }
    }
    search.addEventListener('input', filter);
    filters.forEach(function (control) { control.addEventListener('change', filter); });
    reset.addEventListener('click', clear);
    toggle.addEventListener('click', function () {
      var visible = records.filter(function (record) { return !record.hidden; });
      var expand = !visible.every(function (record) { return record.open; });
      visible.forEach(function (record) { record.open = expand; });
      updateToggle();
    });
    catalog.addEventListener('toggle', updateToggle, true);
    filter();
    openTarget();
    catalog._openBacklogTarget = openTarget;
  }
  if (window.document$ && typeof window.document$.subscribe === 'function') {
    window.document$.subscribe(init);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  window.addEventListener('hashchange', function () {
    var catalog = document.querySelector('.backlog-catalog');
    if (catalog && catalog._openBacklogTarget) catalog._openBacklogTarget();
  });
})();
