/* Психостоматология №1 — живая карта-граф. Без зависимостей. */
(function () {
  'use strict';

  var IMG = './assets/img/';
  var TOOTH = IMG + '66623166-icons8-tooth-100.png';
  // зубик-контур (Tabler Icons «dental», MIT): белый с тёмной обводкой, чтобы читался на жёлтом
  var ICON_TOOTH = '<svg viewBox="0 0 24 24" fill="#fff" stroke="#1b1b1b" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 5.5c-1.074 -.586 -2.583 -1.5 -4 -1.5c-2.1 0 -4 1.247 -4 5c0 4.899 1.056 8.41 2.671 10.537c.573 .756 1.97 .521 2.567 -.236c.398 -.505 .819 -1.439 1.262 -2.801c.292 -.771 .892 -1.504 1.5 -1.5c.602 0 1.21 .737 1.5 1.5c.443 1.362 .864 2.295 1.262 2.8c.597 .759 2 .993 2.567 .237c1.615 -2.127 2.671 -5.637 2.671 -10.537c0 -3.74 -1.908 -5 -4 -5c-1.423 0 -2.92 .911 -4 1.5z"/>' +
    '<path d="M12 5.5l3 1.5" fill="none"/></svg>';
  // подсказка «нажми» в центральном круге на главной
  // палец с «кликом» (рисунок по мотивам Tabler Icons «hand-click», MIT)
  var ICON_TAP = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g class="hand"><path d="M8 13v-8.5a1.5 1.5 0 0 1 3 0v7.5"/><path d="M11 11.5v-2a1.5 1.5 0 0 1 3 0v2.5"/><path d="M14 10.5a1.5 1.5 0 0 1 3 0v1.5"/><path d="M17 11.5a1.5 1.5 0 0 1 3 0v4.5a6 6 0 0 1 -6 6h-2h.208a6 6 0 0 1 -5.012 -2.7l-.196 -.3c-.312 -.479 -1.407 -2.388 -3.286 -5.728a1.5 1.5 0 0 1 .536 -2.022a1.867 1.867 0 0 1 2.28 .28l1.47 1.47"/></g><g class="rays"><path d="M5 3l-1 -1"/><path d="M4 7h-1"/><path d="M14 3l1 -1"/><path d="M15 6h1"/></g></svg>';
  // иконки-аватарки для «Задать вопрос»
  var AV_TG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#29a9eb"/><path d="M5.4 11.7l11.4-4.4c.53-.2 1 .13.83.93l-1.94 9.13c-.14.65-.53.8-1.07.5l-2.96-2.18-1.43 1.38c-.16.16-.29.29-.6.29l.21-3.02 5.5-4.97c.24-.21-.05-.33-.37-.12l-6.8 4.28-2.93-.92c-.64-.2-.65-.64.13-.94z" fill="#fff"/></svg>';
  var AV_BOT = '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="12" y1="2.6" x2="12" y2="6" stroke="#1b1b1b" stroke-width="1.3"/><circle cx="12" cy="2.6" r="1.4" fill="#ff5136"/><rect x="4.5" y="6" width="15" height="12" rx="3.5" fill="#cfd8dc" stroke="#1b1b1b" stroke-width="1.2"/><rect x="2.6" y="10" width="1.9" height="4.4" rx=".9" fill="#1b1b1b"/><rect x="19.5" y="10" width="1.9" height="4.4" rx=".9" fill="#1b1b1b"/><circle cx="9.2" cy="11.3" r="1.7" fill="#00a1c9"/><circle cx="14.8" cy="11.3" r="1.7" fill="#00a1c9"/><path d="M9 15h6" stroke="#1b1b1b" stroke-width="1.2" stroke-linecap="round"/><rect x="8" y="18.6" width="8" height="2.6" rx="1" fill="#cfd8dc" stroke="#1b1b1b" stroke-width="1"/></svg>';
  // иконки для свёрнутых разделов (молекула)
  var ICON_PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>';
  var ICON_DOC = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/></svg>';

  // ---------- Данные ----------
  // hub: разделы; leaf: сателлиты разделов; sub: сателлит сателлита
  var HUBS = [
    { id: 'psy', hash: '', title: 'Психостоматология №1', mini: '', icon: TOOTH, tap: true },   // раскрытый вид — блок PSYX ниже
    { id: 'uslugi', hash: 'uslugi', title: 'Услуги', mini: '$',
      desc: 'Если тебя что-то беспокоит с зубами, деснами, прикусом, кривизной, просто приходи на бесплатную диагностику',
      btn: { text: 'Записаться', detail: 'd-diag' }, roomy: 0.3 },   // кнопка открывает окно бесплатной диагностики (запись там — через Марию)
    { id: 'blog', hash: 'blog', title: 'Блог', mini: 'Б', svg: ICON_DOC,
      desc: '11 статей на темы от нейрофизиологии отношений до третьей сепарации, а в общем — о том, как зубы отзываются на то, что происходит между людьми' },
    { id: 'efiry', hash: 'efiry', title: 'Эфиры', mini: 'Э', svg: ICON_PLAY,
      desc: 'на темы от «медалек за хорошесть» до запрета на победу, а в общем — как перестать держать лицо в отношениях, чтобы за это не платили зубы',
      foot: { text: 'Больше эфиров и подкастов в Телеграм-канале', href: 'https://t.me/psy_teeth_official' } },
    { id: 'vopros', hash: 'vopros', title: 'Задать вопрос', mini: '?',
      desc: '<ul class="ask-list">' +
            '<li>о том, как всё устроено и как проходит работа, — в&nbsp;чате психостоматологии;</li>' +
            '<li>про запись и технические нюансы — администратору Марии;</li>' +
            '<li>разобрать, когда кто-то раздражает, или задать вопрос по концепции — боту;</li>' +
            '<li>другие вопросы — Антону Казакову.</li></ul>', roomy: true }
  ];
  // угол, в который уходит «молекула», когда раздел в центре (sx, sy: -1 лево/верх, 1 право/низ)
  var CORNER = { blog: [-1, 1], efiry: [-1, -1], uslugi: [1, 1], vopros: [1, -1] };
  // позиции разделов вокруг центра на главной (по эскизу 1)
  var HOME_POS = { uslugi: [-1, -1], blog: [1, -1], efiry: [1, 1], vopros: [-1, 1] };

  var LEAVES = [
    { id: 'diag',   parent: 'uslugi', label: 'Бесплатная диагностика', inner: '0 ₽', detail: 'd-diag', sun: true, dotSvg: ICON_TOOTH, sound: 'tooth.m4a' },   // на главной в жёлтом кружке — нарисованный зубик
    { id: 'cons',   parent: 'uslugi', label: 'Первичная консультация', inner: '2 500 ₽', detail: 'd-cons' },
    { id: 'group',  parent: 'uslugi', label: 'Работа с зубами\nв группе', inner: '<span class="pf"><b>15 000 ₽</b><span>месяц</span></span>', detail: 'd-group' },
    { id: 'clinic', parent: 'uslugi', label: 'Стоматологам', emoji: '🧑‍⚕️', detail: 'd-clinic' },
    { id: 'kungfu', parent: 'group', sub: true, at: [[9, 11], [1, 3]], label: 'Зубное\nкунг-фу', emoji: '🥋', detail: 'd-kungfu' },

    { id: 'a1', parent: 'blog', label: 'Как с зубами, так и с людьми', detail: 'd-a1', img: '63343139-pexels-karolina-grab.jpg' },
    { id: 'a2', parent: 'blog', label: 'Нейрофизиология отношений', detail: 'd-a2', img: '33373232-robina-weermeijer-3K.jpg' },
    { id: 'a3', parent: 'blog', label: 'Работа с зубами через отношения', detail: 'd-a3', img: '66316361-priscilla-du-preez-x.jpg' },
    { id: 'a4', parent: 'blog', label: '3 нарциссические манипуляции для роста зубов', detail: 'd-a4', img: '65336437-photo.jpg' },
    { id: 'a5', parent: 'blog', label: 'Признаки лимбической коммуникации', detail: 'd-a5', img: '34646366-pexels-timur-weber-8.jpg' },
    { id: 'a6', parent: 'blog', label: 'От малодушия к смирению. Сокровища и ядовитые змеи.', detail: 'd-a6', img: '62353565-image_2025-03-01_205.png' },
    { id: 'a7', parent: 'blog', label: 'Страшная история 21 зуба. Папаша-то твой козлом был.', detail: 'd-a7', img: '39356164-pexels-cottonbro-660.jpg' },
    { id: 'a8', parent: 'blog', label: 'Зубы и бесконечная борьба зла с добром.', detail: 'd-a8', img: '35376361-pexels-seurafrancis9.jpg' },
    { id: 'a9', parent: 'blog', label: 'Третья сепарация', detail: 'd-a9', img: '38663039-getty-images--Nf8tXG.jpg' },
    { id: 'a10', parent: 'blog', label: 'Инструкция по эксплуатации "БЕЗЗУБЫХ".', detail: 'd-a10', img: '65333466-leary_circumplex_lig.png' },
    { id: 'a11', parent: 'blog', label: 'Закрой свой рот! Ты слишком ...', detail: 'd-a11', img: '63646561-21____.jpg' },

    { id: 'admin', parent: 'vopros', label: 'Администратору Марии', emoji: '👩🏼', href: 'https://t.me/psyteeth' },
    { id: 'anton', parent: 'vopros', label: 'Создателю\nПсихостоматологии №1\nАнтону Казакову', ava: 'tg-anton.jpg', href: 'https://t.me/happinessguy' },
    { id: 'bot',   parent: 'vopros', label: 'Боту про зубы и отношения', svg: AV_BOT, href: 'https://t.me/dramakiller_bot' },
    { id: 'chat',  parent: 'vopros', label: 'В чате психостоматологии', svg: AV_TG, detail: 'd-chat' },   // сначала окно про доступ по заявкам
    { id: 'faq1', parent: 'chat', sub: true, at: [[1, 3], [9, 11]], label: 'Пример', emoji: '❓', detail: 'd-faq1' }   // пример вопроса из чата
  ];
  // Эфиры: от свежего к старому. Обложка — превью видео из поста (assets/img/efir-<номер поста>.jpg),
  // текст в модалке — блок #d-e<N> в index.html (саммари + ссылка на пост). Пустые места — заглушки.
  var EFIRS = [
    { title: 'Чем дышат клиенты\nПсихостоматологии №1', img: 'efir-780.jpg' },   // \n — перенос строки в подписи
    { title: 'Зубы и чувства, которые за ними прячутся', img: 'efir-777.jpg' },
    { title: 'Стабилизатор или катализатор', img: 'efir-772.jpg' },
    { title: 'Расстройство', img: 'efir-767.jpg' },
    { title: 'Очковтирательство', img: 'efir-732.jpg' },
    { title: 'Слова', img: 'efir-718.jpg' },
    { title: 'Я строю себя из других', img: 'efir-692.jpg' },
    { title: 'Запрет на победу', img: 'efir-689.jpg' },
    { title: 'Лайфхак да Винчи', img: 'efir-674.jpg' }
  ];
  for (var e = 1; e <= 9; e++) {
    var ef = EFIRS[e - 1];
    if (ef) LEAVES.push({ id: 'e' + e, parent: 'efiry', label: ef.title, img: ef.img, detail: 'd-e' + e });
    else LEAVES.push({ id: 'e' + e, parent: 'efiry', label: 'Эфир ' + e, inner: '▶', detail: 'd-efir', placeholder: true });
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
        var b;
        if (def.btn.detail) {   // кнопка открывает окно с описанием
          b = el('button', 'cta', def.btn.text); b.type = 'button';
          b.addEventListener('click', function (ev) { ev.stopPropagation(); openDetail(def.btn.detail); });
        } else {
          b = el('a', 'cta', def.btn.text);
          b.href = def.btn.href; b.target = '_blank'; b.rel = 'noopener';
          b.addEventListener('click', function (ev) { ev.stopPropagation(); });
        }
        full.appendChild(b);
      }
      if (def.foot) {
        var f = el('a', 'hub-foot');
        f.href = def.foot.href; f.target = '_blank'; f.rel = 'noopener';
        f.appendChild(el('span', 'hub-foot__t', def.foot.text));
        f.appendChild(el('span', 'hub-foot__i', AV_TG));
        f.addEventListener('click', function (ev) { ev.stopPropagation(); });
        full.appendChild(f);
      }
      if (def.tap) full.appendChild(el('div', 'tap', ICON_TAP));
      disc.appendChild(full);
      disc.appendChild(el('div', 'v-mid', def.title));
      var mini = el('div', 'v-mini');
      if (def.icon) { var im = el('img'); im.src = def.icon; im.alt = ''; mini.appendChild(im); }
      else if (def.svg) mini.innerHTML = def.svg;
      else mini.textContent = def.mini;
      disc.appendChild(mini);
      root.appendChild(disc);
      if (def.id === 'psy') root.appendChild(el('span', 'home-cap', 'на главную'));
      root.addEventListener('click', function () { go(def.id); });
      root.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(def.id); }
      });
    } else {
      var ext = def.href && /^https?:/.test(def.href);
      root = el(def.href ? 'a' : 'button', 'node node--leaf' + (def.sun ? ' is-sun' : '') + (def.img ? ' has-img' : '') + (def.placeholder ? ' is-ph' : ''));
      if (def.href) { root.href = def.href; if (ext) { root.target = '_blank'; root.rel = 'noopener'; } }
      else root.type = 'button';
      root.setAttribute('aria-label', def.label.replace(/\n/g, ' '));
      root.title = def.label.replace(/\n/g, ' ');
      var d2 = el('span', 'disc');
      if (def.img) d2.style.backgroundImage = "url('" + IMG + def.img + "')";
      else if (def.emoji) d2.appendChild(el('span', 'emo', def.emoji));
      else if (def.ava) { var av = el('img', 'ava'); av.src = IMG + def.ava; av.alt = ''; d2.appendChild(av); }
      else if (def.svg) d2.appendChild(el('span', 'ico', def.svg));
      else d2.appendChild(el('span', 'in' + ((def.inner || '').length <= 2 ? ' in--big' : ''), def.inner || ''));
      if (def.dotSvg) d2.appendChild(el('span', 'dot-ico', def.dotSvg));
      root.appendChild(d2);
      // одно слово или строки, заданные вручную через \n, — без автоматических переносов
      root.appendChild(el('span', 'lab' + (/\n/.test(def.label) ? ' lab--pre' : /\s/.test(def.label) ? '' : ' lab--one'), def.label));
      if (def.detail) root.addEventListener('click', function () {
        // на главной золотой зубик не открывает окно, а играет мелодию (повторное нажатие — тише и стоп)
        if (def.sound && active === 'psy') { toggleSound(def, root); return; }
        openDetail(def.detail);
      });
    }
    root.dataset.id = def.id;
    if (def.dot) root.style.setProperty('--dot', def.dot);
    n.el = root;
    n.disc = root.querySelector('.disc');
    host.appendChild(root);
    nodes[def.id] = n;
    order.push(n);
    return n;
  }

  // цвета маленьких сателлитов Блога на главной (у каждой статьи свой)
  var BLOG_DOTS = ['#ff5136', '#00a1c9', '#ffc94d', '#6cc070', '#a77bf3', '#ff8fb1', '#38c6b4', '#f39a3d', '#5b7cfa', '#e25d5d', '#9fd04a'];
  var bi = 0;
  LEAVES.forEach(function (l) { if (l.parent === 'blog') l.dot = BLOG_DOTS[bi++ % BLOG_DOTS.length]; });

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
    if (active === 'focus' && typeof layPsyx === 'function') setTimeout(layPsyx, 0);
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

  // Размер центрального круга на главной: [доля от min(ширина, высота) на компьютере, доля ширины на телефоне]
  var PSY_SIZE = [0.135, 0.25];

  function layoutHome() {
    var cx = W / 2, cy = H / 2 + (mobile ? 10 : 15);
    var m = Math.min(W, H);
    var hubR = mobile ? W * 0.115 : m * 0.072;
    var dx = mobile ? W * 0.3 : Math.min(W * 0.26, 360);
    var dy = mobile ? H * 0.28 : H * 0.28;
    // на компьютере круг растёт вместе с расстоянием до разделов (широкое окно — круг больше, без пустоты вокруг)
    var R = mobile ? W * PSY_SIZE[1] : Math.max(m * PSY_SIZE[0], Math.hypot(dx, dy) * 0.33);
    if (mobile && window.innerWidth > window.innerHeight) R = Math.min(R, H * 0.19);   // телефон боком: круг меньше, чтобы не касаться сателлитов
    set('psy', cx, cy, R, 1, 'full');
    var homeSubs = [];

    ['uslugi', 'blog', 'efiry', 'vopros'].forEach(function (id) {
      var p = HOME_POS[id];
      var hx = cx + p[0] * dx, hy = cy + p[1] * dy;
      set(id, hx, hy, hubR, 1, 'mid');
      var kids = childrenOf(id);
      // сателлиты симметрично по кругу; полшага от линии к центру, чтобы не садиться на неё
      var toCenter = Math.atan2(cy - hy, cx - hx);
      var big = id === 'uslugi' || id === 'vopros';
      var labelled = false;   // на главной у вторичных сателлитов подписей нет (только круги/иконки)
      var ask = id === 'vopros';   // у «Задать вопрос» сателлиты крупнее, с иконками внутри
      var lr = mobile ? (ask ? 10 : big ? 5.5 : 4.5) : (ask ? 20 : big ? 14 : 7);
      var dist = hubR + (mobile ? (ask ? 20 : big ? 16 : 12) : (ask ? 46 : big ? 40 : 26));
      // у «Задать вопрос» на компьютере крест повёрнут на ~19° против часовой (почти как на телефоне)
      var base = ask && !mobile ? -1.12 : toCenter;
      kids.forEach(function (k, i) {
        var a = base + Math.PI * 2 * (i + 0.5) / kids.length;
        var kd = k.sun ? dist + lr * (mobile ? 0.6 : 0.35) : dist;
        var x = hx + Math.cos(a) * kd, y = hy + Math.sin(a) * kd;
        var side = Math.cos(a) < 0 ? 'l' : 'r';
        set(k.id, x, y, k.sun ? lr * (mobile ? 2.1 : 1.7) : lr, 1, 'dot', labelled ? side : '');   // бесплатная диагностика (зубик) — заметно крупнее
        childrenOf(k.id).forEach(function (s) { homeSubs.push({ s: s, x: x, y: y, r: k.sun ? lr * (mobile ? 2.1 : 1.7) : lr, a: a, side: side }); });
      });
    });
    // сателлиты сателлитов — после всех кругов: с зазором от «родителя» и так, чтобы ни на что не налезать
    homeSubs.forEach(function (h) {
      var sr = h.r * 0.6, off = h.r + sr + (mobile ? 9 : 11);
      var hours = [];
      (h.s.at || []).forEach(function (rg) { for (var hr = rg[0]; hr <= rg[1] + 0.001; hr += 0.25) hours.push(hr); });
      for (var hh = 0; hh < 12; hh += 0.5) hours.push(hh);   // запасные — по всему кругу
      var best = null;
      for (var i = 0; i < hours.length && !best; i++) {
        var sa = (hours[i] / 12) * 2 * Math.PI - Math.PI / 2;
        var sx = h.x + Math.cos(sa) * off, sy = h.y + Math.sin(sa) * off;
        if (sx < sr + 4 || sx > W - sr - 4 || sy < sr + 4 || sy > H - sr - 4) continue;
        var free = order.every(function (n) {
          if (!n.t || n.t.op < 0.5 || n.t.r < 1 || n.id === h.s.id) return true;
          if (n.kind === 'leaf' && n.def.sub) return true;
          return Math.hypot(n.t.x - sx, n.t.y - sy) >= n.t.r + sr + 9;
        }) && homeSubs.every(function (o) { return !o.t || o === h || Math.hypot(o.t.x - sx, o.t.y - sy) >= o.t.r + sr + 9; });
        if (free) best = [sx, sy];
      }
      if (!best) { var sa2 = h.a; best = [h.x + Math.cos(sa2) * off, h.y + Math.sin(sa2) * off]; }
      h.t = { x: best[0], y: best[1], r: sr };
      set(h.s.id, best[0], best[1], sr, 1, 'dot', '');
    });
    return H;
  }

  // «Психостоматология» крупно в центре, разделы маленькими по своим углам
  function layoutFocus() {
    var cx = W / 2, cy = H / 2;
    var m = Math.min(W, H);
    var R = mobile ? Math.min(W * 0.48, W / 2 - 8) : m * 0.34;
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
  function evenOnEllipse(rx, ry, n, a0, gap) {
    var N = 720, cum = [0], px = rx * Math.cos(a0), py = ry * Math.sin(a0), i;
    for (i = 1; i <= N; i++) {
      var t = a0 + 2 * Math.PI * i / N, x = rx * Math.cos(t), y = ry * Math.sin(t);
      cum.push(cum[i - 1] + Math.hypot(x - px, y - py)); px = x; py = y;
    }
    var total = cum[N], out = [], j = 0;
    for (i = 0; i < n; i++) {
      var g = gap ? Math.min(gap / total, 0.4) : 0;   // разрыв (в px дуги) вокруг a0 — место под молекулу
      var target = total * (g / 2 + (1 - g) * (i + 0.5) / n);
      while (cum[j] < target) j++;
      out.push(a0 + 2 * Math.PI * j / N);
    }
    return out;
  }

  function layoutSection(id) {
    var c = CORNER[id];
    var m = Math.min(W, H);
    var n = childrenOf(id).length;
    var cx2, cy2, rx, ry, leafR, Rc, stageH = H;
    if (mobile) {
      leafR = n > 6 ? 30 : 40;
      var top = 158;                      // ниже молекулы и подписи «на главную»
      ry = Math.max(200, n * 31, (H - top - 2 * leafR - 70) / 2);
      // у раздела с длинным текстом в круге (Эфиры) круг чуть больше, лучи чуть шире
      var roomy = HUBS.some(function (h) { return h.id === id && (h.foot || h.roomy); });
      rx = W / 2 - (roomy ? 56 : 62);
      cx2 = W / 2; cy2 = top + leafR + ry;
      // круг поменьше, чтобы подписи боковых сателлитов не заходили под него
      Rc = roomy ? Math.min(W * 0.25, rx - leafR - 10) : Math.min(W * 0.22, rx - leafR - 12);
      var rk = HUBS.filter(function (h) { return h.id === id; })[0];
      if (roomy && n <= 5) Rc = W * (typeof rk.roomy === 'number' ? rk.roomy : 0.34);
      if (window.innerWidth > window.innerHeight) Rc = Math.min(Rc, W * 0.22);   // телефон боком: центральный круг скромнее, сателлиты не налезают   // мало кружков (Задать вопрос) — круг крупнее, кружки отодвинутся ниже сами
      stageH = cy2 + ry + leafR + 60;
    } else {
      // кольцо чуть выше центра и ниже край — чтобы плашка psyteeth.ru внизу не закрывала подписи
      cx2 = W / 2; cy2 = H / 2 - 18;
      ry = H / 2 - 64 - 74;
      rx = Math.min(W / 2 - 150, ry * 1.55);
      leafR = Math.max(30, Math.min(56, (2 * Math.PI * ry / n) * 0.3));
      Rc = Math.min(m * 0.21, ry - leafR - 52);   // место под две строки подписи у верхних кружков
    }

    // молекула: на компьютере — в разрыве кольца листьев со стороны своего угла (ближе к центру, заметно);
    // на телефоне — сверху, над кольцом
    var tr = mobile ? 30 : 44, sr = mobile ? 14 : 18, sd = mobile ? 68 : 92;
    var mx, my, molA = Math.atan2(c[1], c[0]);
    if (mobile) { mx = c[0] < 0 ? 90 : W - 90; my = 88; }
    else { mx = cx2 + Math.cos(molA) * rx; my = cy2 + Math.sin(molA) * ry; }
    // подпись «на главную»: там, где нет сателлитов (на компьютере в верхних углах — над зубиком)
    set('psy', mx, my, tr, 1, 'mini', !mobile && c[1] < 0 ? 't' : '');
    var others = ['uslugi', 'blog', 'efiry', 'vopros'].filter(function (h) { return h !== id; });
    // сателлиты молекулы — симметрично с трёх сторон (через 120°), с просветом от зубика;
    // ни один не садится на линию к центру и на подпись
    var toC = Math.atan2(cy2 - my, cx2 - mx);
    others.forEach(function (h, i) {
      var a = mobile ? -Math.PI / 2 + i * 2 * Math.PI / 3 : toC + Math.PI / 3 + i * 2 * Math.PI / 3;
      set(h, mx + Math.cos(a) * sd, my + Math.sin(a) * sd, sr, 1, 'mini');
      LEAVES.forEach(function (l) {
        if (topHub(l) === h) set(l.id, mx + Math.cos(a) * sd, my + Math.sin(a) * sd, 0, 0, 'dot');
      });
    });

    var kids = childrenOf(id);
    var subs = subsOf(id);

    // раздел в центре, его сателлиты — лучами вокруг (как на эскизах), каждый связан с центром
    set(id, cx2, cy2, Rc, 1, 'full');
    // не ставить листья на линию к молекуле
    var toMol = Math.atan2(my - cy2, mx - cx2);
    var angles = evenOnEllipse(rx, ry, n, mobile ? toMol : molA, mobile ? 0 : 2 * (tr + sd + sr) + 2 * leafR);
    // 1) начальные места на эллипсе; у каждого кружка — «коробка» из самого кружка и подписи под ним
    var charW = mobile ? 6.6 : 7.6, maxW = mobile ? 112 : 160, lineH = mobile ? 15 : 17;
    var P = kids.map(function (k, i) {
      var a = angles[i], lines = k.label.split('\n'), lw, nl;
      if (lines.length > 1 || !/\s/.test(k.label)) {   // строки вручную или одно слово — без переносов
        lw = Math.max.apply(null, lines.map(function (t) { return t.length; })) * charW; nl = lines.length;
      } else { lw = Math.min(maxW, k.label.length * charW); nl = Math.min(4, Math.ceil(k.label.length * charW / maxW)); }
      return { k: k, x: cx2 + Math.cos(a) * rx, y: cy2 + Math.sin(a) * ry,
               hw: Math.max(leafR, lw / 2 + 4), lh: nl * lineH + 6,
               // на телефоне над кружком с «внуком» (Зубное кунг-фу) держим место под него и его подпись
               st: mobile && childrenOf(k.id).length ? leafR + 48 : 0 };
    });
    // 2) раздвигаем: кружки с подписями не налезают на центральный круг, на молекулу, друг на друга и не выходят за экран
    var molR = tr + sd + sr + 12, topMin = mobile ? 128 : 14, botMax = mobile ? 1e9 : H - 62, gap = 8;
    function box(p) { return { l: p.x - p.hw, r: p.x + p.hw, t: p.y - leafR - p.st, b: p.y + leafR + 4 + p.lh }; }
    function distToBox(bx, px, py) {
      var nx = Math.max(bx.l, Math.min(px, bx.r)), ny = Math.max(bx.t, Math.min(py, bx.b));
      return { d: Math.hypot(nx - px, ny - py), nx: nx, ny: ny };
    }
    for (var it = 0; it < 120; it++) {
      var moved = false;
      P.forEach(function (p) {
        // центральный круг и молекула — отталкиваем от центра
        [[cx2, cy2, Rc + 18], [mx, my, molR]].forEach(function (c) {
          var bx = box(p), q = distToBox(bx, c[0], c[1]);
          if (q.d < c[2]) {
            var vx = p.x - c[0], vy = (p.y + p.lh / 2) - c[1], vl = Math.hypot(vx, vy) || 1;
            p.x += vx / vl * 4; p.y += vy / vl * 4; moved = true;
          }
        });
      });
      for (var i2 = 0; i2 < P.length; i2++) for (var j2 = i2 + 1; j2 < P.length; j2++) {
        var A = box(P[i2]), B = box(P[j2]);
        var ox = Math.min(A.r, B.r) - Math.max(A.l, B.l) + gap, oy = Math.min(A.b, B.b) - Math.max(A.t, B.t) + gap;
        if (ox > 0 && oy > 0) {   // пересекаются — разводим по той оси, где перекрытие меньше
          var up = P[i2].y < P[j2].y ? P[i2] : P[j2], dn = up === P[i2] ? P[j2] : P[i2];
          var lf = P[i2].x < P[j2].x ? P[i2] : P[j2], rt = lf === P[i2] ? P[j2] : P[i2];
          if (oy <= ox) { up.y -= oy / 2; dn.y += oy / 2; } else { lf.x -= ox / 2; rt.x += ox / 2; }
          moved = true;
        }
      }
      P.forEach(function (p) {   // в пределах экрана
        p.x = Math.max(p.hw + 6, Math.min(W - p.hw - 6, p.x));
        p.y = Math.max(topMin + leafR + p.st, Math.min(botMax - leafR - 4 - p.lh, p.y));
      });
      if (!moved) break;
    }
    P.forEach(function (p) {
      var k = p.k, x = p.x, y = p.y;
      var ux = x - cx2, uy = y - cy2, ul = Math.hypot(ux, uy) || 1;
      ux /= ul; uy /= ul;
      if (mobile) stageH = Math.max(stageH, y + leafR + p.lh + 70);
      set(k.id, x, y, leafR, 1, 'ring', 'b');
      // подпись маленького кружка — со стороны, противоположной «родителю», чтобы не налезать на него
      function subLab(sx, sy) {
        if (sy < y - leafR * 0.4) return 't';
        if (sy > y + leafR * 0.4) return 'b';
        return sx < x ? (sx > 120 ? 'l' : 't') : (sx < W - 120 ? 'r' : 't');
      }
      childrenOf(k.id).forEach(function (s) {
        var sr = leafR * 0.5;   // сателлит сателлита — не больше половины своего «родителя»
        // ставим с внешней стороны от «родителя» (дальше от центрального круга)
        var d = leafR + sr + (mobile ? 30 : 40);
        var sx = x + ux * d, sy = y + uy * d;
        var lim = mobile ? sr + 46 : sr + 70;
        // место по циферблату вокруг «родителя»: s.at = [[9, 11], [1, 3]] — берём первое время из диапазонов,
        // где кружок не вылезает за экран и не налезает на центральный круг (12 — сверху, 3 — справа)
        if (s.at) {
          var found = false;
          s.at.forEach(function (rg) {
            for (var hr = rg[0]; !found && hr <= rg[1] + 0.001; hr += 0.25) {
              var ang = (hr / 12) * 2 * Math.PI - Math.PI / 2;
              var tx = x + Math.cos(ang) * d, ty = y + Math.sin(ang) * d;
              if (tx < lim || tx > W - lim || ty < sr + 24) continue;
              if (Math.hypot(tx - cx2, ty - cy2) < Rc + sr + 30) continue;
              // не на луч «родитель — центр»
              var da = Math.abs(Math.atan2(ty - y, tx - x) - Math.atan2(cy2 - y, cx2 - x));
              if (Math.min(da, 2 * Math.PI - da) < 0.6) continue;
              sx = tx; sy = ty; found = true;
            }
          });
          if (found) { set(s.id, sx, sy, sr, 1, 'ring', subLab(sx, sy)); return; }
        }
        if (sx < lim || sx > W - lim) {   // упёрлись в край экрана — ставим над «родителем»
          sx = Math.max(lim, Math.min(W - lim, x));
          sy = y - leafR - sr - (mobile ? 30 : 40);
        }
        if (sy < sr + 24) {   // упёрлись в верх экрана — ставим сбоку, с внешней стороны
          var side = ux >= 0 ? 1 : -1;
          sx = x + side * (leafR + sr + (mobile ? 30 : 46));
          if (sx < lim || sx > W - lim) sx = x - side * (leafR + sr + (mobile ? 30 : 46));
          sy = y - leafR * 0.3;
        }
        set(s.id, sx, sy, sr, 1, 'ring', subLab(sx, sy));
      });
    });
    return stageH;
  }

  // ---------- Анимация ----------
  // «Уменьшение движения» в системе: переходы остаются плавными, но без постоянного покачивания.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var last = 0;

  function frame(ts) {
    var dt = last ? Math.min(ts - last, 64) : 16.7;
    last = ts;
    // скорость не зависит от частоты кадров (60/120 Гц, подтормаживания)
    var k = 1 - Math.pow(1 - (demo ? 0.2 : 0.085), dt / 16.7);   // во время демонстрации — быстрее
    var t = ts / 1000;
    order.forEach(function (n) {
      var g = n.t;
      n.x += (g.x - n.x) * k; n.y += (g.y - n.y) * k;
      n.r += (g.r - n.r) * k; n.op += (g.op - n.op) * k;
      if (Math.abs(g.r - n.r) < 0.05) n.r = g.r;
      if (Math.abs(g.op - n.op) < 0.005) n.op = g.op;
      var fx = reduce ? 0 : Math.sin(t * 0.7 + n.phase) * n.amp;
      var fy = reduce ? 0 : Math.cos(t * 0.55 + n.phase * 1.3) * n.amp;
      n.dx = n.x + fx; n.dy = n.y + fy;
      var hidden = n.op < 0.01;
      if (hidden !== n._hidden) { n.el.style.visibility = hidden ? 'hidden' : ''; n._hidden = hidden; }
      if (hidden) return;
      // только transform/opacity каждый кадр (дёшево); размер — лишь пока он меняется
      var tr = 'translate3d(' + n.dx.toFixed(1) + 'px,' + n.dy.toFixed(1) + 'px,0)';
      if (tr !== n._tr) { n.el.style.transform = tr; n._tr = tr; }
      var o = n.op.toFixed(2);
      if (o !== n._o) { n.el.style.opacity = o; n._o = o; }
      var r = n.r.toFixed(1);
      if (r !== n._r) { n.el.style.setProperty('--r', r); n._r = r; }
      var pe = n.op > 0.5 ? '' : 'none';
      if (pe !== n._pe) { n.el.style.pointerEvents = pe; n._pe = pe; }
    });
    edges.forEach(function (ed) {
      var a = nodes[ed[0]], b = nodes[ed[1]];
      var op = Math.min(a.op, b.op);
      if (op < 0.01) {
        if (!ed._off) { ed.line.setAttribute('opacity', '0'); ed._off = true; }
        return;
      }
      ed._off = false;
      ed.line.setAttribute('x1', a.dx.toFixed(1)); ed.line.setAttribute('y1', a.dy.toFixed(1));
      ed.line.setAttribute('x2', b.dx.toFixed(1)); ed.line.setAttribute('y2', b.dy.toFixed(1));
      ed.line.setAttribute('opacity', (op * 0.55).toFixed(2));
    });
    requestAnimationFrame(frame);
  }

  // ---------- Мелодия золотого зубика ----------
  var snd = null, sndEl = null, sndFade = null;
  function stopSound() {
    stopDemo();
    if (!snd || snd.paused) { if (sndEl) sndEl.classList.remove('is-playing'); return; }
    clearInterval(sndFade);
    var a = snd, v = a.volume;
    sndFade = setInterval(function () {   // плавно затихает (на iPhone громкость не меняется — просто стоп)
      v -= 0.08; try { a.volume = Math.max(0, v); } catch (e) {}
      if (v <= 0 || a.volume === 1) { clearInterval(sndFade); a.pause(); a.currentTime = 0; try { a.volume = 1; } catch (e) {} }
    }, 30);
    if (sndEl) sndEl.classList.remove('is-playing');
  }
  function toggleSound(def, el) {
    if (Date.now() - userStoppedAt < 500) return;   // это нажатие уже остановило показ
    if (snd && !snd.paused) { stopSound(); return; }
    if (!snd) {
      snd = new Audio('./assets/audio/' + def.sound);
      snd.addEventListener('ended', function () { if (sndEl) sndEl.classList.remove('is-playing'); stopDemo(); });
    }
    clearInterval(sndFade); try { snd.volume = 1; } catch (e) {}
    snd.currentTime = 0; sndEl = el;
    var p = snd.play(); if (p && p.catch) p.catch(function () {});
    el.classList.add('is-playing');
    startDemo();
  }
  // Пасхалка: под мелодию по очереди раскрываются и сворачиваются все круги
  var demo = null;
  var DEMO_SEQ = ['psy', '', 'blog', '', 'efiry', '', 'vopros', '', 'uslugi', ''];
  function startDemo() {
    stopDemo();
    var step = 0, dur = (snd && isFinite(snd.duration) && snd.duration > 2 ? snd.duration : 8.3) * 1000;
    var each = Math.max(600, Math.floor((dur - 400) / DEMO_SEQ.length));
    demo = { t: null };
    (function next() {
      if (!demo) return;
      if (step >= DEMO_SEQ.length) { stopDemo(); return; }
      location.hash = DEMO_SEQ[step++];
      demo.t = setTimeout(next, each);
    })();
    // любое касание или клавиша — стоп (после текущего нажатия)
    setTimeout(function () { if (demo) { window.addEventListener('pointerdown', userStop, true); window.addEventListener('keydown', userStop, true); } }, 0);
  }
  var userStoppedAt = 0;
  function userStop() { userStoppedAt = Date.now(); stopDemo(); stopSound(); }
  function stopDemo() {
    if (!demo) return;
    clearTimeout(demo.t); demo = null;
    window.removeEventListener('pointerdown', userStop, true); window.removeEventListener('keydown', userStop, true);
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
    // повторный клик по большому кругу раздела — назад на главную
    if (id === active) { history.pushState(null, '', location.pathname + location.search); apply(); return; }
    var hub = HUBS.filter(function (h) { return h.id === id; })[0];
    var hash = hub.hash ? '#' + hub.hash : location.pathname + location.search;
    if (hub.hash) location.hash = hub.hash;
    else { history.pushState(null, '', hash); apply(); }
  }
  function apply() {
    if (!demo) stopSound();
    active = idFromHash();
    document.body.dataset.active = active;
    layout();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', apply);
  window.addEventListener('popstate', apply);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(layout, 80); });

  // ---------- Раскрытая «Психостоматология №1»: цитата, название + бегущая строка, описание, кнопка ----------
  // Текст сверху и снизу повторяет форму круга (поплавки с вырезом по окружности); название и строка — ровно по центру.
  var PSYX = {
    quote: 'Ты\u00a0держишь мир в отношениях, помогаешь, терпишь и не показываешь, как тебе тяжело и больно… А зубы ноют, портятся и лечатся по кругу…',
    about: 'Мы с 2020 года работаем с зубами через отношения. На диагностиках видно, как конкретный зуб откликается на конкретную историю в отношениях, где человек рассказывает о себе одно, а его зубы — другое…',
    btn: 'И что в итоге…', detail: 'd-example',
    // цифры и темы недели берутся с дашборда; это — запас, если он не ответил
    stats: 'https://psyteeth.github.io/schedule/data/stats.json',
    topics: 'https://psyteeth.github.io/schedule/data/topics.json'
  };
  function plural(n, one, few, many) {
    var a = Math.abs(n) % 100, b = a % 10;
    if (a > 10 && a < 20) return many;
    return b === 1 ? one : (b >= 2 && b <= 4 ? few : many);
  }
  function tickerItems(st, tp) {
    st = st || { slots_total: 194, participants_active: 15, streams_per_week: 13, limbic_unload_30d: { hours: 51, minutes: 17 } };
    var h = st.limbic_unload_30d.hours, mi = st.limbic_unload_30d.minutes;
    var it = [
      '<b>' + st.slots_total + '</b> ' + plural(st.slots_total, 'созвон', 'созвона', 'созвонов') + ' по 15 минут за месяц',
      '<b>' + st.participants_active + '</b> ' + plural(st.participants_active, 'активный участник', 'активных участника', 'активных участников'),
      '<b>' + st.streams_per_week + '</b> ' + plural(st.streams_per_week, 'эфир', 'эфира', 'эфиров') + ' в неделю',
      '<b>' + h + ' ' + plural(h, 'час', 'часа', 'часов') + ' ' + mi + ' ' + plural(mi, 'минута', 'минуты', 'минут') + '</b> эмоциональной разгрузки за прошедшие 30 дней',
      '<b>250</b> диагностик с февраля 2025 года',
      '<em>«Из-за него мне…»</em> — плохо · больно · грустно · страшно'
    ];
    var t = tp && tp.items && tp.items[0];
    it.push('<em>Тема недели:</em> «' + (t ? (t.short || t.text) : 'Спасаю близких от страхов, плачу сама') + '»');
    var v = tp && tp.vector;
    it.push('<em>Вектор недели:</em> от «' + (v ? v.from_short : 'держу лицо') + '» к «' + (v ? v.to_short : 'говорю, что чувствую') + '»');
    return it.map(function (x) { return '<span>' + x + '</span><span class="dot">•</span>'; }).join('');
  }
  var psyx = (function () {
    var disc = nodes.psy.disc;
    var box = el('div', 'psyx');
    box.innerHTML = '<div class="psyx__glow"></div><div class="psyx__glow"></div><div class="psyx__spot"></div>' +
      '<div class="psyx__reg psyx__q"><div class="fl l"></div><div class="fl r"></div><div class="tx"></div></div>' +
      '<div class="psyx__h">Психостоматология №1</div>' +
      '<div class="psyx__tick"><div class="psyx__row"></div></div>' +
      '<div class="psyx__reg psyx__a"><div class="fl l"></div><div class="fl r"></div><div class="tx"></div></div>' +
      '<button type="button" class="psyx__btn"></button>';
    box.querySelector('.psyx__q .tx').textContent = PSYX.quote;
    box.querySelector('.psyx__a .tx').textContent = PSYX.about;
    var btn = box.querySelector('.psyx__btn');
    btn.textContent = PSYX.btn;
    btn.addEventListener('click', function (ev) { ev.stopPropagation(); openDetail(PSYX.detail); });
    var row = box.querySelector('.psyx__row');
    function fill(st, tp) { var h = tickerItems(st, tp); row.innerHTML = h + h; }
    fill();
    if (window.fetch) {
      var get = function (u) { return fetch(u, { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); };
      Promise.all([get(PSYX.stats), get(PSYX.topics)]).then(function (r) { if (r[0] || r[1]) fill(r[0], r[1]); });
    }
    disc.appendChild(box);
    return box;
  })();
  function psyxShape(reg, top, D, m) {
    var R = D / 2 - m, cy = D / 2 - top;
    reg.style.top = top + 'px';
    reg.querySelector('.l').style.shapeOutside = 'radial-gradient(circle ' + R + 'px at ' + (D / 2) + 'px ' + cy + 'px,transparent 99.6%,#000 100%)';
    reg.querySelector('.r').style.shapeOutside = 'radial-gradient(circle ' + R + 'px at 0px ' + cy + 'px,transparent 99.6%,#000 100%)';
  }
  function psyxTextBox(reg) {
    var r = document.createRange(); r.selectNodeContents(reg.querySelector('.tx'));
    var rs = [].slice.call(r.getClientRects()), cr = psyx.getBoundingClientRect(), k = psyx.offsetWidth / (cr.width || 1);
    return { l: (Math.min.apply(0, rs.map(function (x) { return x.left; })) - cr.left) * k,
             r: (Math.max.apply(0, rs.map(function (x) { return x.right; })) - cr.left) * k,
             h: reg.querySelector('.tx').offsetHeight };
  }
  // Настройки раскладки (отдельно телефон / компьютер). Размеры — при круге 440 px, дальше масштабируются.
  // Подбираются конструктором: открыть сайт с ?tune=1#psy (см. ниже).
  var PSYX_TUNE = {
    mobile:  { center: 0.515, gap: 0.055, hSize: 25, hSpace: 0.034, hMaxW: 0.94, tickSize: 10,
               qSize: 17, qEdge: 10, qMinTop: 0.07, aSize: 12.5, aEdge: 16, aShift: -8,
               btnSize: 12.5, btnPadX: 8, btnPadY: 8, btnGap: 0, btnMax: 0.88, fit: 1 },   // подобрано в конструкторе 17.11
    desktop: { center: 0.48, gap: 0.045, hSize: 32, hSpace: 0.022, hMaxW: 0.92, tickSize: 13,
               qSize: 17.5, qEdge: 14, qMinTop: 0.05, aSize: 15, aEdge: 10, aShift: -6,
               btnSize: 13.5, btnPadX: 15, btnPadY: 8, btnGap: 0.04, btnMax: 0.88, fit: 1 }
  };
  var psyxTuneOn = /[?&]tune=1/.test(location.search);
  function psyxT() {
    var key = mobile ? 'mobile' : 'desktop', t = {}, base = PSYX_TUNE[key];
    for (var k in base) t[k] = base[k];
    if (psyxTuneOn) { try { var o = JSON.parse(localStorage.getItem('psyx-tune-' + key) || '{}'); for (var k2 in o) t[k2] = o[k2]; } catch (e) {} }
    return t;
  }
  var psyxNow = {};   // фактические размеры после подгонки (видны в конструкторе)
  // раскладка под итоговый размер круга (пока круг растёт, слой ещё прозрачный)
  function layPsyx() {
    if (active !== 'focus') return;
    var T0 = psyxT();
    var D = Math.round(nodes.psy.t.r * 2), s = Math.max(mobile ? 0.97 : 0.8, Math.min(1.2, D / 440));
    psyx.style.width = psyx.style.height = D + 'px';
    var q = psyx.querySelector('.psyx__q'), a = psyx.querySelector('.psyx__a'), h = psyx.querySelector('.psyx__h'),
        k = psyx.querySelector('.psyx__tick'), b = psyx.querySelector('.psyx__btn'), sp = psyx.querySelector('.psyx__spot');
    var gap = Math.round(D * T0.gap), fit = !!T0.fit;
    // название
    var fs = T0.hSize * s; h.style.fontSize = fs + 'px'; h.style.letterSpacing = T0.hSpace + 'em';
    var tw = function () { var r = document.createRange(); r.selectNodeContents(h); return r.getBoundingClientRect().width * psyx.offsetWidth / (psyx.getBoundingClientRect().width || 1); };
    for (var i = 0; fit && i < 30 && tw() > D * T0.hMaxW; i++) { fs -= 1; h.style.fontSize = fs + 'px'; }
    k.style.fontSize = Math.max(10, T0.tickSize * s) + 'px';
    b.style.fontSize = Math.max(11, T0.btnSize * s) + 'px';
    b.style.padding = T0.btnPadY + 'px ' + T0.btnPadX + 'px';
    var th = h.offsetHeight, block = th + 5 + k.offsetHeight, ty = Math.round(D * T0.center - block / 2);
    h.style.top = ty + 'px'; k.style.top = (ty + th + 5) + 'px';
    sp.style.top = (ty - 16) + 'px'; sp.style.height = (block + 32) + 'px';
    // верх: прижат к названию; при подгонке — шрифт меньше, если не помещается
    var qf = T0.qSize * s; q.style.fontSize = qf + 'px';
    for (var f = 0; f < 24; f++) {
      q.style.height = D + 'px'; var T = ty - gap - 120;
      for (var j = 0; j < 6; j++) { psyxShape(q, T, D, T0.qEdge); T = Math.round(ty - gap - q.querySelector('.tx').offsetHeight); }
      psyxShape(q, T, D, T0.qEdge);
      if (!fit || T >= D * T0.qMinTop) break;
      qf -= 0.5; q.style.fontSize = qf + 'px';
    }
    q.style.height = q.querySelector('.tx').offsetHeight + 'px';
    // низ: под строкой; кнопка сразу под ним, но не ниже границы
    var btop = Math.round(D * T0.btnMax);
    var af = T0.aSize * s; a.style.fontSize = af + 'px';
    var by = ty + block + gap + T0.aShift, bg = Math.max(8, Math.round(D * T0.btnGap));
    for (var g = 0; g < 30; g++) {
      a.style.height = D + 'px'; psyxShape(a, by, D, T0.aEdge);
      var hb = a.querySelector('.tx').offsetHeight;
      if (!fit || by + hb + 12 <= btop || g === 29) { a.style.height = hb + 'px'; b.style.top = (fit ? Math.min(btop, by + hb + bg) : by + hb + bg) + 'px'; break; }
      af -= 0.5; a.style.fontSize = af + 'px';
    }
    psyxNow = { 'название': Math.round(fs * 10) / 10, 'верх': Math.round(qf * 10) / 10, 'низ': Math.round(af * 10) / 10, 'круг': D };
    // мягкие тени под верхним и нижним текстом
    var gl = psyx.querySelectorAll('.psyx__glow');
    [q, a].forEach(function (reg, n) {
      var tb = psyxTextBox(reg), y = parseFloat(reg.style.top);
      gl[n].style.left = (tb.l - 50) + 'px'; gl[n].style.width = (tb.r - tb.l + 100) + 'px';
      gl[n].style.top = (y - 30) + 'px'; gl[n].style.height = (tb.h + 60) + 'px';
    });
    if (psyxTuneOn && window.psyxPanelSync) window.psyxPanelSync();
  }

  // ---------- Конструктор раскладки: ?tune=1#psy ----------
  if (psyxTuneOn) (function () {
    var SPEC = [
      ['Верхний текст', null],
      ['qSize', 'размер', 10, 26, 0.5], ['qEdge', 'отступ от края круга', 0, 60, 1], ['qMinTop', 'не выше (доля круга)', 0, 0.2, 0.005],
      ['Название и строка', null],
      ['center', 'по высоте (0.5 — центр)', 0.35, 0.65, 0.005], ['hSize', 'размер названия', 18, 44, 0.5], ['hSpace', 'разрядка', -0.02, 0.15, 0.002],
      ['hMaxW', 'макс. ширина (доля)', 0.7, 1, 0.01], ['tickSize', 'размер строки', 10, 18, 0.5], ['gap', 'отступы до текстов', 0, 0.12, 0.005],
      ['Нижний текст', null],
      ['aSize', 'размер', 10, 22, 0.5], ['aEdge', 'отступ от края круга', 0, 60, 1], ['aShift', 'сдвиг вверх / вниз', -30, 30, 1],
      ['Кнопка «И что в итоге…»', null],
      ['btnSize', 'размер текста', 11, 20, 0.5], ['btnPadX', 'ширина (поля по бокам)', 4, 40, 1], ['btnPadY', 'высота (поля сверху/снизу)', 2, 20, 1],
      ['btnGap', 'отступ от текста', 0, 0.12, 0.005], ['btnMax', 'не ниже (доля круга)', 0.7, 0.97, 0.005],
      ['Общее', null], ['fit', 'автоподгонка (1 — вкл, 0 — выкл)', 0, 1, 1]
    ];
    var css = el('style'); css.textContent =
      '.tune{position:fixed;left:8px;right:8px;bottom:8px;z-index:200;max-height:36vh;overflow:auto;background:rgba(255,255,255,.95);border:1.5px solid #1b1b1b;border-radius:14px;padding:8px 10px 10px;font:12.5px/1.3 Arial,sans-serif;color:#1b1b1b;box-shadow:0 6px 24px rgba(0,0,0,.2)}' +
      '.tune.up{bottom:auto;top:8px}.tune.min{max-height:none;overflow:visible;left:auto;width:auto}.tune.min .tune__body{display:none}' +
      '.tune__top{display:flex;gap:6px;align-items:center;flex-wrap:wrap;position:sticky;top:-8px;background:#fff;padding:4px 0 6px;z-index:1}' +
      '.tune__top b{margin-right:auto}.tune button{font:700 12px Arial;border:1.5px solid #1b1b1b;background:#fff;border-radius:999px;padding:5px 10px;cursor:pointer}' +
      '.tune__h{font-weight:700;margin:10px 0 2px;color:#00a1c9}.tune__r{display:grid;grid-template-columns:42% 1fr 40px;gap:0 6px;align-items:center;margin:2px 0}' +
      '.tune__r span{color:#444;font-size:11.5px}.tune__r input{width:100%}.tune__r output{text-align:right;font-weight:700}' +
      '.tune__now{color:#6b6b6b;font-size:11.5px;margin-top:2px}.tune textarea{width:100%;height:70px;font:11px monospace;margin-top:6px}';
    document.head.appendChild(css);
    var key = function () { return 'psyx-tune-' + (mobile ? 'mobile' : 'desktop'); };
    var p = el('div', 'tune');
    p.innerHTML = '<div class="tune__top"><b>Конструктор круга <span class="tune__dev"></span></b><button class="t-copy">Скопировать</button><button class="t-reset">Сбросить</button><button class="t-pos">⇅</button><button class="t-min">Свернуть</button></div>' +
      '<div class="tune__body"><div class="tune__now"></div><div class="tune__rows"></div><textarea readonly hidden></textarea></div>';
    document.body.appendChild(p);
    var rows = p.querySelector('.tune__rows'), inputs = {};
    SPEC.forEach(function (sp) {
      if (!sp[1]) { rows.appendChild(el('div', 'tune__h', sp[0])); return; }
      var r = el('label', 'tune__r'); r.innerHTML = '<span>' + sp[1] + '</span><input type="range" min="' + sp[2] + '" max="' + sp[3] + '" step="' + sp[4] + '"><output></output>';
      var inp = r.querySelector('input'), out = r.querySelector('output');
      inp.addEventListener('input', function () {
        var o = {}; try { o = JSON.parse(localStorage.getItem(key()) || '{}'); } catch (e) {}
        o[sp[0]] = parseFloat(inp.value); localStorage.setItem(key(), JSON.stringify(o)); out.textContent = inp.value; layPsyx();
      });
      inputs[sp[0]] = [inp, out]; rows.appendChild(r);
    });
    window.psyxPanelSync = function () {
      var t = psyxT();
      for (var k in inputs) { if (document.activeElement !== inputs[k][0]) inputs[k][0].value = t[k]; inputs[k][1].textContent = t[k]; }
      p.querySelector('.tune__dev').textContent = mobile ? '· телефон' : '· компьютер';
      p.querySelector('.tune__now').textContent = 'Сейчас, px: ' + Object.keys(psyxNow).map(function (k) { return k + ' ' + psyxNow[k]; }).join(' · ');
    };
    p.querySelector('.t-pos').addEventListener('click', function () { p.classList.toggle('up'); });
    p.querySelector('.t-reset').addEventListener('click', function () { localStorage.removeItem(key()); layPsyx(); });
    p.querySelector('.t-min').addEventListener('click', function () { p.classList.toggle('min'); this.textContent = p.classList.contains('min') ? 'Открыть' : 'Свернуть'; });
    p.querySelector('.t-copy').addEventListener('click', function () {
      var txt = 'psyx ' + (mobile ? 'mobile' : 'desktop') + ' ' + JSON.stringify(psyxT());
      var ta = p.querySelector('textarea'); ta.hidden = false; ta.value = txt; ta.select();
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { p.querySelector('.t-copy').textContent = 'Скопировано ✓'; }).catch(function () {});
    });
    if (active !== 'focus') location.hash = 'psy';
  })();

  // ---------- Модалка ----------
  function openDetail(id) {
    var src = document.getElementById(id);
    if (!src) return;
    modalBody.innerHTML = src.innerHTML;
    modal.classList.toggle('modal--wide', src.hasAttribute('data-wide'));
    modalBody.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', closeModal); });
    if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
  }
  function closeModal() { if (modal.close) modal.close(); else modal.removeAttribute('open'); }
  modal.querySelector('.modal__close').addEventListener('click', closeModal);
  modal.addEventListener('click', function (ev) { if (ev.target === modal) closeModal(); });

  // для проверки наложений (?debug=1): целевые позиции кругов
  if (/[?&]debug=1/.test(location.search)) window.__psyNodes = function () { return order.map(function (n) { return { id: n.id, kind: n.kind, x: n.t.x, y: n.t.y, r: n.t.r, op: n.t.op }; }); };

  // ---------- Старт ----------
  active = idFromHash();
  document.body.dataset.active = active;
  layout();
  order.forEach(function (n) { n.x = n.t.x; n.y = n.t.y; n.r = n.t.r; n.op = n.t.op; });
  requestAnimationFrame(frame);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layPsyx(); });
})();
