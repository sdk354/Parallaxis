/* Design lab — switchable design options, scored across rounds.

   A round is one pass of scoring. Round 1 is baked in from js/lab-rounds.js.
   Each option carries a `since` block saying what changed since it was last
   scored, so you re-score a known delta rather than guessing what moved.

   Persists in localStorage under parallaxis.lab.v2.  */

window.PX_LAB = (function () {
  'use strict';

  var STORE = 'parallaxis.lab.v4';
  var R1 = window.PX_ROUND1;
  var R2 = window.PX_ROUND2;
  var R3 = window.PX_ROUND3;

  /* `since.kind`
       refined  — same design carried forward, so a delta is meaningful
       replaces — different design in the same slot; prior score is context only
       new      — no history

     `since.since` is the earliest round in which this key referred to THIS design.
     Slot keys get reused as options are replaced, so walking history by key alone
     silently credits one design with another's score. Defaults to 1.          */
  var AXES = [
    {
      id: 'type',
      title: 'Type pairing',
      question: 'Switchable at runtime under Display. This scores which should be the default, not which to keep.',
      options: [
        { key: 'a', name: 'Cartographic', note: 'Archivo Narrow + Newsreader.',
          since: { kind: 'refined', from: 'type:a', what: 'Unchanged since round 1.' } },
        { key: 'b', name: 'Editorial', note: 'Fraunces + Literata.',
          since: { kind: 'refined', from: 'type:b', what: 'Still the default. Unscored in round 3.' } },
        { key: 'c', name: 'Technical', note: 'Chivo throughout.',
          since: { kind: 'refined', from: 'type:c', what: 'Unchanged. Reachable from Display without opening the lab.' } }
      ]
    },
    {
      id: 'disputed',
      title: 'Contested boundaries',
      question: 'New this round. Natural Earth marks which boundary segments are not settled — Kashmir, Western Sahara, the Korean DMZ, Abyei. How should they read?',
      options: [
        { key: 'rose', name: 'Rose dashed', note: 'Long dashes for disputed claims, dotted for lines of control. Muted rose, deliberately outside the severity ramp.',
          since: { kind: 'new', what: 'Your suggestion — a faint red dashed line, pulled off pure red so it cannot be mistaken for severity.' } },
        { key: 'neutral', name: 'Neutral dashed', note: 'Same dash patterns, but in map ink with no hue at all.',
          since: { kind: 'new', what: 'Spends no colour. Safest against the rule that hue is reserved, but easier to miss.' } },
        { key: 'strong', name: 'Strong rose', note: 'Same colour, heavier weight and higher opacity.',
          since: { kind: 'new', what: 'If contested borders should be a headline feature rather than basemap detail.' } }
      ]
    }
  ];

  var DEFAULTS = { type: 'b', disputed: 'rose' };

  /* ── state ──────────────────────────────────────────────────────── */

  function fresh() {
    return {
      round: 4,
      choice: Object.assign({}, DEFAULTS),
      rounds: {
        1: { score: R1.score, note: R1.note, at: R1.at, closed: true },
        2: { score: R2.score, note: R2.note, at: R2.at, closed: true },
        3: { score: R3.score, note: R3.note, at: R3.at, closed: true },
        4: { score: {}, note: {}, at: null, closed: false }
      }
    };
  }

  var state = (function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORE));
      if (raw && raw.rounds && raw.round) return raw;
    } catch (e) {}
    return fresh();
  })();

  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  function cur() { return state.rounds[state.round]; }
  function roundList() {
    return Object.keys(state.rounds).map(Number).sort(function (a, b) { return a - b; });
  }

  // most recent scored value for an id, searching back only as far as `floor` —
  // the round from which the key has meant the same design
  function priorScore(id, before, floor) {
    for (var r = before - 1; r >= (floor || 1); r--) {
      var rd = state.rounds[r];
      if (rd && rd.score && rd.score[id] !== '' && rd.score[id] != null) {
        return { round: r, value: Number(rd.score[id]), note: (rd.note || {})[id] || '' };
      }
    }
    return null;
  }

  function totalOptions() {
    return AXES.reduce(function (n, a) { return n + a.options.length; }, 0);
  }
  function scoredCount() {
    var s = cur().score;
    return Object.keys(s).filter(function (k) { return s[k] !== '' && s[k] != null; }).length;
  }

  /* ── export ─────────────────────────────────────────────────────── */

  function toMarkdown() {
    var rounds = roundList();
    var out = ['# Parallaxis — design option scores', '',
               'Round ' + state.round + ' · ' + new Date().toISOString().slice(0, 16).replace('T', ' '), ''];

    AXES.forEach(function (axis) {
      out.push('## ' + axis.title, '');
      out.push('| Option | ' + rounds.map(function (r) { return 'R' + r; }).join(' | ') + ' | Δ | Notes this round |');
      out.push('|' + '---|'.repeat(rounds.length + 3));

      axis.options.forEach(function (o) {
        var id = axis.id + ':' + o.key;
        var cells = [o.name];
        rounds.forEach(function (r) {
          var v;
          if (r === state.round) {
            v = cur().score[id];
          } else if (o.since && o.since.kind !== 'new' && o.since.from &&
                     r >= (o.since.since || 1)) {
            // lineage, floored: a slot key alone does not prove it is the same design
            v = (state.rounds[r].score || {})[o.since.from];
          }
          if (v === '' || v == null) cells.push('—');
          else cells.push(o.since && o.since.kind === 'replaces' && r !== state.round
            ? '(' + v + ')' : String(v));
        });
        // lineage, not slot key — the two can diverge once options are replaced
        var now = cur().score[id];
        var prev = o.since && o.since.from
          ? priorScore(o.since.from, state.round, o.since.since) : null;
        var delta = '—';
        if (now !== '' && now != null && prev && o.since && o.since.kind === 'refined') {
          var dv = Number(now) - prev.value;
          delta = (dv > 0 ? '+' : '') + dv;
        }
        cells.push(delta);
        cells.push((cur().note[id] || '').replace(/\|/g, '\\|').replace(/\n/g, ' '));
        out.push('| ' + cells.join(' | ') + ' |');
      });
      out.push('');
    });

    out.push('Scores in parentheses belong to the option a slot previously held, not to the ' +
             'current design — no delta is computed across a replacement. A dash means the ' +
             'option did not exist that round.', '');

    var retired = (R1.retired || []).concat(R2.retired || [], R3.retired || []);
    if (retired.length) {
      out.push('## Retired options', '');
      retired.forEach(function (r) {
        out.push('- **' + r.name + '** (scored ' + r.score + ') — ' + r.why);
      });
      out.push('');
    }
    return out.join('\n');
  }

  function copyExport() {
    var md = toMarkdown();
    function done(ok) { toast(ok ? 'Round ' + state.round + ' copied as Markdown' : 'Copy failed — use Download'); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(md).then(function () { done(true); }, function () { done(false); });
    } else {
      var ta = document.createElement('textarea');
      ta.value = md; document.body.appendChild(ta); ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); done(ok);
    }
  }

  function downloadExport() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'parallaxis-scores-round' + state.round + '.json';
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 200);
    toast('Downloaded round ' + state.round);
  }

  var toastEl;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove('on'); }, 2800);
  }

  /* ── render ─────────────────────────────────────────────────────── */

  function h(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  var onChange = function () {};
  var countEl, rootEl;

  function refreshCount() {
    if (!countEl) return;
    countEl.textContent = 'R' + state.round + ' · ' + scoredCount() + '/' + totalOptions();
    var rounds = roundList();
    rootEl.querySelector('[data-act="prev-round"]').disabled = rounds.indexOf(state.round) === 0;
    rootEl.querySelector('[data-act="next-round"]').disabled =
      rounds.indexOf(state.round) === rounds.length - 1;
  }

  function deltaLine(o, id) {
    var wrap = h('span', 'opt-since');
    var prev = o.since && o.since.from
      ? priorScore(o.since.from, state.round, o.since.since) : null;

    if (o.since && o.since.kind === 'new') {
      wrap.appendChild(h('b', 'tag tag-new', 'NEW'));
    } else if (prev) {
      wrap.appendChild(h('b', 'tag ' + (o.since.kind === 'replaces' ? 'tag-repl' : 'tag-prev'),
        'R' + prev.round + ' ' + prev.value + (o.since.kind === 'replaces' ? ' replaced' : '')));
      var now = cur().score[id];
      if (o.since.kind === 'refined' && now !== '' && now != null) {
        var dv = Number(now) - prev.value;
        wrap.appendChild(h('b', 'tag tag-delta ' + (dv > 0 ? 'up' : dv < 0 ? 'down' : 'flat'),
          dv > 0 ? '▲ +' + dv : dv < 0 ? '▼ ' + dv : '● 0'));
      }
    }
    if (o.since && o.since.what) wrap.appendChild(document.createTextNode(o.since.what));
    return wrap;
  }

  function render() {
    var body = rootEl.querySelector('.lab-body');
    body.textContent = '';

    var intro = h('div', 'lab-intro');
    intro.appendChild(h('b', null, 'Round ' + state.round + '. '));
    intro.appendChild(document.createTextNode(
      'Each option says what changed since you last scored it, so you are judging a known ' +
      'delta rather than starting over. Scores save as you type. Copy gives a Markdown table ' +
      'with every round side by side.'));
    if (cur().closed) {
      var ro = h('p', 'lab-warn', 'This round is closed. Anything you type still saves, but ' +
        'it was already exported — use New round for a fresh pass.');
      intro.appendChild(ro);
    }
    body.appendChild(intro);

    AXES.forEach(function (axis) {
      var sec = h('section', 'axis');
      sec.appendChild(h('h3', null, axis.title));
      sec.appendChild(h('p', 'axis-q', axis.question));

      axis.options.forEach(function (o) {
        var id = axis.id + ':' + o.key;
        var wrap = h('div', 'opt');

        var pick = h('button', 'opt-pick');
        pick.setAttribute('aria-pressed', String(state.choice[axis.id] === o.key));
        pick.appendChild(h('span', 'opt-dot'));
        var lab = h('span', 'opt-label');
        var nm = h('span', 'opt-name');
        nm.appendChild(h('span', 'opt-key', o.key.toUpperCase() + ' · '));
        nm.appendChild(document.createTextNode(o.name));
        lab.appendChild(nm);
        lab.appendChild(h('span', 'opt-note', o.note));
        lab.appendChild(deltaLine(o, id));
        pick.appendChild(lab);
        pick.addEventListener('click', function () {
          state.choice[axis.id] = o.key;
          save();
          Array.prototype.forEach.call(sec.querySelectorAll('.opt-pick'), function (b) {
            b.setAttribute('aria-pressed', String(b === pick));
          });
          onChange(axis.id, o.key);
        });
        wrap.appendChild(pick);

        var score = h('input', 'score');
        score.type = 'number'; score.min = 0; score.max = 100; score.step = 1;
        score.placeholder = '–';
        score.value = cur().score[id] != null ? cur().score[id] : '';
        score.setAttribute('aria-label', 'Score ' + o.name + ' out of 100, round ' + state.round);
        if (score.value !== '') score.classList.add('filled');
        score.addEventListener('input', function () {
          var v = this.value === '' ? '' : Math.max(0, Math.min(100, Number(this.value)));
          if (v !== '' && this.value !== String(v)) this.value = v;
          cur().score[id] = v;
          this.classList.toggle('filled', v !== '');
          save(); refreshCount();
          var line = wrap.querySelector('.opt-since');
          if (line) wrap.querySelector('.opt-label').replaceChild(deltaLine(o, id), line);
        });
        wrap.appendChild(score);

        var noteBtn = h('button', 'note-btn', '✎');
        noteBtn.title = 'Note'; noteBtn.setAttribute('aria-expanded', 'false');
        noteBtn.setAttribute('aria-label', 'Note about ' + o.name);
        if (cur().note[id]) noteBtn.classList.add('has-note');
        wrap.appendChild(noteBtn);

        var box = h('textarea', 'note-box');
        var p = o.since && o.since.from
          ? priorScore(o.since.from, state.round, o.since.since) : null;
        box.placeholder = p && p.note ? 'R' + p.round + ': “' + p.note + '”' : 'What works, what does not…';
        box.value = cur().note[id] || '';
        box.addEventListener('input', function () {
          cur().note[id] = this.value;
          noteBtn.classList.toggle('has-note', !!this.value);
          save();
        });
        noteBtn.addEventListener('click', function () {
          var open = box.classList.toggle('open');
          noteBtn.setAttribute('aria-expanded', String(open));
          if (open) box.focus();
        });
        if (cur().note[id]) box.classList.add('open');
        wrap.appendChild(box);

        sec.appendChild(wrap);
      });
      body.appendChild(sec);
    });

    var retired = (R1.retired || []).concat(R2.retired || [], R3.retired || []);
    if (retired.length) {
      var ret = h('section', 'axis');
      ret.appendChild(h('h3', null, 'Retired'));
      ret.appendChild(h('p', 'axis-q', 'Options removed between rounds, and why. Kept so the history stays readable.'));
      retired.forEach(function (r) {
        var item = h('div', 'retired');
        var head = h('div', 'retired-h');
        head.appendChild(h('span', 'retired-n', r.name));
        head.appendChild(h('span', 'retired-s', 'scored ' + r.score));
        item.appendChild(head);
        item.appendChild(h('p', 'retired-w', r.why));
        ret.appendChild(item);
      });
      body.appendChild(ret);
    }

    refreshCount();
  }

  /* ── rounds ─────────────────────────────────────────────────────── */

  function newRound() {
    if (!scoredCount()) { toast('Score something before starting a new round'); return; }
    var last = roundList()[roundList().length - 1];
    if (state.round !== last) { toast('Go to round ' + last + ' first'); return; }
    cur().closed = true;
    cur().at = new Date().toISOString().slice(0, 16).replace('T', ' ');
    state.round = last + 1;
    state.rounds[state.round] = { score: {}, note: {}, at: null, closed: false };
    save(); render();
    toast('Round ' + state.round + ' started · round ' + last + ' kept');
  }

  function gotoRound(delta) {
    var rounds = roundList();
    var i = rounds.indexOf(state.round) + delta;
    if (i < 0 || i >= rounds.length) return;
    state.round = rounds[i];
    save(); render();
  }

  /* ── mount ──────────────────────────────────────────────────────── */

  function mount(root, toastNode, changeHandler) {
    rootEl = root;
    onChange = changeHandler || onChange;
    toastEl = toastNode;
    countEl = root.querySelector('.lab-count');
    render();
    root.querySelector('[data-act="copy"]').addEventListener('click', copyExport);
    root.querySelector('[data-act="download"]').addEventListener('click', downloadExport);
    root.querySelector('[data-act="new-round"]').addEventListener('click', newRound);
    root.querySelector('[data-act="prev-round"]').addEventListener('click', function () { gotoRound(-1); });
    root.querySelector('[data-act="next-round"]').addEventListener('click', function () { gotoRound(1); });
  }

  return {
    mount: mount,
    get: function (axis) { return state.choice[axis]; },
    axes: AXES,
    toast: toast
  };
})();
