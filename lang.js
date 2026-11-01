// Idioma: pt-BR por padrão; guarda a escolha no navegador (se permitido).
(function () {
  var h = document.documentElement, k = 'mw-lang', saved = null;
  try { saved = localStorage.getItem(k); } catch (e) {}
  if (saved === 'en') h.lang = 'en';
  document.getElementById('lang').onclick = function () {
    h.lang = h.lang === 'en' ? 'pt-BR' : 'en';
    try { localStorage.setItem(k, h.lang === 'en' ? 'en' : 'pt'); } catch (e) {}
  };
})();
