# Publishing Match Point mockups

Static HTML/CSS/JS mockups in this folder can be hosted for free. All asset paths are **relative**, so they work on any static host (including project subpaths like `github.io/<repo>/`).

## Entry points

| Page                 | Path                 | Description                                       |
| -------------------- | -------------------- | ------------------------------------------------- |
| **Hub**              | `index.html`         | Landing page with links to everything             |
| **Gallery**          | `prototype.html`     | Screen-by-screen UI gallery                       |
| **Interactive flow** | `flow/index.html`    | Role picker (player, guest, club admin, platform) |
| Player journey       | `flow/user.html`     | End-to-end player flow                            |
| Club admin           | `flow/club.html`     | Community & tournament management                 |
| Platform admin       | `flow/platform.html` | Cross-community approval & audit                  |
| Legacy admin         | `flow/admin.html`    | Older admin flow (if linked)                      |

After deploy, open the **hub** URL first and navigate from there.

**Gallery ↔ interactive sync:** When changing mockup UI, keep `prototype.html` and `flow/*.html` aligned. See [MOCKUP-SYNC.md](MOCKUP-SYNC.md), [MOCKUP-SYNC-RULE.md](MOCKUP-SYNC-RULE.md), and agent rules for Cursor / Copilot / Codex / Claude (listed in MOCKUP-SYNC.md § Agent rules).

---

## Recommended: GitHub Pages (zero cost)

This repo includes [`.github/workflows/pages.yml`](../../.github/workflows/pages.yml), which publishes **only** `docs/mockups/` (not the large architecture markdown files in `docs/`).

### One-time setup

1. Push `main` to GitHub (workflow must exist on the default branch).
2. In the repo on GitHub: **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”).
4. Push any change under `docs/mockups/`, or run the workflow manually: **Actions → Deploy mockups to GitHub Pages → Run workflow**.

First deploy may take 1–2 minutes. Later deploys run automatically on push to `main` when mockup files change.

### Public URL pattern

For repo `okfriansyah-moh/match-point`:

| Page        | URL                                                             |
| ----------- | --------------------------------------------------------------- |
| Hub         | `https://okfriansyah-moh.github.io/match-point/`                |
| Gallery     | `https://okfriansyah-moh.github.io/match-point/prototype.html`  |
| Flow picker | `https://okfriansyah-moh.github.io/match-point/flow/index.html` |
| Player flow | `https://okfriansyah-moh.github.io/match-point/flow/user.html`  |

General pattern: `https://<github-username>.github.io/<repo-name>/`

### Troubleshooting

- **404 on root**: Confirm Pages source is **GitHub Actions** and the latest workflow run succeeded.
- **Old content**: Hard-refresh (Ctrl/Cmd+Shift+R) or wait a minute for CDN cache.
- **Workflow permission errors**: Settings → Actions → General → Workflow permissions → **Read and write**.

---

## Alternative: `gh-pages` branch (manual)

If you prefer not to use Actions:

```bash
# From repo root, after committing mockups
git subtree push --prefix docs/mockups origin gh-pages
```

Then in **Settings → Pages**, set source to branch **`gh-pages`** / root (`/`).

Same URL pattern as above. Re-run the subtree command whenever mockups change.

---

## Alternative: Netlify Drop (no git push)

1. Zip the contents of `docs/mockups/` (files at zip root, not the `mockups` folder itself).
2. Open [https://app.netlify.com/drop](https://app.netlify.com/drop) and drag the zip.
3. Netlify assigns a random `*.netlify.app` URL; you can rename the site in the dashboard.

Free tier is enough for static mockups. No build step — publish directory is the zip root.

---

## Alternative: Vercel (static)

1. Install Vercel CLI or import the repo at [vercel.com](https://vercel.com).
2. **Root directory**: `docs/mockups`
3. **Framework preset**: Other (no build command)
4. **Output**: `.` (static files only)

You get a `*.vercel.app` URL; custom domains are optional on the free tier.

CLI example from repo root:

```bash
npx vercel docs/mockups --prod
```

---

## Local preview

Any static server works, e.g. from repo root:

```bash
python3 -m http.server 8080 --directory docs/mockups
```

Open [http://localhost:8080/](http://localhost:8080/).

---

## Feedback email (FormSubmit) — one-time setup

The mockup feedback widget sends email via [FormSubmit.co](https://formsubmit.co/) to **rufusrolla@gmail.com**.

| Where you open mockups           | WhatsApp | Email (FormSubmit)          |
| -------------------------------- | -------- | --------------------------- |
| `file://` (double-click HTML)    | ✅ Works | ❌ Use mailto fallback only |
| `http://localhost:8080/`         | ✅ Works | ✅ Works (after activation) |
| **GitHub Pages** (`*.github.io`) | ✅ Works | ✅ Works (after activation) |
| Netlify / Vercel                 | ✅ Works | ✅ Works (after activation) |

**You activate FormSubmit per domain** — localhost and GitHub Pages count as different sites. After deploying, submit feedback once from your **live GitHub Pages URL** and click the new **Activate Form** email (check spam). Localhost activation does not automatically cover `*.github.io`.

| Where you open mockups           | WhatsApp | Email (FormSubmit)                   |
| -------------------------------- | -------- | ------------------------------------ |
| `file://` (double-click HTML)    | ✅ Works | ❌ Mailto fallback only              |
| `http://localhost:8080/`         | ✅ Works | ✅ After **localhost** activation    |
| **GitHub Pages** (`*.github.io`) | ✅ Works | ✅ After **GitHub Pages** activation |
| Netlify / Vercel                 | ✅ Works | ✅ After activation on that host     |

### Setup steps

1. **Local dev** — activate from `http://localhost:8080/...` (you may have done this already).
2. **Deploy to GitHub Pages** — push `main`, enable Actions Pages. Example:
   `https://okfriansyah-moh.github.io/match-point/flow/user.html`
3. **Activate on live URL** — open that URL, send feedback via **Email** once, then click **Activate Form** in the email FormSubmit sends to `rufusrolla@gmail.com`.
4. **Done** — testers on GitHub Pages get inbox delivery; WhatsApp works everywhere with no extra setup.

No code changes are needed when you deploy — the same `feedback.js` calls `https://formsubmit.co/ajax/rufusrolla@gmail.com` from any HTTPS origin.

**Fallback:** on `file://` or if FormSubmit fails, the widget opens your mail app with the message pre-filled.

---

## No GitHub remote?

If the project is only on your machine:

1. Create a repo on GitHub and `git remote add origin <url>`.
2. Follow **GitHub Pages** steps above, **or** use **Netlify Drop** / **Vercel** without pushing the full monorepo — only the `docs/mockups` folder is required for hosting.
