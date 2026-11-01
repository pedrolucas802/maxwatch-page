# MaxWatch landing page

Static landing page (HTML + CSS + a few lines of JS, no build step). pt-BR by default, English with the EN button.

Preview: `python3 -m http.server 8000` in this folder, then open http://localhost:8000.

## Publish on GitHub Pages (free)

This repo is public and holds only the site, no product code. Settings > Pages > Source: *Deploy from a branch*, branch `main`, folder `/ (root)`. It goes live at `https://pedrolucas802.github.io/maxwatch-page/`. All links in the page are relative, so it works there and on a custom domain.

## Custom domain, once bought

1. In the domain's DNS add: four `A` records on the apex (`@`) to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`, and a `CNAME` for `www` pointing to `pedrolucas802.github.io`. (Check GitHub's current list in the Pages docs.)
2. Copy `CNAME.example` to `CNAME` and put your domain in it (one line, for example `maxwatch.com.br`). Or set it in Settings > Pages > Custom domain, which creates the same file.
3. Wait for the DNS check, then tick *Enforce HTTPS*.
4. Replace `contato@SEU-DOMINIO` in `index.html` with the real address.

## Brand and domain checklist

- [ ] **INPI first, domain together.** Search the name "MaxWatch" (and "Max Watch") in the INPI trademark base, classes 9 (software), 42 (SaaS) and 45 (security services). A free domain does not mean a free name, and the reverse.
- [ ] Check the name on Google, GitHub, app stores, Instagram and Telegram for clashes before paying for anything.
- [ ] **.com.br via Registro.br** needs a CPF (individual) or CNPJ (company). The registrant is the legal owner, so register in the name that will own the brand (use the CNPJ once the company exists). Needs an account and a Brazilian payment method.
- [ ] Also take the **.com** (any registrar, no CPF needed) and the common typos if cheap. Keep one as the main and redirect the others.
- [ ] Turn on **two-factor login** and auto-renew at the registrar. Use an email that is not tied to the domain itself.
- [ ] Buy only the domain. The site is free on GitHub Pages and email can start as a forwarding address.
- [ ] Before the beta download goes live: privacy policy (LGPD) and a contact email on the page.
