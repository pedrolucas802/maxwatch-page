// Beta access key: finds the key's entry in keys.json and opens it in the browser (nothing is sent anywhere).
(function () {
  var form = document.getElementById('unlock');
  if (!form) return;
  var msg = document.getElementById('unlock-msg'), out = document.getElementById('unlocked');
  var T = {
    bad: ['Chave não encontrada. Confira e tente de novo.', 'Key not found. Check it and try again.'],
    wait: ['Verificando…', 'Checking…'],
    old: ['Este navegador não consegue desbloquear. Abra https://maxwatch.pro num Chrome, Safari ou Firefox atualizado.', 'This browser cannot unlock. Open https://maxwatch.pro in an up-to-date Chrome, Safari or Firefox.'],
    hi: ['Olá, ', 'Hi, '], ver: ['Versão ', 'Version '],
    how: ['No computador Linux onde o MaxWatch vai funcionar, abra o Terminal e cole o comando do tipo de processador dele. O comando baixa o pacote, abre com a sua chave e instala tudo.', 'On the Linux computer that will run MaxWatch, open the Terminal and paste the command for your processor. It downloads, opens the package with your key and installs.'],
    x86_64: ['PC ou mini PC Intel / AMD (x86_64)', 'Intel / AMD PC or mini PC (x86_64)'],
    aarch64: ['ARM64 (VM em Mac Apple Silicon, PCs ARM)', 'ARM64 (VM on an Apple Silicon Mac, ARM PCs)'],
    copy: ['Copiar', 'Copy'], copied: ['Copiado', 'Copied'],
    after: ['Quando terminar, abra http://localhost:8080 no navegador desse computador. A chave é pessoal: não compartilhe.', 'Then open http://localhost:8080 in that computer’s browser. Do not share your key.']
  };
  function t(k) { return T[k][document.documentElement.lang === 'en' ? 1 : 0]; }
  function b64(s) { return Uint8Array.from(atob(s), function (c) { return c.charCodeAt(0); }); }
  function hex(buf) { return Array.from(new Uint8Array(buf), function (x) { return x.toString(16).padStart(2, '0'); }).join(''); }
  function el(tag, text, cls) { var e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; }

  async function open(key) {
    var enc = new TextEncoder(), k = enc.encode(key);
    var db = await (await fetch('keys.json', { cache: 'no-store' })).json();
    var h = hex(await crypto.subtle.digest('SHA-256', k));
    var e = db.entries.find(function (x) { return x.h === h; });
    if (!e) return null;
    var base = await crypto.subtle.importKey('raw', k, 'PBKDF2', false, ['deriveKey']);
    var aes = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(e.s), iterations: db.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(e.i) }, aes, b64(e.c))));
  }

  function show(p) {
    out.replaceChildren(el('h3', t('hi') + p.name), el('p', t('ver') + p.version + ' · ' + t('how')));
    Object.keys(p.files).forEach(function (arch) {
      var url = p.files[arch], file = url.split('/').pop();
      var cmd = 'curl -L -o ' + file + ' ' + url + ' && openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 -md sha256 -pass pass:' + p.password +
        ' -in ' + file + ' | tar xz && cd maxwatch-*/ && sudo ./install.sh';
      var box = el('div', '', 'arch'), title = el('b', t(arch)), btn = el('button', t('copy'), 'copy');
      btn.type = 'button';
      btn.onclick = function () { navigator.clipboard.writeText(cmd).then(function () { btn.textContent = t('copied'); }); };
      title.appendChild(btn); box.append(title, el('pre', cmd)); out.appendChild(box);
    });
    out.appendChild(el('p', t('after'), 'note'));
    out.hidden = false; form.hidden = true;
  }

  form.onsubmit = async function (ev) {
    ev.preventDefault();
    if (!window.crypto || !crypto.subtle) { msg.textContent = t('old'); return; }
    msg.textContent = t('wait');
    try {
      var p = await open(document.getElementById('key').value.toUpperCase().replace(/[^0-9A-Z]/g, ''));
      msg.textContent = p ? '' : t('bad');
      if (p) show(p);
    } catch (_) { msg.textContent = t('bad'); }
  };
})();
