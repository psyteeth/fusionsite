/* Статистика посещений и нажатий — GoatCounter (без куки и без чужих скриптов).
   Включается, когда в GC_CODE записан код счётчика (имя из адреса https://<код>.goatcounter.com).
   Ничего личного не отправляется: только путь на сайте, заголовок, откуда пришли и размер экрана. */
(function () {
  var GC_CODE = '';   // ← сюда код счётчика, например 'psyteeth'

  var off = !GC_CODE || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || /[?&](tune|debug)=1/.test(location.search);
  var base = location.pathname.replace(/^\/fusionsite/, '') || '/';   // одинаковые пути и на github.io/fusionsite, и на psyteeth.ru
  var enc = encodeURIComponent;

  function send(path, title, isEvent) {
    if (off) return;
    var u = 'https://' + GC_CODE + '.goatcounter.com/count?p=' + enc(path) + '&t=' + enc(title || document.title) +
      (isEvent ? '&e=true' : '&r=' + enc(document.referrer)) +
      '&s=' + enc(screen.width + ',' + screen.height + ',' + (window.devicePixelRatio || 1)) +
      '&rnd=' + Math.random().toString(36).slice(2);
    try { if (navigator.sendBeacon && navigator.sendBeacon(u)) return; } catch (e) {}
    var img = new Image(); img.src = u;
  }

  // страница (на карте — с разделом из адреса: /#uslugi, /#psy …)
  window.psyStat = {
    page: function (hash) { send(base + (hash || ''), document.title, false); },
    event: function (name, title) { send(name, title || name, true); }
  };

  // переходы на другие сайты (Телеграм, бот, дашборд) — по всем ссылкам
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href]');
    if (!a || !/^https?:/i.test(a.href) || a.host === location.host) return;
    send('переход/' + a.host + a.pathname.replace(/\/$/, ''), (a.textContent || '').trim().slice(0, 80), true);
  }, true);

  // страницы статей и прочие — сразу; карта сама сообщает раздел (graph.js)
  if (!document.getElementById('nodes')) window.psyStat.page('');
})();
