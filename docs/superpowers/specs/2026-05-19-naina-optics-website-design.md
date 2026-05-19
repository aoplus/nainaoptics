# Naina Optics Website — Design Spec
**Date:** 2026-05-19
**Status:** Approved for implementation

---

## 1. Project Overview

A premium 6-page static website for **Naina Optics** (brand: PIIXELL by Naina Optics), an optical retail shop in Bangalore established in 2014. Built with Eleventy (11ty) SSG and deployed to Cloudflare Pages via GitHub.

### Business Details
| Field | Value |
|---|---|
| Business name | Naina Optics / PIIXELL by Naina Optics |
| Proprietor | Satya P Bharati |
| Phone / WhatsApp | +91 77605 42829 |
| Email | piixell18@gmail.com |
| Address | No. 001, Centre Point, Residency Road, Bangalore – 560025 |
| Hours | Mon–Sun: 10:00 AM – 7:00 PM |
| Founded | 2014 |
| Products | Ray-Ban, Oakley, Crizal, Polaroid, Contact Lenses, Designer Frames |

---

## 2. Technology Stack

| Layer | Choice | Reason |
|---|---|---|
| SSG | Eleventy (11ty) v3 | Minimal config, Nunjucks templates, native Cloudflare Pages support |
| Templates | Nunjucks (.njk) | Familiar HTML syntax, supports loops/includes |
| CSS | Vanilla CSS (single file) | No framework overhead, mobile-first, CSS variables for theming |
| JS | Vanilla JS (2 files) | No dependencies, non-blocking, localStorage for dark mode |
| Deployment | Cloudflare Pages | Free tier, auto-deploy on git push, custom domain, HTTPS |
| Build command | `npx @11ty/eleventy` | |
| Output dir | `_site/` | |

---

## 3. Project Structure

```
site/
├── src/
│   ├── _includes/
│   │   ├── base.njk          # HTML shell: <head>, meta, GA4, viewport
│   │   ├── nav.njk           # Sticky navbar with hamburger menu
│   │   └── footer.njk        # Premium dark footer with newsletter CTA
│   ├── _data/
│   │   ├── site.json         # Business info (phone, address, hours, email)
│   │   ├── products.json     # 9 products across 3 categories
│   │   ├── articles.json     # 15 blog articles
│   │   └── faqs.json         # 20+ FAQs across 5 categories
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css    # All styling (~25–30 KB)
│   │   ├── js/
│   │   │   ├── script.js     # Site-wide JS
│   │   │   └── blog.js       # Blog pagination, filter, search
│   │   └── images/           # Logo and product images (user-supplied)
│   ├── index.njk
│   ├── products.njk
│   ├── about.njk
│   ├── faq.njk
│   ├── contact.njk
│   └── blog.njk
├── .eleventy.js              # Eleventy config (~15 lines)
├── package.json
└── _site/                    # Build output (gitignored, deployed by CF Pages)
```

---

## 4. Shared Templates

### `base.njk`
Every page extends this. Front matter provides:
- `title` — used in `<title>` and OG title
- `description` — used in meta description and OG description
- `pageClass` — added to `<body>` for page-specific CSS hooks

Contains:
- `<meta charset="UTF-8">`, viewport, canonical URL
- Open Graph tags (title, description, image, url, type)
- Google Analytics 4 placeholder: `<!-- TODO: replace G-XXXXXXXXXX with your Measurement ID -->`
- CSS link, dark mode class initializer (reads localStorage before paint to prevent flash)
- `{% include "nav.njk" %}` before `{% block content %}`
- `{% include "footer.njk" %}` after `{% block content %}`
- `script.js` at bottom

### `nav.njk`
- Logo: PIIXELL by Naina Optics (SVG text or image)
- Links: Home · Products · About · Blog · FAQ · Contact
- CTA button: "📞 Call Now" → `tel:+917760542829`
- Dark mode toggle: sun/moon icon button
- Hamburger menu: three-line icon, toggles `.nav-open` class on `<body>`
- Active page highlighted via Eleventy `page.url` comparison

