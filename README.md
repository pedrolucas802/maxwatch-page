# MaxWatch landing page

The public website of MaxWatch, live at **https://maxwatch.pro**.

MaxWatch is home security that runs on a small computer inside the house. Edge AI spots people on the cameras you already have, ESP32 sensors (mmWave radar, tripwires, siren) confirm it, and alerts arrive on Telegram. Video never leaves the house. This repo holds only the website, no product code.

- Plain HTML, CSS and a little JS. No framework, no build step, no dependencies.
- Portuguese (pt-BR) by default, English with the EN button or `?lang=en`.
- Hosted free on GitHub Pages from `main`.

## Preview locally

```sh
python3 -m http.server 8000
```

Open http://localhost:8000 (add `?lang=en` for English). The beta key unlock also works here, because browsers treat localhost as secure.

## What's in the repo

| File | What it does |
| --- | --- |
| `index.html` | The whole page: hero, statement, features, "Como podemos ajudar", beta download |
| `style.css` | Colours, layout and every animation (the keyframes are at the bottom) |
| `lang.js` | Language switch, scroll reveals, the scroll-lit statement and the "Saiba mais" popups |
| `unlock.js` | Checks a beta key in the browser and shows the install command |
| `keys.json` | Public list of sealed beta keys (written by `tools/keys.mjs`) |
| `tools/keys.mjs` | Command line tool to publish a release and add or revoke beta keys |
| `favicon.svg`, `CNAME`, `.nojekyll` | Icon, custom domain, and "serve files as they are" for GitHub Pages |

### Page sections

| Section | Anchor | Content |
| --- | --- | --- |
| Hero | top | Headline, short pitch, a mock dashboard |
| Statement | none | The big sentence that lights up word by word while scrolling |
| Features | `#recursos` | Six cards: edge AI, real-time alerts, cameras and hardware, mmWave radar, tripwire + camera, settings |
| How we help | `#como` | The three service steps plus privacy, clips and remote access |
| Beta version | `#baixar` | Key unlock, "request access" email, Linux and macOS buttons |

## Editing

- **Every text exists twice**, once as `<span class="pt">` and once as `<span class="en">`. Change both. Write the Portuguese as a Brazilian would say it, not as a word-for-word translation.
- **Page titles** for each language are in `lang.js` (`titles`).
- **A new feature card:** copy an `<article class="feat reveal">` block in `#recursos`. The `.txt` side holds the kicker, the title, the text, a "Saiba mais" button and a hidden `<ul class="more">` that the popup reads. The `.scene` side holds the inline SVG animation.
- **Animations** are CSS only. They pause when off screen and turn off for visitors who ask for reduced motion. Keep it that way for new ones.
- **No real photos** from a customer's or our own house, and no camera frames. The scenes are drawn in SVG on purpose.
- **Contact email** is in the `mailto:` links in `#baixar` and `#como`.

## Publishing

Everything merged into `main` goes live within a minute or two (Settings > Pages: *Deploy from a branch*, `main`, `/ (root)`, Enforce HTTPS on).

The domain `maxwatch.pro` is registered at Hostinger. The DNS has four `A` records on `@` (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and a `CNAME` from `www` to `pedrolucas802.github.io`. Don't delete the `CNAME` file, or the site drops back to the github.io address.

## Beta access keys

The download is not public. Each tester gets a personal key (`MW-XXXX-XXXX-XXXX-XXXX`), types it in "Já tenho uma chave" and gets a copy-paste command that downloads the package, unlocks it with stock `openssl` and installs it. The unlock happens in the browser, with no server.

**How it stays private:** release files are encrypted with a random password, so the `.enc` files on the Releases page are useless on their own. For each key, `keys.json` holds only a SHA-256 of the key and that password sealed with the key (AES-GCM). Tester names and keys never appear in public files.

You need Node 18+. Run these from the repo folder on your own computer, never in CI:

1. **New version:** download the two Linux tarballs from the maxwatch "Linux package" workflow run and rename them `maxwatch-linux-x86_64.tar.gz` and `maxwatch-linux-aarch64.tar.gz`. Then run:
   ```sh
   node tools/keys.mjs release v0.2.0 maxwatch-linux-x86_64.tar.gz maxwatch-linux-aarch64.tar.gz
   ```
   Create a GitHub release with tag `v0.2.0` in this repo and attach only the two **`.enc`** files, never the plain `.tar.gz`. Commit and push `keys.json`.
2. **New tester:** `node tools/keys.mjs add "Name"` prints their key. Commit and push `keys.json`, then send them the key.
3. **Revoke:** `node tools/keys.mjs remove MW-...`, then commit and push. To lock out someone who already unlocked, also repeat step 1, which sets a new password.
4. **Who has a key:** `node tools/keys.mjs list`.

`tools/secret.json` and `tools/keys.private.json` stay on your computer (they are gitignored). Back them up, because losing them means issuing new keys to everyone.

**Limits:** someone with a valid key can still pass on the key or the unlocked file. Keys decide who gets in and let you revoke access, but the real lock will be the hub activation key (backlog item 40).

## Before wider launch

- [ ] INPI trademark search for "MaxWatch" (classes 9, 42 and 45).
- [ ] Privacy policy (LGPD) linked from the page.
- [ ] Contact address on the domain (for example `contato@maxwatch.pro`) instead of a personal email.
- [ ] Two-factor login and auto-renew at Hostinger.
