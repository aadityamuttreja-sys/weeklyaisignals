# claude.md — Website Best Practices

> A reference guide for building a modern, fast, accessible, and SEO-friendly website. Use this file as project-level guidance for AI assistants (e.g., Claude Code) and developers working on the codebase.

---

## 1. Project Overview

**Goal:** Build a production-grade website that ranks well on search engines, loads fast on every device, is accessible to all users, and is easy to maintain.

**Non-negotiables:**
- Core Web Vitals in the "Good" range (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- WCAG 2.2 AA accessibility compliance
- Mobile-first, responsive design
- HTTPS everywhere, security headers configured
- Semantic HTML and crawlable markup
- Structured data (Schema.org / JSON-LD) on key pages

---

## 3. SEO Best Practices

### 3.1 On-Page Fundamentals
- One `<h1>` per page; logical heading hierarchy (`h1` → `h2` → `h3`, no skipping levels).
- Unique, descriptive `<title>` (50–60 chars) and `<meta name="description">` (140–160 chars) per page.
- Canonical URL on every page (`<link rel="canonical" href="...">`).
- Clean, readable URLs: `/blog/seo-checklist` not `/p?id=482`.
- Breadcrumbs on nested pages, marked up with `BreadcrumbList` schema.
- Internal links use descriptive anchor text — avoid "click here" / "read more".

### 3.2 Crawlability & Indexing
- `robots.txt` at root — allow crawling of public pages, disallow `/admin`, `/api/private`, etc.
- XML sitemap at `/sitemap.xml`, submitted to Search Console. Auto-generate from routes/CMS.
- For large sites, split into `sitemap-index.xml` referencing per-section sitemaps.
- Use `noindex` on thin/duplicate pages (search results, faceted filters, staging).
- 301 redirects for moved content; never let internal links point to redirect chains.
- Soft-404s and broken links: zero tolerance — audit with Screaming Frog or Ahrefs.

### 3.3 Structured Data (JSON-LD)
Add Schema.org JSON-LD for the entity types that match your content:
- `Organization` and `WebSite` on the homepage (with `SearchAction` if you have site search).
- `BreadcrumbList` on all nested pages.
- `Article` / `BlogPosting` on editorial content.
- `Product` + `Offer` + `AggregateRating` on product pages.
- `FAQPage` for FAQ blocks.
- `LocalBusiness` if location-based.

Validate with the Rich Results Test and Schema.org validator before shipping.

### 3.4 Open Graph & Social
- `og:title`, `og:description`, `og:image` (1200×630, < 1MB), `og:url`, `og:type` on every page.
- `twitter:card` set to `summary_large_image` for editorial content.
- Auto-generate OG images per page (Vercel OG, Satori, or Cloudinary).

### 3.5 International / Multilingual
- Use `hreflang` tags for language/region variants, including `x-default`.
- Subdirectory strategy (`/en/`, `/de/`) is generally easier than subdomains for SEO consolidation.
- Translate content properly — avoid auto-translated pages getting indexed.

### 3.6 Content Quality (E-E-A-T)
- Show clear authorship: author byline, bio page, expertise indicators.
- Date pages and update them — `datePublished` and `dateModified` in schema.
- Cite primary sources; link out to authoritative references.
- Avoid AI-generated thin content at scale — Google's helpful content system penalizes it.

---

## 4. Performance & Core Web Vitals

### 4.1 Largest Contentful Paint (LCP < 2.5s)
- Server-render or statically generate above-the-fold content.
- Preload the LCP image: `<link rel="preload" as="image" href="..." fetchpriority="high">`.
- Use `next/image` (or equivalent) with `priority` on the hero image only.
- Self-host fonts; preload critical font files; use `font-display: swap`.
- Inline critical CSS for the first viewport; defer the rest.

### 4.2 Interaction to Next Paint (INP < 200ms)
- Minimize and split JavaScript; defer non-critical scripts.
- Avoid long tasks — break work with `scheduler.yield()` or `requestIdleCallback`.
- Use server components / islands so most of the page ships zero JS.
- Lazy-load below-the-fold widgets (chat, video embeds, social feeds).

### 4.3 Cumulative Layout Shift (CLS < 0.1)
- Always set `width` and `height` (or aspect ratio) on images, videos, iframes, ads.
- Reserve space for embeds and dynamically injected banners.
- Avoid inserting content above existing content unless triggered by user input.

### 4.4 Asset Optimization
- Images: AVIF or WebP with JPEG fallback; responsive `srcset` and `sizes`.
- Compress with `sharp`, `squoosh`, or the host's image pipeline.
- Subset fonts; use variable fonts; limit to 2 families and 3–4 weights.
- Tree-shake JS; avoid heavy dependencies (moment.js → date-fns/dayjs; lodash → individual functions).
- Brotli compression at the edge.

### 4.5 Caching
- Static assets: `Cache-Control: public, max-age=31536000, immutable` (with hashed filenames).
- HTML: short `s-maxage` with `stale-while-revalidate` at the CDN.
- Use ISR / on-demand revalidation for content that changes occasionally.

---

## 5. Accessibility (WCAG 2.2 AA)

- Semantic HTML first — use `<button>`, `<nav>`, `<main>`, `<article>`, `<header>`, `<footer>`.
- All interactive elements reachable and operable by keyboard; visible focus states (don't remove `:focus`).
- Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components.
- `alt` text on all meaningful images; empty `alt=""` for decorative ones.
- Form inputs have associated `<label>`s; errors announced via `aria-live`.
- Respect `prefers-reduced-motion` — disable parallax and large transitions.
- Test with keyboard only, with a screen reader (VoiceOver / NVDA), and with axe DevTools.
- Skip-to-content link as the first focusable element.

---

## 6. Security

- HTTPS only; HSTS header (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`).
- Security headers via middleware or host config:
  - `Content-Security-Policy` (start in report-only, tighten over time)
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy` (lock down camera, mic, geolocation by default)
- Secrets in environment variables, never in the repo. Rotate regularly.
- Dependencies: enable Dependabot/Renovate; run `npm audit` in CI.
- Forms: CSRF tokens, rate limiting, server-side validation, bot protection (Turnstile / hCaptcha).
- Auth (if applicable): use a vetted provider (Auth.js, Clerk, WorkOS) — don't roll your own.

---

## 7. Privacy & Compliance

- Cookie banner only if you set non-essential cookies (analytics, marketing). Use a privacy-friendly analytics tool to avoid this entirely where possible.
- GDPR / CCPA: clear privacy policy, data subject request flow, lawful basis documented.
- DSAR / data deletion endpoint or process.
- Don't load third-party scripts before consent in jurisdictions that require it.

---

## 8. Project Structure (Next.js example)

```
/
├── app/                    # routes, layouts, server components
│   ├── (marketing)/        # route group for public pages
│   ├── blog/[slug]/
│   ├── api/
│   ├── layout.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   └── opengraph-image.tsx
├── components/
│   ├── ui/                 # primitives (button, input, etc.)
│   └── sections/           # page-level composites
├── content/                # MDX, if using in-repo content
├── lib/                    # utilities, schema helpers, fetchers
├── public/                 # static assets, favicons, og fallback
├── styles/
├── tests/
├── .env.example
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 9. Coding Conventions

- TypeScript strict mode; no `any` without comment justifying it.
- React server components by default; mark client components explicitly with `"use client"`.
- Co-locate component, styles, and tests.
- One default export per file for components; named exports for utilities.
- Commit messages: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`).
- Branch naming: `feat/short-description`, `fix/issue-123`.
- PRs: small, focused, with screenshots for UI changes.

---

## 10. Pre-Launch Checklist

Run through this before going live and again before any major release.

**SEO**
- [ ] Unique title + meta description on every indexable page
- [ ] Canonical tags correct; no accidental `noindex` in production
- [ ] `robots.txt` and `sitemap.xml` accessible and accurate
- [ ] Structured data validates with Rich Results Test
- [ ] OG tags render correctly (test with opengraph.xyz)
- [ ] Search Console + Bing Webmaster verified, sitemap submitted
- [ ] 301s in place for any URL changes from a previous site
     also create and update llms.txt and check out llmstxt.org for best practices everytime a new blog is published 

**Performance**
- [ ] Lighthouse mobile scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100
- [ ] Core Web Vitals pass on field data (CrUX) where available
- [ ] Bundle analyzer reviewed; no surprise large dependencies
- [ ] Images optimized and serving modern formats

**Accessibility**
- [ ] axe DevTools clean on every template
- [ ] Keyboard navigation works end-to-end
- [ ] Screen reader pass on key flows

**Security**
- [ ] HTTPS, HSTS, CSP, and other headers configured (verify on securityheaders.com)
- [ ] No secrets in client bundles
- [ ] Dependencies up to date, no high/critical CVEs

**Operational**
- [ ] Error monitoring live (Sentry)
- [ ] Uptime monitoring configured
- [ ] Backups (DB + media) automated
- [ ] 404 and 500 pages designed and tested
- [ ] Analytics firing correctly on key events

---

## 11. Useful Commands

```bash
# install
pnpm install

# dev
pnpm dev

# typecheck + lint
pnpm typecheck && pnpm lint

# build & analyze
pnpm build
ANALYZE=true pnpm build

# tests
pnpm test            # unit
pnpm test:e2e        # playwright

# lighthouse against local build
pnpm lhci autorun
```

---

## 12. References

- web.dev/learn — performance, accessibility, PWA fundamentals
- developers.google.com/search — official SEO guidance
- Schema.org — structured data vocabulary
- WCAG 2.2 — accessibility spec
- OWASP Top 10 — security baseline
- Core Web Vitals — current thresholds at web.dev/vitals

---

_Keep this file updated as the stack and standards evolve. When in doubt, prioritize: correctness → accessibility → performance → developer experience._