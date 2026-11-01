# MaxWatch landing page

Static landing page (HTML + CSS + a few lines of JS, no build step). pt-BR by default, English with the EN button.

Preview: `python3 -m http.server 8000` in this folder, then open http://localhost:8000.

## Publish on GitHub Pages (free)

This repo is public and holds only the site, no product code. Settings > Pages > Source: *Deploy from a branch*, branch `main`, folder `/ (root)`. It goes live at `https://pedrolucas802.github.io/maxwatch-page/`. All links in the page are relative, so it works there and on a custom domain.

## Custom domain

Live at https://maxwatch.pro (bought at Hostinger 2026-11-01, renews yearly). DNS at Hostinger: four `A` records on `@` to `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`, and `CNAME www` to `pedrolucas802.github.io`. The `CNAME` file in this repo holds the domain; GitHub wrote it from Settings > Pages.

## Editing

- Text lives twice in `index.html`: `<span class="pt">` and `<span class="en">`. Change both.
- Animations are CSS only (`style.css`, bottom), and pause when off screen or when the visitor asks for reduced motion. `lang.js` handles the language switch, scroll reveals, the scroll-lit statement and the "Saiba mais" popups.
- Closed beta: no public download link. Testers type a personal key on the site, which unlocks the install command. See "Beta access keys" below.

## Brand and domain checklist

- [ ] **INPI first, domain together.** Search the name "MaxWatch" (and "Max Watch") in the INPI trademark base, classes 9 (software), 42 (SaaS) and 45 (security services). A free domain does not mean a free name, and the reverse.
- [ ] Check the name on Google, GitHub, app stores, Instagram and Telegram for clashes before paying for anything.
- [ ] **.com.br via Registro.br** needs a CPF (individual) or CNPJ (company). The registrant is the legal owner, so register in the name that will own the brand (use the CNPJ once the company exists). Needs an account and a Brazilian payment method.
- [ ] Also take the **.com** (any registrar, no CPF needed) and the common typos if cheap. Keep one as the main and redirect the others.
- [ ] Turn on **two-factor login** and auto-renew at the registrar. Use an email that is not tied to the domain itself.
- [ ] Buy only the domain. The site is free on GitHub Pages and email can start as a forwarding address.
- [ ] Before the beta download goes live: privacy policy (LGPD) and a contact email on the page.

## Beta access keys

Each tester gets a personal key (`MW-XXXX-XXXX-XXXX-XXXX`). On the site they type it in "Tenho uma chave de acesso" and get a copy-paste command that downloads the package, unlocks it with stock `openssl` and installs it. The browser does the unlock; there is no server.

How it works: the release files are encrypted with a random password, so the `.enc` files on the Releases page are useless on their own. `keys.json` holds, per key, only a SHA-256 of the key and that password sealed with the key (AES-GCM). Tester names and keys never appear in the public files.

Needs Node 18+ on your Mac. Run everything from this repo's folder:

1. **New version:** download the two Linux tarballs from the maxwatch "Linux package" workflow run, rename them `maxwatch-linux-x86_64.tar.gz` and `maxwatch-linux-aarch64.tar.gz`, then:
   `node tools/keys.mjs release v0.2.0 maxwatch-linux-x86_64.tar.gz maxwatch-linux-aarch64.tar.gz`
   Create a GitHub release with tag `v0.2.0` in this repo and attach the two **`.enc`** files (never the plain `.tar.gz`). Commit and push `keys.json`.
2. **New tester:** `node tools/keys.mjs add "Name"` prints their key. Commit and push `keys.json`, then send them the key.
3. **Revoke:** `node tools/keys.mjs remove MW-...`, commit and push. To lock out someone who already unlocked, also run step 1 again (new password).
4. `node tools/keys.mjs list` shows who has a key.

`tools/secret.json` and `tools/keys.private.json` stay on your Mac (gitignored). Back them up; losing them means issuing new keys.

Limits: someone with a valid key can still pass on the key or the unlocked file. Keys let you choose who gets in and revoke them, but the real lock is the hub activation key (backlog item 40). The unlock needs HTTPS (it works on https://maxwatch.pro and localhost).
