/* Психостоматология №1 — живая карта-граф. Без зависимостей. */
(function () {
  'use strict';

  var IMG = './assets/img/';
  var TOOTH = IMG + '66623166-icons8-tooth-100.png';
  // иконки для свёрнутых разделов (молекула)
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
  var ICON_DOC = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/></svg>';

  // ---------- Данные ----------
  // hub: разделы; leaf: сателлиты разделов; sub: сателлит сателлита
  var HUBS = [
    { id: 'psy', hash: '', title: 'Психостоматология №1', mini: '', icon: TOOTH,
      desc: 'с 2020 меняем представление о работе с зубами<br><br>работаем с зубами через отношения, а с отношениями - через зубы',
      draft: true },
    { id: 'uslugi', hash: 'uslugi', title: 'Услуги', mini: '$',
      desc: 'Просто начни с бесплатной диагностики',
      btn: { text: 'Записаться', href: 'https://t.me/happinessguy' } },
    { id: 'blog', hash: 'blog', title: 'Блог', mini: 'Б', svg: ICON_DOC,
      desc: '11 статей на темы от нейрофизиологии отношений до сепарации и нарциссических манипуляций',
      draft: true },
    { id: 'efiry', hash: 'efiry', title: 'Эфиры', mini: 'Э', svg: ICON_PLAY,
      desc: 'Эфиры на темы от… до…, но в общем на тему…',
      draft: true },
    { id: 'vopros', hash: 'vopros', title: 'Задать вопрос', mini: '?',
      desc: 'Кому задать вопрос?' }
  ];
  // угол, в который уходит «молекула», когда раздел в центре (sx, sy: -1 лево/верх, 1 право/низ)
  var CORNER = { blog: [-1, 1], efiry: [-1, -1], uslugi: [1, 1], vopros: [1, -1] };
  // позиции разделов вокруг центра на главной (по эскизу 1)
  var HOME_POS = { uslugi: [-1, -1], blog: [1, -1], efiry: [1, 1], vopros: [-1, 1] };

  var LEAVES = [
    { id: 'diag',   parent: 'uslugi', label: 'Бесплатная диагностика', inner: '0 ₽', detail: 'd-diag', sun: true },
    { id: 'cons',   parent: 'uslugi', label: 'Первичная консультация', inner: '2 500 ₽', detail: 'd-cons' },
    { id: 'vip',    parent: 'uslugi', label: 'VIP-консультация', inner: '30 000 ₽', detail: 'd-vip' },
    { id: 'group',  parent: 'uslugi', label: 'Групповая работа', inner: '15 000 ₽<br>/ мес', detail: 'd-group' },
    { id: 'clinic', parent: 'uslugi', label: 'Сотрудничество с клиниками и стоматологами', inner: '🦷', detail: 'd-clinic' },
    { id: 'kungfu', parent: 'group', sub: true, label: 'Зубное кунг-фу', inner: '', detail: 'd-kungfu' },

    { id: 'a1',  parent: 'blog', label: 'Как с зубами, так и с людьми', href: './tpost/2b5z7y31y1-kak-s-zubami-tak-i-s-lyudmi/', img: '63343139-pexels-karolina-grab.jpg' },
    { id: 'a2',  parent: 'blog', label: 'Нейрофизиология отношений', href: './tpost/4pg2djogx1-neirofiziologiya-otnoshenii/', img: '33373232-robina-weermeijer-3K.jpg' },
    { id: 'a3',  parent: 'blog', label: 'Работа с зубами через отношения', href: './tpost/xg83um4a61-rabota-s-zubami-cherez-otnosheniya/', img: '66316361-priscilla-du-preez-x.jpg' },
    { id: 'a4',  parent: 'blog', label: '3 нарциссические манипуляции для роста зубов', href: './tpost/5kuc10joi1-3-nartsissicheskie-manipulyatsii-dlya-ro/', img: '65336437-photo.jpg' },
    { id: 'a5',  parent: 'blog', label: 'Признаки лимбической коммуникации', href: './tpost/fkoyrnydv1-priznaki-limbicheskoi-kommunikatsii/', img: '34646366-pexels-timur-weber-8.jpg' },
    { id: 'a6',  parent: 'blog', label: 'От малодушия к смирению. Сокровища и ядовитые змеи.', href: './tpost/jg9p8c63y1-ot-malodushiya-k-smireniyu-sokrovischa-i/', img: '62353565-image_2025-03-01_205.png' },
    { id: 'a7',  parent: 'blog', label: 'Страшная история 21 зуба. Папаша-то твой козлом был.', href: './tpost/9784akp351-strashnaya-istoriya-21-zuba-papasha-to-t/', img: '39356164-pexels-cottonbro-660.jpg' },
    { id: 'a8',  parent: 'blog', label: 'Зубы и бесконечная борьба зла с добром.', href: './tpost/hick2ydx31-zubi-i-beskonechnaya-borba-zla-s-dobrom/', img: '35376361-pexels-seurafrancis9.jpg' },
    { id: 'a9',  parent: 'blog', label: 'Третья сепарация', href: './tpost/separation/', img: '38663039-getty-images--Nf8tXG.jpg' },
    { id: 'a10', parent: 'blog', label: 'Инструкция по эксплуатации "БЕЗЗУБЫХ".', href: './tpost/havefun/', img: '65333466-leary_circumplex_lig.png' },
    { id: 'a11', parent: 'blog', label: 'Закрой свой рот! Ты слишком ...', href: './tpost/shutup/', img: '63646561-21____.jpg' },

    { id: 'admin', parent: 'vopros', label: 'Администратору', inner: '✉️', href: 'https://t.me/psyteeth' },
    { id: 'anton', parent: 'vopros', label: 'Антону Казакову, создателю', inner: 'АК', href: 'https://t.me/happinessguy' },
    { id: 'bot',   parent: 'vopros', label: 'Драма Киллер Боту — про отношения и зубы', inner: '🤖', href: 'https://t.me/dramakiller_bot' },
    { id: 'chat',  parent: 'vopros', label: 'В чате психостоматологии', inner: '💬', href: 'https://t.me/psy_teeth' }
  ];
  for (var e = 1; e <= 9; e++) {
    LEAVES.push({ id: 'e' + e, parent: 'efiry', label: 'Эфир ' + e, inner: '▶', detail: 'd-efir', placeholder: true });
  }

  // ---------- DOM ----------
  var stage = document.getElementById('stage');
  var svg = document.getElementById('links');
  var host = document.getElementById('nodes');
  var modal = document.getElementById('modal');
  var modalBody = modal.querySelector('.modal__body');
  document.documentElement.classList.add('js');

  var nodes = {};   // id -> node state
  var order = [];
  var edges = [];   // [a, b]

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function addNode(def, kind) {
    var n = { def: def, kind: kind, id: def.id, x: 0, y: 0, r: 0, op: 0, t: null,
      phase: Math.random() * Math.PI * 2, amp: 0 };
    var root;
    if (kind === 'hub') {
      root = el('div', 'node node--hub');
      root.setAttribute('role', 'button');
      root.tabIndex = 0;
      root.setAttribute('aria-label', def.title);
      var disc = el('div', 'disc');
      var full = el('div', 'v-full');
      full.appendChild(el('div', 'h', def.title));
      if (def.desc) full.appendChild(el('div', 'd' + (def.draft ? ' draft' : ''), def.desc));
      if (def.btn) {
        var b = el('a', 'cta', def.btn.text);
        b.href = def.btn.href; b.target = '_blank'; b.rel = 'noopener';
        b.addEventListener('click', function (ev) { ev.stopPropagation(); });
        full.appendChild(b);
      }
      disc.appendChild(full);
      disc.appendChild(el('div', 'v-mid', def.title));
      var mini = el('div', 'v-mini');
      if (def.icon) { var im = el('img'); im.src = def.icon; im.alt = ''; mini.appendChild(im); }
      else if (def.svg) mini.innerHTML = def.svg;
      else mini.textContent = def.mini;
      disc.appendChild(mini);
      root.appendChild(disc);
      root.addEventListener('click', function () { go(def.id); });
      root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(def.id); }
      });
    } else {
      var ext = def.href && /^https?:/.test(def.href);
      root = el(def.href ? 'a' : 'button', 'node node--leaf' + (def.sun ? ' is-sun' : '') + (def.img ? ' has-img' : '') + (def.placeholder ? ' is-ph' : ''));
      if (def.href) { root.href = def.href; if (ext) { root.target = '_blank'; root.rel = 'noopener'; } }
      else root.type = 'button';
      root.setAttribute('aria-label', def.label);
      root.title = def.label;
      var d2 = el('span', 'disc');
      if (def.img) d2.style.backgroundImage = "url('" + IMG + def.img + "')";
      else d2.appendChild(el('span', 'in' + ((def.inner || '').length <= 2 ? ' in--big' : ''), def.inner || ''));
      root.appendChild(d2);
      root.appendChild(el('span', 'lab', def.label));
      if (def.detail) root.addEventListener('click', function () { openDetail(def.detail); });
    }
    root.dataset.id = def.id;
    n.el = root;
    n.disc = root.querySelector('.disc');
    host.appendChild(root);
    nodes[def.id] = n;
    order.push(n);
    return n;
  }

  HUBS.forEach(function (h) { addNode(h, 'hub'); });
  LEAVES.forEach(function (l) { addNode(l, 'leaf'); });
  HUBS.forEach(function (h) { if (h.id !== 'psy') edges.push(['psy', h.id]); });
  LEAVES.forEach(function (l) { edges.push([l.parent, l.id]); });
  edges.forEach(function (ed) {
    ed.line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    svg.appendChild(ed.line);
  });

  function topHub(l) {
    var p = l.parent;
    while (nodes[p] && nodes[p].kind === 'leaf') p = nodes[p].def.parent;
    return p;
  }
  function childrenOf(pid) { return LEAVES.filter(function (l) { return l.parent === pid; }); }
  function subsOf(pid) {
    var out = [];
    childrenOf(pid).forEach(function (c) { childrenOf(c.id).forEach(function (s) { out.push(s); }); });
    return out;
  }

  // ---------- Раскладка ----------
  var active = 'psy';
  var W = 0, H = 0, mobile = false;

  function set(id, x, y, r, op, mode, lab) {
    nodes[id].t = { x: x, y: y, r: r, op: op, mode: mode || '', lab: lab || '' };
  }

  function layout() {
    W = document.documentElement.clientWidth || window.innerWidth;
    mobile = W < 700;
    H = Math.max(window.innerHeight, mobile ? 560 : 620);
    var stageH = H;

    if (active === 'psy') stageH = layoutHome();
    else if (active === 'focus') stageH = layoutFocus();
    else stageH = layoutSection(active);

    stage.style.height = stageH + 'px';
    svg.setAttribute('width', W);
    svg.setAttribute('height', stageH);
    order.forEach(function (n) {
      var cls = n.el.className.replace(/\s?(m-\w+|lab-\w)/g, '');
      n.el.className = cls + (n.t.mode ? ' m-' + n.t.mode : '') + (n.t.lab ? ' lab-' + n.t.lab : '');
      n.el.tabIndex = n.t.op > 0.5 ? 0 : -1;
      n.el.setAttribute('aria-hidden', n.t.op > 0.5 ? 'false' : 'true');
      n.amp = n.t.r > 80 ? 3 : (n.t.r > 20 ? 4 : 2.5);
    });
  }

  function layoutHome() {
    var cx = W / 2, cy = H / 2 + (mobile ? 10 : 15);
    var m = Math.min(W, H);
    var R = mobile ? W * 0.27 : m * 0.19;
    var hubR = mobile ? W * 0.13 : m * 0.085;
    var dx = mobile ? W * 0.3 : Math.min(W * 0.26, 360);
    var dy = mobile ? H * 0.28 : H * 0.28;
    set('psy', cx, cy, R, 1, 'full');

    ['uslugi', 'blog', 'efiry', 'vopros'].forEach(function (id) {
      var p = HOME_POS[id];
      var hx = cx + p[0] * dx, hy = cy + p[1] * dy;
      set(id, hx, hy, hubR, 1, 'mid');
      var kids = childrenOf(id);
      // сателлиты симметрично по кругу; полшага от линии к центру, чтобы не садиться на неё
      var toCenter = Math.atan2(cy - hy, cx - hx);
      var big = id === 'uslugi' || id === 'vopros';
      var labelled = !mobile && big;
      var lr = mobile ? (big ? 5.5 : 3.5) : (big ? 14 : 7);
      var dist = hubR + (mobile ? (big ? 16 : 12) : (big ? 40 : 26));
      kids.forEach(function (k, i) {
        var a = toCenter + Math.PI * 2 * (i + 0.5) / kids.length;
        var x = hx + Math.cos(a) * dist, y = hy + Math.sin(a) * dist;
        var side = Math.cos(a) < 0 ? 'l' : 'r';
        set(k.id, x, y, lr, 1, 'dot', labelled ? side : '');
        childrenOf(k.id).forEach(function (s) {
          var off = lr + (labelled ? 26 : 10);
          set(s.id, x + Math.cos(a) * off, y + Math.sin(a) * off, lr * 0.6, 1, 'dot', labelled ? side : '');
        });
      });
    });
    return H;
  }

  // «Психостоматология» крупно в центре, разделы маленькими по своим углам
  function layoutFocus() {
    var cx = W / 2, cy = H / 2;
    var m = Math.min(W, H);
    var R = mobile ? W * 0.43 : m * 0.34;
    var hr = mobile ? 26 : 44;
    var px = mobile ? 40 : 120, py = mobile ? 70 : 100;
    set('psy', cx, cy, R, 1, 'full');
    ['uslugi', 'blog', 'efiry', 'vopros'].forEach(function (id) {
      var p = HOME_POS[id];
      var hx = p[0] < 0 ? px : W - px, hy = p[1] < 0 ? py : H - py;
      set(id, hx, hy, hr, 1, mobile ? 'mini' : 'mid');
      LEAVES.forEach(function (l) { if (topHub(l) === id) set(l.id, hx, hy, 0, 0, 'dot'); });
    });
    return H;
  }

  // n точек на эллипсе с равным шагом по длине дуги, начиная с полушага от угла a0
  function evenOnEllipse(rx, ry, n, a0) {
    var N = 720, cum = [0], px = rx * Math.cos(a0), py = ry * Math.sin(a0), i;
    for (i = 1; i <= N; i++) {
      var t = a0 + 2 * Math.PI * i / N, x = rx * Math.cos(t), y = ry * Math.sin(t);
      cum.push(cum[i - 1] + Math.hypot(x - px, y - py)); px = x; py = y;
    }
    var total = cum[N], out = [], j = 0;
    for (i = 0; i < n; i++) {
      var target = total * (i + 0.5) / n;
      while (cum[j] < target) j++;
      out.push(a0 + 2 * Math.PI * j / N);
    }
    return out;
  }

  function layoutSection(id) {
    var c = CORNER[id];
    var m = Math.min(W, H);
    var pad = mobile ? 46 : 92;
    // молекула в углу
    var mx, my;
    if (mobile) { mx = c[0] < 0 ? pad : W - pad; my = 58; }
    else { mx = c[0] < 0 ? pad : W - pad; my = c[1] < 0 ? pad + 10 : H - pad; }
    var tr = mobile ? 22 : 30, sr = mobile ? 13 : 17, sd = mobile ? 34 : 50;
    set('psy', mx, my, tr, 1, 'mini');
    var others = ['uslugi', 'blog', 'efiry', 'vopros'].filter(function (h) { return h !== id; });
    // сателлиты молекулы — веером в сторону от угла
    var away = Math.atan2(-c[1], -c[0]);
    if (mobile) away = Math.atan2(1, -c[0]);
    others.forEach(function (h, i) {
      var a = away + Math.PI - 1.15 + i * 1.15;
      set(h, mx + Math.cos(a) * sd, my + Math.sin(a) * sd, sr, 1, 'mini');
      LEAVES.forEach(function (l) {
        if (topHub(l) === h) set(l.id, mx + Math.cos(a) * sd, my + Math.sin(a) * sd, 0, 0, 'dot');
      });
    });

    var kids = childrenOf(id);
    var subs = subsOf(id);

    // раздел в центре, его сателлиты — лучами вокруг (как на эскизах), каждый связан с центром
    var n = kids.length;
    var cx2, cy2, rx, ry, leafR, Rc, stageH = H;
    if (mobile) {
      leafR = n > 6 ? 30 : 40;
      var top = 104;                       // ниже молекулы
      ry = Math.max(200, n * 31, (H - top - 2 * leafR - 70) / 2);
      rx = W / 2 - 62;
      cx2 = W / 2; cy2 = top + leafR + ry;
      Rc = Math.min(W * 0.24, rx - leafR - 12);
      stageH = cy2 + ry + leafR + 60;
    } else {
      cx2 = W / 2; cy2 = H / 2;
      ry = H / 2 - 64 - 52;
      rx = Math.min(W / 2 - 150, ry * 1.55);
      leafR = Math.max(30, Math.min(56, (2 * Math.PI * ry / n) * 0.3));
      Rc = Math.min(m * 0.21, ry - leafR - 24);
    }
    set(id, cx2, cy2, Rc, 1, 'full');
    // не ставить листья на линию к молекуле
    var toMol = Math.atan2(my - cy2, mx - cx2);
    var angles = evenOnEllipse(rx, ry, n, toMol);
    kids.forEach(function (k, i) {
      var a = angles[i];
      var x = cx2 + Math.cos(a) * rx, y = cy2 + Math.sin(a) * ry;
      set(k.id, x, y, leafR, 1, 'ring', 'b');
      childrenOf(k.id).forEach(function (s) {
        var sr = leafR * (mobile ? 0.7 : 0.62);
        var dir = Math.cos(a) >= 0 ? 1 : -1;
        var sx = x + dir * (leafR + (mobile ? 44 : 62));
        sx = Math.max(sr + 50, Math.min(W - sr - 50, sx));
        var sy = mobile ? y - leafR - sr - 34 : y - 30;
        if (mobile && Math.abs(sx - x) < leafR + sr) sx = x - dir * (leafR + sr + 30);
        set(s.id, sx, sy, sr, 1, 'ring', 'b');
      });
    });
    return stageH;
  }

  // ---------- Анимация ----------
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var first = true;

  function frame(ts) {
    var k = first || reduce ? 1 : 0.085;
    first = false;
    var t = ts / 1000;
    order.forEach(function (n) {
      var g = n.t;
      n.x += (g.x - n.x) * k; n.y += (g.y - n.y) * k;
      n.r += (g.r - n.r) * k; n.op += (g.op - n.op) * k;
      var fx = reduce ? 0 : Math.sin(t * 0.7 + n.phase) * n.amp;
      var fy = reduce ? 0 : Math.cos(t * 0.55 + n.phase * 1.3) * n.amp;
      n.dx = n.x + fx; n.dy = n.y + fy;
      n.el.style.transform = 'translate(' + n.dx.toFixed(1) + 'px,' + n.dy.toFixed(1) + 'px)';
      n.el.style.opacity = n.op.toFixed(3);
      n.el.style.setProperty('--r', n.r.toFixed(1));
      n.el.style.pointerEvents = n.op > 0.5 ? '' : 'none';
    });
    edges.forEach(function (ed) {
      var a = nodes[ed[0]], b = nodes[ed[1]];
      var op = Math.min(a.op, b.op);
      ed.line.setAttribute('x1', a.dx.toFixed(1)); ed.line.setAttribute('y1', a.dy.toFixed(1));
      ed.line.setAttribute('x2', b.dx.toFixed(1)); ed.line.setAttribute('y2', b.dy.toFixed(1));
      ed.line.setAttribute('opacity', (op * 0.55).toFixed(3));
    });
    requestAnimationFrame(frame);
  }

  // ---------- Навигация ----------
  function idFromHash() {
    var h = location.hash.replace('#', '');
    if (h === 'psy') return 'focus';   // «Психостоматология» крупно по центру
    for (var i = 0; i < HUBS.length; i++) if (HUBS[i].hash && HUBS[i].hash === h) return HUBS[i].id;
    return 'psy';
  }
  function go(id) {
    // клик по большому кругу на главной — увеличить его; повторный — вернуть главную
    if (id === 'psy' && active === 'psy') { location.hash = 'psy'; return; }
    if (id === active) return;
    var hub = HUBS.filter(function (h) { return h.id === id; })[0];
    var hash = hub.hash ? '#' + hub.hash : location.pathname + location.search;
    if (hub.hash) location.hash = hub.hash;
    else { history.pushState(null, '', hash); apply(); }
  }
  function apply() {
    active = idFromHash();
    document.body.dataset.active = active;
    layout();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', apply);
  window.addEventListener('popstate', apply);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 80); });

  // ---------- Модалка ----------
  function openDetail(id) {
    var src = document.getElementById(id);
    if (!src) return;
    modalBody.innerHTML = src.innerHTML;
    if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
  }
  function closeModal() { if (modal.close) modal.close(); else modal.removeAttribute('open'); }
  modal.querySelector('.modal__close').addEventListener('click', closeModal);
  modal.addEventListener('click', function (ev) { if (ev.target === modal) closeModal(); });

  // ---------- Старт ----------
  active = idFromHash();
  document.body.dataset.active = active;
  layout();
  order.forEach(function (n) { n.x = n.t.x; n.y = n.t.y; n.r = n.t.r; n.op = n.t.op; });
  requestAnimationFrame(frame);
})();
