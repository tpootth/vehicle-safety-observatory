'use strict';
// Top-20 most-tested model families: photo gallery linked to the explorer.
(function () {
  const cars = window.CARS || [];
  const host = $('#cars');
  if (!host || !cars.length) return;
  const maxW = Math.max(...cars.map(c => c.weight || 0));
  const starRow = s => {
    if (s == null) return '<span class="caption">Not rated</span>';
    const full = Math.round(s);
    return `<span class="stars" aria-label="${s} of 5 stars">${'★'.repeat(full)}<span class="off">${'★'.repeat(5 - full)}</span></span> <b style="display:inline;font-size:13px">${fmt(s, 1)}</b>`;
  };
  const title = c => c.label;
  let sortKey = 'rank';
  window.selectedFamily = null;

  function render() {
    const list = [...cars].sort((a, b) => sortKey === 'rank' ? a.rank - b.rank
      : sortKey === 'weight' ? (b.weight || 0) - (a.weight || 0)
      : sortKey === 'l100' ? (a.l100 ?? 99) - (b.l100 ?? 99)
      : (b.stars ?? 0) - (a.stars ?? 0));
    host.innerHTML = list.map(c => `
      <button type="button" class="car" data-rank="${c.rank}" aria-pressed="${window.selectedFamily === c.rank}"
        aria-label="${esc(c.makeLabel + ' ' + c.label)}: ${c.tests} crash tests. Show in explorer">
        <figure><img src="${esc(c.img)}" alt="${esc(c.makeLabel + ' ' + title(c))}" loading="lazy" width="640" height="400">
          <span class="rank">#${c.rank}</span><span class="chip">${esc(c.body)}</span></figure>
        <div class="body">
          <div class="name"><small>${esc(c.makeLabel)}</small>${esc(title(c))}</div>
          <div>${starRow(c.stars)}</div>
          <div class="kv"><span>Weight<b>${c.weight ? fmt(c.weight) + ' kg' : '—'}</b></span><span>Fuel<b>${c.l100 ? fmt(c.l100, 1) + ' L' : '—'}</b></span></div>
          <div class="meter" title="Median weight relative to the heaviest model"><i style="width:${c.weight ? c.weight / maxW * 100 : 0}%"></i></div>
          <span class="caption" style="font-size:12px">${c.tests} tests · ${c.years[0]}–${c.years[1]}</span>
        </div>
      </button>`).join('');
  }
  host.addEventListener('click', e => {
    const b = e.target.closest('.car'); if (!b) return;
    const c = cars.find(x => x.rank === +b.dataset.rank);
    const same = window.selectedFamily === c.rank;
    window.selectedFamily = same ? null : c.rank;
    window.selectedModels = same ? null : new Set(c.models.map(String));
    $('#make').value = same ? '' : c.make;
    $('#body').value = ''; $('#basis').value = '';
    $('#make').dispatchEvent(new Event('change'));
    render(); note();
    if (!same) $('#explore').scrollIntoView({ behavior: 'smooth' });
  });
  $$('.gallery-sort button').forEach(b => b.addEventListener('click', () => {
    sortKey = b.dataset.sort;
    $$('.gallery-sort button').forEach(x => x.setAttribute('aria-pressed', x === b));
    render();
  }));
  $('#make').addEventListener('change', () => {
    const c = cars.find(x => x.rank === window.selectedFamily);
    if (c && $('#make').value !== c.make) { window.selectedFamily = null; window.selectedModels = null; render(); $('#body').dispatchEvent(new Event('change')); }
    note();
  });
  function note() {
    const c = cars.find(x => x.rank === window.selectedFamily), el = $('#family-note');
    el.hidden = !c;
    if (c) el.innerHTML = `Showing <b>${esc(c.makeLabel + ' ' + c.label)}</b> only · <button type="button" id="clear-family">Show all</button>`;
    const b = $('#clear-family'); if (b) b.onclick = () => $('#reset').click();
  }
  $('#reset').addEventListener('click', () => { window.selectedFamily = null; window.selectedModels = null; render(); note(); $('#body').dispatchEvent(new Event('change')); });
  render();

  $('#credits-list').innerHTML = cars.map(c =>
    `<li>${esc(c.makeLabel + ' ' + title(c))}: <a href="${esc(c.credit.source)}" target="_blank" rel="noopener">${esc(c.credit.author || 'Wikimedia Commons')}</a>, ${esc(c.credit.license)}</li>`).join('');
})();