### `footer.njk`
- Top band: newsletter signup form (Mailchimp-ready, `<!-- TODO: add Mailchimp form action URL -->`)
- Four columns: About blurb · Quick Links · Brands We Carry · Contact Info
- Social icons: Facebook, Instagram, WhatsApp
- Bottom bar: copyright, "Built with ❤️ in Bangalore"
- Background: `--primary` (#1e3c72), accents in `--accent` (#ff6b35)

---

## 5. Pages

### 5.1 Homepage (`index.njk`)
Sections in order:
1. **Hero** — headline "See the World Clearly", subheading, two CTAs: WhatsApp chat + Call Now; gradient background `--primary` → `--secondary`
2. **Featured Brands** — logo grid: Ray-Ban, Oakley, Crizal, Polaroid, Fastrack, Lenskart (placeholder SVG badges)
3. **Featured Products** — 3 products from `products.json` where `featured: true`; card: image, name, category tag, short description, "Enquire on WhatsApp" button
4. **Why Choose Us** — 4 icon+text tiles: 10+ Years Experience, Premium Brands, Expert Eye Care, Affordable Prices
5. **Blog Widget** — 3 most recent articles from `articles.json`; card: category tag, title, excerpt, read time, "Read More →"
6. **CTA Banner** — orange background, "Get Expert Advice Today", WhatsApp + Call buttons

### 5.2 Products (`products.njk`)
- **Filter bar** — All · Sunglasses · Eyeglasses · Contact Lenses (JS-powered, no page reload)
- **Product grid** — 9 cards from `products.json`, filtered by `data-category` attribute
- **Product card** — image (600×400px placeholder), category tag, name, price, description, "Enquire on WhatsApp" button (pre-fills product name in message)
- **Enquiry modal** — appears on "Enquire Now" click; fields: Name, Phone, Email, Product (pre-filled), Message; submit opens WhatsApp

**Products (9 total):**
| Category | Products |
|---|---|
| Sunglasses | Ray-Ban Aviator Classic, Oakley Radar EV Path, Polaroid Premium Sport |
| Eyeglasses | Crizal Digital Protection, Titanium Designer Frames, Progressive Varilux |
| Contact Lenses | Acuvue Oasys Daily, FreshLook Colorblends, Bausch & Lomb Ultra |

### 5.3 About (`about.njk`)
1. **Page header** — title + tagline
2. **Our Story** — 2-paragraph narrative about 10 years in Bangalore, mission, vision
3. **Stats bar** — 10+ Years · 5000+ Happy Customers · 20+ Premium Brands · Expert Team
4. **Why Choose Us** — 4 cards with icons (same as homepage but expanded descriptions)
5. **Brands grid** — all brand logos with names
6. **Team section** — Satya P Bharati, Business Head; placeholder for staff

### 5.4 FAQ (`faq.njk`)
- **Search bar** — real-time keyword filter across all questions + answers
- **Category tabs** — About Us · Sunglasses · Eyeglasses · Contact Lenses · Eye Health
- **Accordion items** — from `faqs.json`; smooth CSS transition on open/close; only one open at a time; GA4 event on expand
- **20 FAQs** distributed across 5 categories (4 per category)
- **CTA at bottom** — "Still have questions? Chat with us on WhatsApp"

### 5.5 Contact (`contact.njk`)
1. **Info cards** (4) — Phone (clickable tel:), WhatsApp (wa.me link), Email (mailto:), Location
2. **Google Maps embed** — responsive iframe; `<!-- TODO: replace src with your Google Maps embed URL -->`; pointed at "Centre Point, Residency Road, Bangalore 560025"
3. **Contact form** — Name, Phone, Email, Subject (dropdown), Message; on submit: builds WhatsApp URL and opens in new tab; client-side validation
4. **Business hours table** — Mon–Sun rows
5. **Social links** — Facebook, Instagram, WhatsApp

### 5.6 Blog (`blog.njk`)
- **Featured article banner** — first article in `articles.json` with `featured: true`; large image placeholder, title, excerpt, "Read Full Article →"
- **Search + category filter** — live JS filter; categories: All · Sunglasses · Eyeglasses · Contact Lenses · Eye Care · News
- **Article grid** — 6 articles per page; card: image, category tag (color-coded), title, excerpt, author, date, read time; "Read More →" opens a full-article modal overlay (no separate page routes)
- **Pagination** — Previous / page numbers / Next; JS-driven (no page reload)
- **Related articles** — 3 articles shown below featured banner, matched by `related` IDs in JSON
- **Newsletter CTA** — inline signup form before pagination

---

## 6. Data Files

### `site.json`
```json
{
  "name": "Naina Optics",
  "brandName": "PIIXELL by Naina Optics",
  "phone": "+91 77605 42829",
  "phoneRaw": "917760542829",
  "whatsapp": "917760542829",
  "email": "piixell18@gmail.com",
  "address": "No. 001, Centre Point, Residency Road, Bangalore – 560025",
  "city": "Bangalore",
  "state": "Karnataka",
  "founded": 2014,
  "hours": "Monday – Sunday: 10:00 AM – 7:00 PM",
  "mapEmbedUrl": ""
}
```

### `products.json`
Array of 9 objects:
```json
{
  "id": "rayban-aviator",
  "name": "Ray-Ban Aviator Classic",
  "category": "sunglasses",
  "price": "₹8,999",
  "image": "rayban-aviator.jpg",
  "description": "Timeless aviator style with premium glass lenses and UV400 protection.",
  "featured": true,
  "badge": "Bestseller"
}
```

### `articles.json`
Array of 15 objects:
```json
{
  "id": 1,
  "title": "How to Choose Sunglasses for Your Face Shape",
  "slug": "choose-sunglasses-face-shape",
  "category": "sunglasses",
  "author": "Satya Bharati",
  "date": "2024-03-10",
  "readTime": 5,
  "excerpt": "Finding the right sunglasses starts with knowing your face shape...",
  "image": "blog-sunglasses-face-shape.jpg",
  "featured": true,
  "related": [2, 3],
  "content": "<!-- full article HTML -->"
}
```

### `faqs.json`
Array of 20+ objects:
```json
{
  "category": "sunglasses",
  "question": "What is the difference between polarized and non-polarized lenses?",
  "answer": "Polarized lenses reduce glare from reflective surfaces like water and roads..."
}
```

---

## 7. CSS Architecture

**File:** `src/assets/css/styles.css`

Structure:
1. CSS custom properties (colors, fonts, spacing, transitions)
2. Reset + base styles
3. Typography
4. Layout utilities (container, grid, flex helpers)
5. Components: buttons, cards, badges, forms, modals
6. Nav (sticky, hamburger animation, dark mode toggle)
7. Footer (dark, multi-column, newsletter band)
8. Page-specific: hero, brands, products, blog, FAQ accordion, contact
9. Animations (fade-in on scroll, hover effects, accordion transition)
10. Dark mode overrides (`.dark` class on `<html>`)
11. Media queries (480px, 768px, 1024px breakpoints)

**Color scheme:**
```css
--primary:       #1e3c72;
--secondary:     #2a5298;
--accent:        #ff6b35;
--accent-hover:  #e55a2b;
--bg:            #f8f9fa;
--bg-dark:       #0f1419;
--text:          #333333;
--text-muted:    #666666;
--text-light:    #e0e0e0;
--border:        #e0e0e0;
--border-dark:   #2a3f5f;
--shadow:        0 2px 12px rgba(0,0,0,0.08);
--radius:        8px;
--transition:    300ms ease;
```

---

## 8. JavaScript

### `script.js` (~6–8 KB)
- **Hamburger menu** — toggles `.nav-open` on `<body>`, closes on outside click
- **Product filter** — `data-category` attribute filtering with CSS show/hide
- **FAQ accordion** — smooth max-height transition, one-open-at-a-time
- **FAQ search** — real-time `input` event listener, hides non-matching items
- **Contact form** — validation (required fields, email regex), builds WhatsApp URL, opens `wa.me` link
- **Dark mode** — reads `localStorage`, toggles `.dark` on `<html>`, updates icon
- **GA4 events** — non-blocking tracking for: page_view, product_filter, faq_expand, whatsapp_click, call_click, newsletter_signup, contact_form_submit
- **Newsletter form** — client validation, success state, `<!-- TODO: add Mailchimp fetch() call -->`
- **Scroll animations** — IntersectionObserver for `.fade-in` elements

### `blog.js` (~8–10 KB)
- Reads `articles` array injected by Eleventy into a `<script>` tag as JSON
- **Category filter** — filters article cards by category
- **Search** — filters by title + excerpt text
- **Pagination** — 6 articles per page, renders page buttons dynamically
- **Related articles** — renders 3 related article cards from IDs in featured article's data

---

## 9. SEO

- Each page: unique `<title>`, `<meta name="description">`, Open Graph tags
- `<h1>` on every page, logical H2/H3 hierarchy
- All images: descriptive `alt` text with `<!-- TODO: update alt text -->` fallbacks
- Internal links between all pages
- Target keywords embedded naturally: "optical shop Bangalore", "sunglasses Bangalore", "Ray-Ban Bangalore", "contact lenses Bangalore"
- `robots.txt` (static file in `src/`) and `sitemap.xml` generated via `eleventy-plugin-sitemap` package

---

## 10. Deployment

```
GitHub repo → Cloudflare Pages
Build command:    npx @11ty/eleventy
Output dir:       _site
Node version:     20
```

`.gitignore` includes `_site/`, `node_modules/`.

User steps after build:
1. Create GitHub repo, push code
2. Connect to Cloudflare Pages, set build settings above
3. Add custom domain in Cloudflare Pages settings
4. Replace GA4 Measurement ID placeholder
5. Replace Google Maps embed URL placeholder
6. Add Mailchimp form action URL
7. Add real product images to `src/assets/images/`

---

## 11. Out of Scope (future)

- PWA / service worker
- Email automation (Mailchimp API calls)
- CMS integration
- E-commerce / cart
- Individual blog post pages (articles shown inline on blog.njk for now)
