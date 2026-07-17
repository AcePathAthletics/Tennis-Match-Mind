# MatchMind — Marketing Site

The landing page for **MatchMind**, a tennis match journaling app with AI coaching memory. Players log matches with scores, reflections and opponent analysis; an AI coach remembers every session, tracks patterns across months, and generates pre-match tactical briefings from head-to-head history.

This repository contains the static marketing website. It is fully self-contained (HTML/CSS/vanilla JS, no build step) and deploys directly to GitHub Pages. The product app itself (Next.js + Supabase) lives in a separate repository.

## Features

- Fully responsive, dark-first SaaS landing page (mobile / tablet / desktop)
- Animated hero with a CSS-built phone mockup and floating "coaching memory" chips
- Scroll-triggered reveal animations via `IntersectionObserver` (progressive enhancement — content is never hidden without JS)
- Animated stat counters, FAQ accordion, mobile drawer navigation, legal-text modals
- Client-side validated early-access email form
- Accessibility: semantic landmarks, skip link, ARIA states on all interactive widgets, visible focus rings, `prefers-reduced-motion` support
- SEO: meta description, Open Graph / Twitter cards, JSON-LD structured data
- Zero dependencies, zero frameworks, no build step

## Technology Stack

| Layer | Choice |
|---|---|
| Markup | HTML5, semantic elements |
| Styling | Hand-written CSS3 (custom properties, grid, clamp) |
| Behavior | Vanilla JavaScript (ES5-compatible IIFE) |
| Fonts | Space Grotesk + Inter via Google Fonts |
| Icons | Inline SVG (original, stroke-based) |
| Hosting | GitHub Pages (or any static host) |

## Folder Structure

```
/
├── index.html          # Single-page site, all sections
├── css/
│   └── styles.css      # Design tokens, components, responsive rules
├── js/
│   └── main.js         # Nav, reveal animations, counters, FAQ, form, modal
├── images/
│   └── og-image.png    # Social sharing card
├── assets/             # Reserved for future downloadable assets
├── favicon.svg
├── README.md
├── LICENSE             # MIT
└── .gitignore
```

## Installation

No installation or build step is required.

```bash
git clone https://github.com/<your-username>/matchmind-site.git
cd matchmind-site
```

## Local Development

Open `index.html` directly in a browser, or serve the folder for correct relative-path behavior:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then visit `http://localhost:8080`.

## Deployment (GitHub Pages)

All asset paths are relative, so the site works from a repository subpath without modification.

1. Push this repository to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Select branch `main` and folder `/ (root)`, then save.
5. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

Any other static host (Vercel, Netlify, Cloudflare Pages) also works with zero configuration.

## Design Notes

Visual quality benchmarks (layout rhythm, hierarchy, motion polish) were inspired by leading sports-tech SaaS sites. All code, copy, imagery, and branding in this repository are original.

## License

MIT — see [LICENSE](LICENSE).
