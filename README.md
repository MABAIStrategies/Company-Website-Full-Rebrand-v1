# MAB AI Strategies — Company Website

The official marketing site for **MAB AI Strategies LLC** — "The Agentic Enterprise."
A fast, dependency-free static site (HTML + CSS + vanilla JS, with three.js-style
canvas animations) styled in the cosmic-slate / iridescent dark theme.

> **Status:** Production-ready, staged on GitHub. **Not yet deployed to Vercel** — see
> _Pre-launch checklist_ below before going live on `mabaistrategies.com`.

---

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero torus, 4-phase mechanism pipeline, services, proof, in-motion video band, CTA |
| `services.html` | Pricing (retainers + one-offs), capability modules, in-motion video band, FAQ |
| `about.html` | Founder story (Mark Bockrath), mission/vision, timeline, in-motion video band, tech stack |
| `contact.html` | Contact form + direct-contact methods |
| `404.html` | Branded not-found page |

## Project structure

```
index / services / about / contact / 404 .html
css/   style.css   (core system: nav, hero, sections, footer, motion bands)
       pages.css   (inner-page styles: tiers, about split, timeline, forms, chatbot)
js/    torus.js          liquid torus + cosmic particle field
       hero-animations.js per-page hero canvas scenes
       main.js           reveals, magnetic buttons, pipeline, counters, nav, video autoplay
       chatbot.js        persistent assistant widget (knowledge-base FAQ engine)
assets/ logo.svg, logo-mark.svg, favicon.svg, og-image.svg, portrait-placeholder.svg
media/  agentic-loop-01..03.mp4   (in-motion video bands)
        mark-bockrath.jpg          (founder headshot — see checklist)
robots.txt · sitemap.xml · vercel.json
```

## Pricing model (single source of truth)

Keep these identical across `services.html`, `js/chatbot.js`, and any future collateral.

**Monthly retainers**
- **Foundation** — $2,500/mo · first AI automation layer (audit, up to 2 workflows/mo)
- **Accelerator** — $5,500/mo · _Most popular_ · up to 6 workflows/mo, 1 agent build/quarter, 90-day ROI guarantee
- **Principal** — Custom/mo · fractional Chief AI Officer, unlimited builds

**One-off engagements**
- **AI Readiness Audit** — $2,000
- **Single Workflow / Agent (sprint)** — $3,500+
- **Speaking / Advisory** — custom

These tiers were benchmarked against the 2026 market (AI-automation retainers $2K–$8K/mo,
fractional Chief AI Officer $5K–$10K/mo, single-agent builds $1.5K–$5K) and sit in-band.

## Configuration

- **Contact form** — wired for **Formspree**. In `js/contact.js`, set `FORMSPREE_ID`
  to the 8-character form ID from your Formspree endpoint (`https://formspree.io/f/<ID>`;
  sign up at formspree.io with mark@mabaistrategies.com). Until a real ID is set, the form
  falls back to opening the visitor's email client pre-filled to `CONTACT_EMAIL`, so it
  never silently fails. A honeypot field filters basic spam. (You can point `CONTACT_ENDPOINT`
  at a Make/n8n webhook instead if you prefer.)
- **Calendar** — booking links point to `https://calendar.app.google/kuwKF2VrDuyvdfN9A`.
- **Chatbot logging** — set `CHAT_LOG_ENDPOINT` in `js/chatbot.js` to a webhook
  (Zapier Catch Hook, Make.com, or n8n) to capture every exchange. It POSTs
  `{ ts, page, message, reply, session }` — a 5-column row (Timestamp · Page ·
  Visitor Message · Bot Reply · Session ID). Empty = off.

## Security notes

- The chatbot renders only its trusted knowledge-base answers as HTML; visitor input is
  rendered as inert text (no DOM-based XSS).
- The non-functional "Member Portal" login was removed for launch; an authenticated client
  workspace can be added later (e.g. Supabase) without reworking the page.
- `vercel.json` ships hardened response headers (CSP, HSTS, X-Frame-Options, etc.). They are
  inert until the site is deployed on Vercel.

## Pre-launch checklist (before Vercel)

1. **Headshot** — ✅ in place at `media/mark-bockrath.jpg` (574×728). Swap the file if you want a different shot.
2. **Contact delivery** — set `FORMSPREE_ID` in `js/contact.js` for inbox delivery (otherwise the form uses the mailto fallback).
3. **Verify stats** — confirm public claims ($12M+ impact, 250+ solutions, 16+ years) are accurate.
4. **Analytics** _(optional)_ — add a Plausible/GA4 snippet to each `<head>`.
5. **Share image** _(optional)_ — `assets/og-image.svg` is provided; export a PNG/JPG version
   if you want maximum compatibility with LinkedIn/X link previews.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Deployment

Static — deploy on Vercel (or any static host). DNS for `mabaistrategies.com` points at the
deployment. Do **not** deploy until the pre-launch checklist is cleared.

© 2026 MAB AI Strategies LLC. All rights reserved.
