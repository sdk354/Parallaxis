/* Parallaxis prototype — full-bleed map with a floating drawer.
   No framework, no build step. Open index.html directly. */

(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var BLIND = 0.10;
  var PERSP = window.PX_PERSPECTIVES;
  var EVENTS = window.PX_EVENTS;
  var TREAT = window.PX_TREATMENTS;
  var LAB = window.PX_LAB;

  var state = {
    treatment: 'c',        // Bathymetric — highest scorer, and now just the default theme
    mode: 'compare',        // 'single' | 'compare' — this picks the encoding
    labels: true,
    disputed: true,
    disputedStyle: 'rose',
    single: 'west',
    pair: ['west', 'ru'],
    selected: null,
    hover: null,
    sort: 'divergence',
    blindOnly: false,
    query: '',
    drawer: false
  };

  function isCompare() { return state.mode === 'compare'; }
  // the encoding is not a free choice: a split disc needs two perspectives,
  // a fill level needs one. Mode decides, per round-2 feedback.
  function encoding() { return isCompare() ? 'split' : 'fill'; }
  function sev() { return TREAT[state.treatment].sev; }

  /* ── small helpers ────────────────────────────────────────────────── */

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function byId(id) { return document.getElementById(id); }
  function pName(id) {
    for (var i = 0; i < PERSP.length; i++) if (PERSP[i].id === id) return PERSP[i].name;
    return id;
  }
  function radius(ev) { return 6 + ev.sev * 2.0; }
  function divergence(ev) {
    var v = PERSP.map(function (p) { return ev.cov[p.id]; });
    return Math.max.apply(null, v) - Math.min.apply(null, v);
  }
  function blindList(ev) {
    return PERSP.filter(function (p) { return ev.cov[p.id] <= BLIND; });
  }
  function eventById(id) {
    for (var i = 0; i < EVENTS.length; i++) if (EVENTS[i].id === id) return EVENTS[i];
    return null;
  }

  // Half-disc filled from the bottom to `lvl`. side -1 = left, +1 = right.
  function halfFill(cx, cy, r, lvl, side) {
    if (lvl <= 0) return '';
    if (lvl > 1) lvl = 1;
    var yTop = cy + r - r * 2 * lvl;
    var dx = Math.sqrt(Math.max(r * r - Math.pow(yTop - cy, 2), 0));
    return 'M' + cx + ' ' + yTop + 'L' + (cx + side * dx) + ' ' + yTop +
           'A' + r + ' ' + r + ' 0 0 ' + (side < 0 ? 0 : 1) + ' ' + cx + ' ' + (cy + r) + 'Z';
  }
  function discFill(cx, cy, r, lvl) {
    return lvl <= 0 ? '' : halfFill(cx, cy, r, lvl, -1) + halfFill(cx, cy, r, lvl, 1);
  }

  function visibleEvents() {
    var q = state.query.trim().toLowerCase();
    var list = EVENTS.filter(function (ev) {
      if (state.blindOnly && blindList(ev).length === 0) return false;
      if (!q) return true;
      return (ev.name + ' ' + ev.where).toLowerCase().indexOf(q) !== -1;
    });
    list.sort(function (a, b) {
      if (state.sort === 'severity') return b.sev - a.sev || divergence(b) - divergence(a);
      if (state.sort === 'name') return a.name.localeCompare(b.name);
      return divergence(b) - divergence(a);
    });
    return list;
  }

  /* ── map + viewport ───────────────────────────────────────────────── */

  var svg = byId('map');
  var gShelf, gCountries, gMarks;
  var BASE = { w: 1000, h: 372 };
  var view = { x: 0, y: 0, w: 1000, h: 372 };
  var MAX_ZOOM = 9;

  function aspect() {
    var r = svg.getBoundingClientRect();
    return r.height > 0 ? r.width / r.height : 2.7;
  }
  function clampView() {
    view.w = Math.min(Math.max(view.w, BASE.w / MAX_ZOOM), BASE.w);
    view.h = view.w / aspect();
    var padX = Math.max((view.w - BASE.w) / 2, 30);
    var padY = Math.max((view.h - BASE.h) / 2, 30);
    view.x = Math.min(Math.max(view.x, -padX), BASE.w - view.w + padX);
    view.y = Math.min(Math.max(view.y, -padY), BASE.h - view.h + padY);
  }
  function applyView(redraw) {
    clampView();
    svg.setAttribute('viewBox', view.x + ' ' + view.y + ' ' + view.w + ' ' + view.h);
    var zoomed = view.w < BASE.w - 0.5;

    svg.classList.toggle('grab', true);
    if (redraw !== false) { drawMarkers(); drawLabels(); }
  }
  function drawnScale() {
    var r = svg.getBoundingClientRect();
    return Math.min(r.width / view.w, r.height / view.h);
  }
  function toView(cx, cy) {
    var r = svg.getBoundingClientRect(), s = drawnScale();
    return {
      x: view.x + (cx - r.left - (r.width - view.w * s) / 2) / s,
      y: view.y + (cy - r.top - (r.height - view.h * s) / 2) / s
    };
  }

  var gBathy, gLakes, gRivers, gOcean, gLabels, gDisputed;

  function buildMap() {
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    var GEO = window.PX_GEO;

    // Ocean colour only means anything where there is depth data. Paint the data
    // extent explicitly and let everything beyond it fall to the deepest tone,
    // otherwise the uncovered strip reads as a pale band, not as open water.
    gOcean = el('rect', { id: 'ocean', x: -600, y: 0, width: BASE.w + 1200, height: BASE.h }, svg);

    // One path per feature. Concatenating a whole depth layer made
    // fill-rule:evenodd cancel unrelated features against each other.
    gBathy = [];
    GEO.bathymetry.forEach(function (band) {
      var g = el('g', { 'data-depth': band.m }, svg);
      band.p.forEach(function (dd) { el('path', { d: dd, 'fill-rule': 'evenodd' }, g); });
      gBathy.push(g);
    });

    gCountries = el('g', { id: 'countries' }, svg);
    Object.keys(GEO.countries).forEach(function (iso) {
      var p = el('path', { class: 'country', d: GEO.countries[iso].d, 'fill-rule': 'evenodd' }, gCountries);
      p.dataset.iso = iso;
      el('title', {}, p).textContent = GEO.countries[iso].n;
    });

    gLakes = el('g', { id: 'lakes' }, svg);
    GEO.lakes.forEach(function (dd) { el('path', { d: dd, 'fill-rule': 'evenodd' }, gLakes); });

    gRivers = el('g', { id: 'rivers', fill: 'none' }, svg);
    el('path', { d: GEO.rivers, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gRivers);

    // Contested boundaries sit above the settled ones but below labels, dashed so
    // they never read as equivalent to an agreed border.
    gDisputed = el('g', { id: 'disputed', fill: 'none' }, svg);
    el('path', { class: 'bd-control',  d: window.PX_DISPUTED.control }, gDisputed);
    el('path', { class: 'bd-disputed', d: window.PX_DISPUTED.disputed }, gDisputed);

    gLabels = el('g', { id: 'labels' }, svg);
    gMarks = el('g', { id: 'marks' }, svg);
  }

  /* ── treatment ────────────────────────────────────────────────────── */

  function applyTreatment(key, initial) {
    // A removed lab axis returns undefined from LAB.get; falling back beats
    // throwing here, because this runs during boot and takes everything with it.
    if (!TREAT[key]) key = 'c';
    state.treatment = key;
    var t = TREAT[key], L = t.layers;
    var r = document.documentElement.style;
    r.setProperty('--map-ocean', t.ocean);
    r.setProperty('--map-land', L.landFill ? t.land : 'none');
    r.setProperty('--map-land-lit', t.landLit);
    r.setProperty('--map-border', t.border);
    r.setProperty('--map-ink', t.ink);
    r.setProperty('--map-ink-muted', t.inkMuted);
    for (var i = 1; i <= 5; i++) r.setProperty('--sev-' + i, t.sev[i]);
    document.documentElement.setAttribute('data-ground', t.ground);
    gOcean.setAttribute('fill', t.ocean);
    // the page behind the plate takes the deepest band, so the edges read as ocean
    r.setProperty('--map-void', L.bathyFill ? L.bathyFill[L.bathyFill.length - 1] : t.ocean);

    gBathy.forEach(function (g, i) {
      var asFill = !!L.bathyFill;
      var asLine = !!L.bathyLine && (!L.bathyLineAt || L.bathyLineAt.indexOf(i) !== -1);
      g.style.display = (asFill || asLine) ? '' : 'none';
      g.setAttribute('fill', asFill ? L.bathyFill[i] : 'none');
      g.setAttribute('stroke', asLine ? L.bathyLine : 'none');
      g.setAttribute('stroke-width', asLine ? (L.bathyLineWidth || 0.35) : 0);
      g.setAttribute('stroke-opacity', asLine ? (L.bathyLineOpacity || 0.8) : 0);
    });

    gCountries.setAttribute('stroke-width', L.landFill ? 0.35 : 0.5);
    gDisputed.style.display = state.disputed ? '' : 'none';
    applyDisputedStyle(state.disputedStyle);

    gLakes.setAttribute('fill', L.lakeFill);
    gLakes.setAttribute('stroke', L.lakeStroke);
    gLakes.setAttribute('stroke-width', 0.3);
    gRivers.style.display = L.rivers ? '' : 'none';
    if (L.rivers) {
      gRivers.firstChild.setAttribute('stroke', L.rivers);
      gRivers.firstChild.setAttribute('stroke-width', L.riverWidth || 0.4);
      gRivers.firstChild.setAttribute('stroke-opacity', 0.85);
    }

    if (initial) {
      var z = window.PX_START_VIEW;
      view.w = z.w;
      view.h = view.w / aspect();
      view.x = z.cx - view.w / 2;
      view.y = z.cy - view.h / 2;
    }
    buildLegend();
    applyView();
  }


  /* ── markers ──────────────────────────────────────────────────────── */

  function drawMarkers() {
    if (!gMarks) return;
    gMarks.textContent = '';
    var k = view.w / BASE.w;                 // keep marks constant on screen
    var S = sev();
    var vis = {}; visibleEvents().forEach(function (e) { vis[e.id] = true; });

    EVENTS.forEach(function (ev) {
      var r = radius(ev) * k, col = S[ev.sev];
      var g = el('g', { class: 'mk' }, gMarks);
      g.dataset.id = ev.id;
      if (!vis[ev.id]) g.classList.add('dim');
      if (state.selected === ev.id) g.classList.add('is-selected');
      if (state.hover === ev.id) g.classList.add('is-hover');

      el('circle', { class: 'sel', cx: ev.x, cy: ev.y, r: r + 7 * k, 'stroke-width': 1.6 * k }, g);

      var unreported = null;
      var L = ev.cov[state.pair[0]], R = ev.cov[state.pair[1]];

      if (encoding() === 'fill') {
        var cov = ev.cov[state.single];
        el('circle', { cx: ev.x, cy: ev.y, r: r, fill: col, 'fill-opacity': .12,
                       stroke: col, 'stroke-width': 1.4 * k, 'stroke-opacity': .75,
                       'stroke-dasharray': cov <= 0.005 ? (2.5 * k) + ' ' + (2.5 * k) : 'none' }, g);
        if (cov > 0.005) el('path', { d: discFill(ev.x, ev.y, r, cov), fill: col }, g);
        if (cov <= BLIND) unreported = pName(state.single) + ': none';

      } else {
        el('circle', { cx: ev.x, cy: ev.y, r: r, fill: col, 'fill-opacity': .12,
                       stroke: col, 'stroke-width': 1.4 * k, 'stroke-opacity': .75 }, g);
        if (L > 0.005) el('path', { d: halfFill(ev.x, ev.y, r, L, -1), fill: col }, g);
        if (R > 0.005) el('path', { d: halfFill(ev.x, ev.y, r, R, 1), fill: col }, g);
        el('line', { x1: ev.x, y1: ev.y - r, x2: ev.x, y2: ev.y + r,
                     stroke: TREAT[state.treatment].ocean, 'stroke-width': 1.4 * k, 'stroke-opacity': .9 }, g);
        if (Math.abs(L - R) > 0.25) {
          el('circle', { class: 'halo', cx: ev.x, cy: ev.y, r: r + 4.5 * k,
                         'stroke-width': k, 'stroke-dasharray': (2 * k) + ' ' + (3 * k) }, g);
        }
        if (L <= BLIND || R <= BLIND) unreported = pName(state.pair[L <= BLIND ? 0 : 1]) + ': none';

      }

      var hit = el('circle', { class: 'hit', cx: ev.x, cy: ev.y, r: Math.max(r + 10 * k, 17 * k) }, g);
      hit.setAttribute('tabindex', '0');
      hit.setAttribute('role', 'button');
      hit.setAttribute('aria-label', ev.name + ', ' + ev.where + ', severity ' + ev.sev + ' of 5');

      var t = el('text', { class: 'name', x: ev.x, y: ev.y - r - 10 * k, 'text-anchor': 'middle' }, g);
      t.style.fontSize = (11 * k) + 'px';
      t.style.strokeWidth = (3.5 * k) + 'px';
      t.textContent = ev.name;

      if (unreported) {
        var tg = el('text', { class: 'tag', x: ev.x, y: ev.y + r + 14 * k, 'text-anchor': 'middle' }, g);
        tg.style.fontSize = (9 * k) + 'px';
        tg.style.strokeWidth = (3 * k) + 'px';
        tg.textContent = unreported;
      }
    });

    litCountries();
  }

  function litCountries() {
    var s = state.selected && eventById(state.selected);
    var isos = s ? s.iso : [];
    Array.prototype.forEach.call(gCountries.children, function (p) {
      p.classList.toggle('lit', isos.indexOf(p.dataset.iso) !== -1);
    });
  }

  /* ── place labels ─────────────────────────────────────────────────── */

  /* Greedy placement: walk candidates in priority order and drop any whose box
     overlaps one already placed. Cheap, stable, and good enough at this density.
     Recomputed on every view change because what fits depends on the zoom. */
  function drawLabels() {
    gLabels.textContent = '';
    if (!state.labels) return;
    var L = window.PX_LABELS;
    var k = view.w / BASE.w;                   // viewBox units per on-screen unit
    var z = 1 / k;                             // zoom factor, 1 at world view
    var placed = [];

    function fits(x, y, w, h) {
      for (var i = 0; i < placed.length; i++) {
        var p = placed[i];
        if (x - w / 2 < p.x + p.w / 2 && x + w / 2 > p.x - p.w / 2 &&
            y - h / 2 < p.y + p.h / 2 && y + h / 2 > p.y - p.h / 2) return false;
      }
      return true;
    }
    function inView(x, y, pad) {
      return x > view.x - pad && x < view.x + view.w + pad &&
             y > view.y - pad && y < view.y + view.h + pad;
    }

    // tracked events claim their space first — nothing may cover a marker, and a
    // selected or hovered event also shows its own name, which needs the room
    EVENTS.forEach(function (ev) {
      var r = (6 + ev.sev * 2.0) * k;
      var named = ev.id === state.selected || ev.id === state.hover;
      var w = named ? Math.max(r * 2.6, ev.name.length * 11 * k * 0.6) : r * 2.6;
      placed.push({ x: ev.x, y: ev.y - (named ? r * 0.9 : 0), w: w, h: r * (named ? 5.2 : 3.4) });
    });

    // `adv` is average advance per character as a fraction of font size, including
    // letter-spacing. Country labels are tracked out 0.16em, so a naive 0.52
    // underestimates their width badly and lets neighbours overlap.
    function add(text, x, y, size, cls, dot, adv) {
      var w = text.length * size * adv, h = size * 1.3;
      if (!inView(x, y, w)) return;
      if (!fits(x, y, w, h)) return;
      placed.push({ x: x, y: y, w: w + size * 0.5, h: h + size * 0.4 });
      var t = el('text', { class: cls, x: x, y: y + (dot ? size * 1.15 : size * 0.34),
                           'text-anchor': 'middle' }, gLabels);
      t.style.fontSize = size + 'px';
      t.style.strokeWidth = (size * 0.28) + 'px';
      t.textContent = text;
      if (dot) el('circle', { class: 'city-dot', cx: x, cy: y, r: size * 0.22 }, gLabels);
    }

    // countries first: bigger polygon wins the space
    if (z >= 1.35) {
      var cSize = Math.max(6.5, Math.min(11, 5.5 + z * 0.55)) * k;
      L.countries.forEach(function (c) {
        if (c.a < 120 / (z * z)) return;        // small countries only once zoomed in
        // short form while space is tight; the full name once there is room for it
        var text = (c.s && z < 4.2) ? c.s : c.n;
        add(text.toUpperCase(), c.x, c.y, cSize, 'lbl-country', false, 0.74);
      });
    }
    // then cities, capitals and high-rank first
    if (z >= 2.6) {
      var kSize = Math.max(5.5, Math.min(9, 4.5 + z * 0.4)) * k;
      L.cities.forEach(function (c) {
        if (c.r > (c.c ? 6 : 3) + z * 0.5) return;
        add(c.n, c.x, c.y, kSize, c.c ? 'lbl-capital' : 'lbl-city', true, 0.58);
      });
    }
  }

  /* ── pan, zoom, fly ───────────────────────────────────────────────── */

  svg.addEventListener('wheel', function (e) {
    e.preventDefault();
    var p = toView(e.clientX, e.clientY);
    var newW = Math.min(Math.max(view.w * Math.exp(e.deltaY * 0.0016), BASE.w / MAX_ZOOM), BASE.w);
    var ratio = newW / view.w;
    view.x = p.x - (p.x - view.x) * ratio;
    view.y = p.y - (p.y - view.y) * ratio;
    view.w = newW;
    applyView();
  }, { passive: false });

  var drag = null;
  svg.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.mk')) return;
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
    svg.setPointerCapture(e.pointerId);
    svg.classList.add('grabbing');
  });
  svg.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var s = drawnScale();
    var dx = (e.clientX - drag.x) / s, dy = (e.clientY - drag.y) / s;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.moved = true;
    view.x = drag.vx - dx; view.y = drag.vy - dy;
    applyView(false);
  });
  function endDrag(e) {
    if (!drag) return;
    if (e && e.pointerId != null && svg.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId);
    var moved = drag.moved;
    drag = null;
    svg.classList.remove('grabbing');
    drawMarkers(); drawLabels();
    return moved;
  }
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  var tween = null;
  function flyTo(target, ms) {
    if (tween) cancelAnimationFrame(tween);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      view.x = target.x; view.y = target.y; view.w = target.w; applyView(); return;
    }
    var from = { x: view.x, y: view.y, w: view.w }, t0 = performance.now();
    (function step(now) {
      var t = Math.min((now - t0) / ms, 1), e = 1 - Math.pow(1 - t, 3);
      view.x = from.x + (target.x - from.x) * e;
      view.y = from.y + (target.y - from.y) * e;
      view.w = from.w + (target.w - from.w) * e;
      applyView();
      tween = t < 1 ? requestAnimationFrame(step) : null;
    })(performance.now());
  }
  function frameEvent(ev) {
    var w = BASE.w / 3.4, hh = w / aspect();
    // bias left so the drawer does not cover the event
    flyTo({ x: ev.x - w * 0.36, y: ev.y - hh / 2, w: w }, 500);
  }

  byId('reset-view').addEventListener('click', function () {
    var world = view.w < BASE.w - 0.5;
    if (world) flyTo({ x: 0, y: (BASE.h - BASE.w / aspect()) / 2, w: BASE.w }, 460);
    else {
      var z = window.PX_START_VIEW, w = z.w, hh = w / aspect();
      flyTo({ x: z.cx - w / 2, y: z.cy - hh / 2, w: w }, 460);
    }
    byId('reset-view').textContent = world ? 'Back to region' : 'World view';
  });

  /* ── tooltip ──────────────────────────────────────────────────────── */

  var tip = byId('tip');
  function showTip(ev, clientX, clientY) {
    var S = sev();
    tip.textContent = '';
    tip.appendChild(h('div', 'tip-name', ev.name));
    tip.appendChild(h('div', 'tip-where', ev.where + ' · severity ' + ev.sev + '/5'));
    var rows = h('div', 'tip-rows');
    PERSP.forEach(function (p) {
      var v = ev.cov[p.id];
      var row = h('div', 'tip-row' + (v <= BLIND ? ' is-blind' : ''));
      row.appendChild(h('span', 'tip-p', p.name));
      var bar = h('span', 'tip-bar');
      var f = h('i');
      f.style.width = Math.max(v * 100, v > 0 ? 2 : 0) + '%';
      f.style.background = v <= BLIND ? S[4] : S[ev.sev];
      bar.appendChild(f);
      row.appendChild(bar);
      row.appendChild(h('span', 'tip-val', Math.round(v * 100) + ''));
      rows.appendChild(row);
    });
    tip.appendChild(rows);
    tip.classList.add('on');

    var st = byId('stage').getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = clientX - st.left + 16, y = clientY - st.top + 16;
    if (x + tw > st.width - 8) x = clientX - st.left - tw - 16;
    if (y + th > st.height - 8) y = clientY - st.top - th - 16;
    tip.style.left = Math.max(8, x) + 'px';
    tip.style.top = Math.max(8, y) + 'px';
  }
  function hideTip() { tip.classList.remove('on'); }

  /* ── drawer ───────────────────────────────────────────────────────── */

  var drawer = byId('drawer');
  var dHead = byId('drawer-head');
  var dBody = byId('drawer-body');

  function openDrawer(on) {
    state.drawer = on;
    drawer.classList.toggle('open', on);
    drawer.setAttribute('aria-hidden', String(!on));
    byId('toggle-events').setAttribute('aria-pressed', String(on));
  }

  function renderDrawer() {
    if (state.selected) renderDossier(); else renderList();
  }

  function drawerHead(eyebrow, title) {
    dHead.textContent = '';
    var bar = h('div', 'drawer-bar');
    bar.appendChild(h('span', 'eyebrow', eyebrow));
    var close = h('button', 'icon-btn', '✕');
    close.setAttribute('aria-label', 'Close panel');
    close.addEventListener('click', function () { openDrawer(false); });
    bar.appendChild(close);
    dHead.appendChild(bar);
    if (title) dHead.appendChild(h('h2', 'drawer-title', title));
    return dHead;
  }

  function renderList() {
    var list = visibleEvents();
    drawerHead('Tracked events', 'Where perspectives disagree');

    var search = h('input', 'search');
    search.type = 'search';
    search.placeholder = 'Search events or places';
    search.value = state.query;
    search.setAttribute('aria-label', 'Search events');
    search.addEventListener('input', function () {
      state.query = this.value;
      var atEnd = this.selectionStart === this.value.length;
      drawMarkers(); renderList();
      var s = dHead.querySelector('.search');
      if (s) { s.focus(); if (atEnd) s.setSelectionRange(s.value.length, s.value.length); }
    });
    dHead.appendChild(search);

    var sorts = h('div', 'sorts');
    [['divergence', 'Divergence'], ['severity', 'Severity'], ['name', 'A–Z']].forEach(function (s) {
      var b = h('button', 'sort', s[1]);
      b.setAttribute('aria-pressed', String(state.sort === s[0]));
      b.addEventListener('click', function () { state.sort = s[0]; renderList(); });
      sorts.appendChild(b);
    });
    dHead.appendChild(sorts);

    dBody.textContent = '';
    if (!list.length) {
      dBody.appendChild(h('p', 'empty', state.blindOnly
        ? 'Every tracked event is being reported by all five perspectives in view.'
        : 'No event matches that search.'));
      return;
    }

    var S = sev();
    list.forEach(function (ev) {
      var row = h('button', 'row');
      row.dataset.id = ev.id;

      var sw = document.createElementNS(NS, 'svg');
      sw.setAttribute('viewBox', '0 0 26 26');
      sw.setAttribute('width', '26'); sw.setAttribute('height', '26');
      sw.setAttribute('aria-hidden', 'true');
      var col = S[ev.sev];
      el('circle', { cx: 13, cy: 13, r: 10, fill: col, 'fill-opacity': .14, stroke: col, 'stroke-width': 1.1 }, sw);
      if (encoding() === 'fill') {
        var c = ev.cov[state.single];
        if (c > 0.005) el('path', { d: discFill(13, 13, 10, c), fill: col }, sw);
      } else {
        var L = ev.cov[state.pair[0]], R = ev.cov[state.pair[1]];
        if (L > 0.005) el('path', { d: halfFill(13, 13, 10, L, -1), fill: col }, sw);
        if (R > 0.005) el('path', { d: halfFill(13, 13, 10, R, 1), fill: col }, sw);
      }
      row.appendChild(sw);

      var mid = h('div', 'row-mid');
      mid.appendChild(h('span', 'row-name', ev.name));
      mid.appendChild(h('span', 'row-where', ev.where));
      var bl = blindList(ev);
      if (bl.length) {
        mid.appendChild(h('span', 'row-blind',
          bl.length + (bl.length > 1 ? ' blindspots' : ' blindspot')));
      }
      row.appendChild(mid);

      var metric = h('span', 'row-metric');
      if (state.sort === 'severity') {
        metric.appendChild(document.createTextNode(ev.sev + '/5'));
        metric.appendChild(h('small', null, 'severity'));
      } else {
        metric.appendChild(document.createTextNode(String(Math.round(divergence(ev) * 100))));
        metric.appendChild(h('small', null, 'gap'));
      }
      row.appendChild(metric);

      row.addEventListener('click', function () { select(ev.id); });
      row.addEventListener('mouseenter', function () { setHover(ev.id); });
      row.addEventListener('mouseleave', function () { setHover(null); });
      dBody.appendChild(row);
    });

    dBody.appendChild(h('p', 'note',
      'Gap is the widest difference in coverage between any two perspectives. ' +
      'All figures here are prototype fixtures, not measured data.'));
  }

  function renderDossier() {
    var ev = eventById(state.selected);
    if (!ev) { state.selected = null; return renderList(); }
    var S = sev();

    drawerHead('Event dossier', null);
    var back = h('button', 'sort', '← All events');
    back.addEventListener('click', function () { select(null); });
    dHead.appendChild(back);

    dBody.textContent = '';

    var s1 = h('div', 'sect');
    s1.appendChild(h('h2', 'drawer-title', ev.name));
    var meta = h('p', 'dossier-meta', ev.where + '  ·  ' + ev.coords);
    meta.style.marginTop = '5px';
    s1.appendChild(meta);
    s1.appendChild(h('p', 'summary', ev.summary));
    var sv = h('div', 'sev-line');
    var dot = h('span', 'sev-dot'); dot.style.background = S[ev.sev];
    sv.appendChild(dot);
    sv.appendChild(h('span', 'sev-text', 'Severity ' + ev.sev + ' of 5'));
    var m = h('a', 'method', 'How this is scored'); m.href = '#';
    m.addEventListener('click', function (e) { e.preventDefault(); });
    sv.appendChild(m);
    s1.appendChild(sv);
    dBody.appendChild(s1);

    var s2 = h('div', 'sect');
    s2.appendChild(h('h3', null, 'Coverage by perspective'));
    var bars = h('div', 'bars');
    PERSP.forEach(function (p) {
      var v = ev.cov[p.id];
      var row = h('div', 'bar-row' + (v <= BLIND ? ' is-blind' : ''));
      row.appendChild(h('span', 'bar-name', p.name));
      var tr = h('span', 'bar-track'), f = h('span', 'bar-fill');
      f.style.width = Math.max(v * 100, v > 0 ? 1.5 : 0) + '%';
      tr.appendChild(f); row.appendChild(tr);
      row.appendChild(h('span', 'bar-val', Math.round(v * 100) + '%'));
      bars.appendChild(row);
    });
    s2.appendChild(bars);
    var bl = blindList(ev);
    if (bl.length) {
      var box = h('div', 'blindspot');
      box.appendChild(h('b', null, 'Blindspot. '));
      box.appendChild(document.createTextNode(
        'A severity ' + ev.sev + ' event that ' + bl.map(function (p) { return p.name; }).join(', ') +
        (bl.length > 1 ? ' media are' : ' media is') +
        ' effectively not reporting. Absence of coverage is a finding, not missing data.'));
      s2.appendChild(box);
    }
    dBody.appendChild(s2);

    var s3 = h('div', 'sect');
    s3.appendChild(h('h3', null, 'How each perspective frames it'));
    var fr = h('div', 'frames');
    PERSP.forEach(function (p) {
      var it = h('div', 'frame-item' + (ev.cov[p.id] <= BLIND ? ' is-blind' : ''));
      it.appendChild(h('span', 'frame-name', p.name));
      it.appendChild(h('span', 'frame-text', ev.frame[p.id]));
      fr.appendChild(it);
    });
    s3.appendChild(fr);
    dBody.appendChild(s3);

    var s4 = h('div', 'sect');
    s4.appendChild(h('h3', null, 'Recent coverage'));
    var arts = h('div', 'arts');
    ev.articles.forEach(function (a) {
      var art = h('div', 'art');
      art.appendChild(h('div', 'art-h', a.h));
      var mm = h('div', 'art-m');
      mm.appendChild(h('span', null, a.o));
      mm.appendChild(h('span', null, pName(a.p)));
      mm.appendChild(h('span', null, a.d));
      art.appendChild(mm);
      arts.appendChild(art);
    });
    s4.appendChild(arts);
    dBody.appendChild(s4);

    dBody.appendChild(h('p', 'note',
      'Framing summaries and coverage figures are prototype fixtures. In the built ' +
      'system each would carry a confidence value and a link to its sources.'));
  }

  /* ── selection + hover ────────────────────────────────────────────── */

  function select(id, fly) {
    state.selected = id;
    drawMarkers();
    if (id) { openDrawer(true); if (fly !== false) frameEvent(eventById(id)); }
    renderDrawer();
    updateStatus();
  }
  function setHover(id) {
    var was = state.hover;
    state.hover = id;
    if (was !== id) drawLabels();
    Array.prototype.forEach.call(gMarks.children, function (g) {
      g.classList.toggle('is-hover', g.dataset.id === id);
    });
    Array.prototype.forEach.call(dBody.querySelectorAll('.row'), function (r) {
      r.classList.toggle('is-hover', r.dataset.id === id);
    });
  }

  svg.addEventListener('click', function (e) {
    var g = e.target.closest('.mk');
    if (!g) return;
    select(g.dataset.id === state.selected ? null : g.dataset.id, true);
  });
  svg.addEventListener('mousemove', function (e) {
    var g = e.target.closest('.mk');
    if (g) {
      if (state.hover !== g.dataset.id) setHover(g.dataset.id);
      showTip(eventById(g.dataset.id), e.clientX, e.clientY);
    } else if (state.hover) { setHover(null); hideTip(); }
  });
  svg.addEventListener('mouseleave', function () { setHover(null); hideTip(); });
  svg.addEventListener('focusin', function (e) {
    var g = e.target.closest('.mk');
    if (!g) return;
    setHover(g.dataset.id);
    var b = e.target.getBoundingClientRect();
    showTip(eventById(g.dataset.id), b.left + b.width / 2, b.top + b.height / 2);
  });
  svg.addEventListener('focusout', function () { hideTip(); });
  svg.addEventListener('keydown', function (e) {
    var g = e.target.closest('.mk');
    if (g && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      select(g.dataset.id === state.selected ? null : g.dataset.id, true);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (byId('lab').classList.contains('open')) return toggleLab(false);
    if (state.selected) return select(null);
    if (state.drawer) openDrawer(false);
  });

  /* ── HUD: perspectives, legend, status ────────────────────────────── */

  var perspList = byId('persp-list');
  var perspSummary = byId('persp-summary');

  function renderPersp() {
    byId('persp-text').textContent = isCompare()
      ? pName(state.pair[0]) + ' vs ' + pName(state.pair[1])
      : pName(state.single);
    byId('persp-label').textContent = isCompare() ? 'Comparing' : 'Viewing through';

    perspList.textContent = '';
    PERSP.forEach(function (p) {
      var on = isCompare() ? state.pair.indexOf(p.id) !== -1 : state.single === p.id;
      var b = h('button', 'chip', p.name);
      b.setAttribute('aria-pressed', String(on));
      b.title = p.outlets;
      if (isCompare() && on) b.appendChild(h('span', 'side', state.pair[0] === p.id ? 'LEFT' : 'RIGHT'));
      b.addEventListener('click', function () {
        if (!isCompare()) state.single = p.id;
        else {
          var i = state.pair.indexOf(p.id);
          if (i === -1) state.pair = [state.pair[1], p.id];
          else state.pair = [state.pair[1 - i], state.pair[i]];
        }
        renderPersp(); buildLegend(); drawMarkers(); renderDrawer(); updateStatus();
      });
      perspList.appendChild(b);
    });
  }
  perspSummary.addEventListener('click', function () {
    var open = perspList.classList.toggle('open');
    perspSummary.setAttribute('aria-expanded', String(open));
  });

  function buildLegend() {
    var ramp = byId('sev-ramp');
    ramp.textContent = '';
    var S = sev();
    for (var i = 1; i <= 5; i++) {
      var b = h('i'); b.style.background = S[i]; b.title = 'Severity ' + i;
      ramp.appendChild(b);
    }
    var ex = byId('legend-example');
    ex.textContent = '';
    var s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 40 40'); s.setAttribute('width', '40'); s.setAttribute('height', '40');
    var col = S[4];
    el('circle', { cx: 20, cy: 20, r: 15, fill: col, 'fill-opacity': .14, stroke: col, 'stroke-width': 1.3 }, s);
    if (encoding() === 'fill') {
      el('path', { d: discFill(20, 20, 15, 0.7), fill: col }, s);
    } else {
      el('path', { d: halfFill(20, 20, 15, 0.75, -1), fill: col }, s);
      el('path', { d: halfFill(20, 20, 15, 0.2, 1), fill: col }, s);
      el('line', { x1: 20, y1: 5, x2: 20, y2: 35, stroke: TREAT[state.treatment].ocean, 'stroke-width': 1.3 }, s);
    }
    ex.appendChild(s);
    var cap = h('figcaption');
    var LN = pName(state.pair[0]), RN = pName(state.pair[1]);
    var head = encoding() === 'fill'
      ? 'Fuller disc = more coverage'
      : 'Left ' + LN + '  ·  right ' + RN;
    var body = encoding() === 'fill'
      ? 'The disc fills from the bottom with the share of ' + pName(state.single) +
        ' outlets covering that event. A full disc is saturation coverage; an empty ' +
        'dashed ring means it is not being reported at all.'
      : 'Each half fills from the bottom with the share of that side\u2019s outlets ' +
        'covering the event. The example is heavily covered on the left and barely on ' +
        'the right \u2014 a coverage dispute. A disc filled level across both halves ' +
        'means the two agree.';
    cap.appendChild(h('b', null, head));
    cap.appendChild(document.createTextNode(body));
    ex.appendChild(cap);
  }

  byId('legend-toggle').addEventListener('click', function () {
    var open = byId('legend-more').classList.toggle('open');
    this.setAttribute('aria-expanded', String(open));
    this.textContent = open ? 'Hide key' : 'What am I looking at?';
  });

  function updateStatus() {
    var list = visibleEvents();
    var blind = list.filter(function (e) { return blindList(e).length; }).length;
    byId('status').textContent = list.length + ' events · ' + blind + ' with a blindspot';
    byId('toggle-events').textContent = 'Events (' + list.length + ')';
  }

  byId('toggle-events').addEventListener('click', function () {
    if (state.drawer && !state.selected) openDrawer(false);
    else { state.selected = null; renderDrawer(); openDrawer(true); drawMarkers(); }
  });
  document.querySelectorAll('#mode button').forEach(function (b) {
    b.addEventListener('click', function () {
      state.mode = b.dataset.mode;
      document.querySelectorAll('#mode button').forEach(function (o) {
        o.setAttribute('aria-pressed', String(o === b));
      });
      renderPersp(); buildLegend(); drawMarkers(); renderDrawer(); updateStatus();
    });
  });

  byId('toggle-disputed').addEventListener('click', function () {
    state.disputed = !state.disputed;
    this.setAttribute('aria-pressed', String(state.disputed));
    gDisputed.style.display = state.disputed ? '' : 'none';
  });

  byId('toggle-labels').addEventListener('click', function () {
    state.labels = !state.labels;
    this.setAttribute('aria-pressed', String(state.labels));
    drawLabels();
  });

  var displayPanel = byId('display-panel');
  byId('toggle-display').addEventListener('click', function () {
    var open = displayPanel.hasAttribute('hidden');
    if (open) displayPanel.removeAttribute('hidden'); else displayPanel.setAttribute('hidden', '');
    this.setAttribute('aria-expanded', String(open));
  });

  // type and density are user settings, not decisions to close — both scored 90
  // and round 2 asked for type to be switchable too
  function applyDisputedStyle(key) {
    state.disputedStyle = key;
    gDisputed.setAttribute('data-style', key);
    var t = TREAT[state.treatment];
    var neutral = key === 'neutral';
    gDisputed.querySelector('.bd-disputed').setAttribute('stroke', neutral ? t.ink : t.disputed);
    gDisputed.querySelector('.bd-control').setAttribute('stroke', neutral ? t.inkMuted : t.control);
  }

  function buildDisplay() {
    var themes = byId('pick-theme');
    themes.textContent = '';
    Object.keys(TREAT).forEach(function (k) {
      var b = h('button', null, TREAT[k].name);
      b.setAttribute('aria-pressed', String(state.treatment === k));
      b.title = TREAT[k].note;
      b.addEventListener('click', function () {
        applyTreatment(k, false);
        Array.prototype.forEach.call(themes.children, function (c) {
          c.setAttribute('aria-pressed', String(c === b));
        });
        drawMarkers(); drawLabels(); renderDrawer();
      });
      themes.appendChild(b);
    });

    [['pick-type', 'data-type', [['a', 'Cartographic'], ['b', 'Editorial'], ['c', 'Technical']]],
     ['pick-density', 'data-density', [['comfortable', 'Comfortable'], ['compact', 'Compact']]]
    ].forEach(function (cfg) {
      var wrap = byId(cfg[0]); wrap.textContent = '';
      cfg[2].forEach(function (o) {
        var b = h('button', null, o[1]);
        b.setAttribute('aria-pressed',
          String(document.documentElement.getAttribute(cfg[1]) === o[0]));
        b.addEventListener('click', function () {
          document.documentElement.setAttribute(cfg[1], o[0]);
          Array.prototype.forEach.call(wrap.children, function (c) {
            c.setAttribute('aria-pressed', String(c === b));
          });
          drawMarkers();
        });
        wrap.appendChild(b);
      });
    });
  }

  byId('blind-only').addEventListener('click', function () {
    state.blindOnly = !state.blindOnly;
    this.setAttribute('aria-pressed', String(state.blindOnly));
    drawMarkers(); renderDrawer(); updateStatus();
  });

  /* ── design lab ───────────────────────────────────────────────────── */

  function toggleLab(on) {
    var lab = byId('lab');
    var open = on == null ? !lab.classList.contains('open') : on;
    lab.classList.toggle('open', open);
    lab.setAttribute('aria-hidden', String(!open));
    byId('open-lab').setAttribute('aria-expanded', String(open));
  }
  byId('open-lab').addEventListener('click', function () { toggleLab(); });
  byId('lab-close').addEventListener('click', function () { toggleLab(false); });

  function applyOption(axis, key) {
    if (axis === 'map') applyTreatment(key, true);
    if (axis === 'type') document.documentElement.setAttribute('data-type', key);
    if (axis === 'density') document.documentElement.setAttribute('data-density', key);
    if (axis === 'type' || axis === 'density') buildDisplay();
    if (axis === 'disputed') applyDisputedStyle(key);
    drawMarkers(); renderDrawer(); updateStatus();
  }

  /* ── boot ─────────────────────────────────────────────────────────── */

  buildMap();
  if (LAB.get('type')) document.documentElement.setAttribute('data-type', LAB.get('type'));
  if (LAB.get('disputed')) state.disputedStyle = LAB.get('disputed');
  applyTreatment(state.treatment, true);
  buildDisplay();
  renderPersp();
  renderDrawer();
  updateStatus();
  LAB.mount(byId('lab'), byId('toast'), applyOption);

  addEventListener('resize', function () {
    if (view.w >= BASE.w - 0.5) { view.h = view.w / aspect(); view.y = (BASE.h - view.h) / 2; }
    applyView();
  });
  byId('reset-view').textContent = 'World view';
})();
