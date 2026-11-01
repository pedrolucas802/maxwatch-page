(function () {
  var h = document.documentElement, k = 'mw-lang', saved = null;
  var titles = { pt: 'MaxWatch · Segurança inteligente para a sua casa', en: 'MaxWatch · Home security that stays home' };
  try { saved = localStorage.getItem(k); } catch (e) {}
  var q = new URLSearchParams(location.search).get('lang');
  // ?lang= wins, then the saved choice, then the browser language (Portuguese default for pt-* browsers).
  var lang = q === 'en' || q === 'pt' ? q : saved || (/^pt/i.test(navigator.language || 'pt') ? 'pt' : 'en');
  function set(l, keep) {
    h.lang = l === 'en' ? 'en' : 'pt-BR';
    document.title = titles[l === 'en' ? 'en' : 'pt'];
    if (keep) try { localStorage.setItem(k, l); } catch (e) {}
    words();
  }
  document.querySelectorAll('.lang button').forEach(function (b) {
    b.onclick = function () { set(b.dataset.lang, true); };
  });

  // Statement: split into words that light up while scrolling.
  var st = document.querySelector('.statement');
  st.querySelectorAll('p').forEach(function (p) {
    p.innerHTML = p.textContent.split(' ').map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  });
  function words() {
    var r = st.getBoundingClientRect(), span = r.height - innerHeight;
    var p = Math.min(1, Math.max(0, -r.top / (span * .8)));
    var ws = st.querySelectorAll('p.' + (h.lang === 'en' ? 'en' : 'pt') + ' .w');
    ws.forEach(function (w, i) { w.classList.toggle('on', i < p * ws.length + .5); });
  }

  // Hero dashboard tilts flat as you scroll.
  var shot = document.querySelector('.shot');
  function tick() {
    var r = shot.getBoundingClientRect();
    var p = Math.min(1, Math.max(0, 1 - (r.top - innerHeight * .25) / (innerHeight * .6)));
    shot.style.setProperty('--p', p.toFixed(3));
    words();
  }
  var busy = false;
  addEventListener('scroll', function () { if (!busy) { busy = true; requestAnimationFrame(function () { tick(); busy = false; }); } }, { passive: true });
  addEventListener('resize', tick);

  // Reveal on scroll; scenes animate only while on screen.
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('run', e.isIntersecting); if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: .18 });
    els.forEach(function (el) { io.observe(el); });
  } else els.forEach(function (el) { el.classList.add('in', 'run'); });

  // "Learn more" popups.
  var dlg = document.getElementById('more');
  document.querySelectorAll('.plus').forEach(function (b) {
    b.onclick = function () {
      var t = b.closest('.txt');
      dlg.querySelector('.kicker').innerHTML = t.querySelector('.kicker').innerHTML;
      dlg.querySelector('h3').innerHTML = t.querySelector('h3').innerHTML;
      dlg.querySelector('ul').innerHTML = t.querySelector('.more').innerHTML;
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    };
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  set(lang, false);
  tick();
})();
