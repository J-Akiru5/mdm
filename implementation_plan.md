# MDM Events Management — Website Implementation Plan

## Overview

Build a static prototype website for **MDM Events Management** using **Next.js 15** with **Turbopack** and **static export**. The site will feature 5 pages (Home, About Us, Services, Portfolio/Gallery, Contact) plus a "Get a Quote" modal, all following the visual design from the reference mockup.

**Project Location:** `S:\dev\Monorepo\MDM`
**Export Mode:** Static (`output: 'export'`)
**Deployment:** Prototype only (no backend, no API routes)

---

## Design Constitution

This section defines the immutable design tokens and rules for the entire website.

### 🎨 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#9B1B30` | Primary brand red — CTAs, headings, accents, active nav |
| `--color-primary-dark` | `#7A1526` | Hover state for primary, darker accents |
| `--color-primary-light` | `#C42B42` | Lighter red for gradients, highlights |
| `--color-secondary` | `#1A1A2E` | Deep navy/charcoal — hero overlays, dark sections |
| `--color-dark` | `#0D0D1A` | Header, footer, darkest backgrounds |
| `--color-white` | `#FFFFFF` | Card backgrounds, text on dark |
| `--color-off-white` | `#F7F7F8` | Alternate section backgrounds |
| `--color-gray-100` | `#E8E8EC` | Borders, dividers |
| `--color-gray-300` | `#B0B0BC` | Muted text, placeholders |
| `--color-gray-600` | `#5A5A6E` | Body text on light backgrounds |
| `--color-gray-900` | `#1C1C28` | Heading text on light backgrounds |
| `--color-accent-gold` | `#D4A853` | Sparkle/premium accents (sparingly) |

### 🔤 Typography

| Role | Font | Weight | Size (Desktop) | Size (Mobile) |
|---|---|---|---|---|
| Display / H1 | **Playfair Display** (serif) | 700–900 | 56–64px | 36–40px |
| H2 | **Playfair Display** | 700 | 40–48px | 28–32px |
| H3 | **Playfair Display** | 600 | 28–32px | 22–24px |
| Subtitle / Label | **Inter** (sans-serif) | 600 | 14px uppercase, letter-spacing 3px | 12px |
| Body | **Inter** | 400 | 16–18px | 15–16px |
| Small / Caption | **Inter** | 400 | 13–14px | 12–13px |
| Nav Link | **Inter** | 500 | 15px | 14px |
| Button | **Inter** | 600 | 15px | 14px |

> [!IMPORTANT]
> The serif font (Playfair Display) is used **exclusively** for headings and hero text. All body copy, navigation, buttons, and labels use Inter.

### 📐 Spacing & Layout

| Token | Value | Usage |
|---|---|---|
| `--space-xs` | `4px` | Icon gaps |
| `--space-sm` | `8px` | Tight padding |
| `--space-md` | `16px` | Card padding, element gaps |
| `--space-lg` | `24px` | Section padding intra |
| `--space-xl` | `48px` | Section vertical padding |
| `--space-2xl` | `80px` | Major section vertical spacing |
| `--space-3xl` | `120px` | Hero height padding |
| `--container-max` | `1200px` | Content max-width |
| `--container-wide` | `1400px` | Edge-to-edge sections |
| `--border-radius-sm` | `4px` | Buttons, inputs |
| `--border-radius-md` | `8px` | Cards |
| `--border-radius-lg` | `16px` | Feature cards |
| `--border-radius-pill` | `50px` | Pill buttons |

### 🧩 Component Design Rules

#### Buttons

| Variant | Background | Text | Border | Hover |
|---|---|---|---|---|
| **Primary** | `--color-primary` | White | None | `--color-primary-dark`, slight scale(1.02) |
| **Outline** | Transparent | White or `--color-primary` | 2px solid matching | Fill with `--color-primary`, text → white |
| **Ghost** | Transparent | `--color-gray-600` | None | Text → `--color-primary` |

- Border radius: `--border-radius-sm` (4px)
- Padding: `14px 32px`
- Text: `15px`, `font-weight: 600`, uppercase, `letter-spacing: 1.5px`
- Transition: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`

#### Cards

- Background: `--color-white`
- Border: `1px solid --color-gray-100`
- Border-radius: `--border-radius-md`
- Box-shadow: `0 2px 12px rgba(0,0,0,0.06)`
- Hover: `box-shadow: 0 8px 32px rgba(0,0,0,0.12)`, `translateY(-4px)`
- Transition: `all 0.4s ease`

#### Section Pattern

Alternating backgrounds:
1. White (`--color-white`)
2. Off-white (`--color-off-white`)
3. Dark (`--color-dark` or `--color-secondary`) with white text

Every section has `padding: var(--space-2xl) 0` and is contained within `--container-max`.

#### Navigation

- Sticky header with `backdrop-filter: blur(16px)` + semi-transparent dark background
- Active link: `--color-primary` with bottom border
- Hover: text color transitions to `--color-primary`
- "Get a Quote" button in nav: Primary filled button
- Mobile: Hamburger → slide-in drawer from right

### 🎬 Animation Rules

| Element | Animation | Trigger |
|---|---|---|
| Sections | `fadeInUp` (opacity 0→1, translateY 30px→0) | Scroll into viewport (IntersectionObserver) |
| Cards | `fadeInUp` with staggered delay (0.1s per card) | Scroll into viewport |
| Stats counter | Count-up from 0 to target value | Scroll into viewport |
| Hero text | `fadeInLeft` for heading, `fadeInRight` for image | On page load |
| Buttons | `scale(1.02)` + shadow lift | Hover |
| Nav links | Underline slides in from left | Hover |
| Service icons | `pulse` subtle glow | Hover |
| Modal | `fadeIn` + `scaleUp` from 0.9→1 | Open trigger |

All animations use `prefers-reduced-motion: reduce` media query to disable for accessibility.

---

## Project Architecture

```
S:\dev\Monorepo\MDM\
├── public/
│   ├── logo/                    ← User will upload logo files here
│   │   └── mdm-logo.png
│   ├── images/
│   │   ├── hero/                ← AI-generated hero images
│   │   ├── about/               ← About page images
│   │   ├── services/            ← Service icons/images
│   │   ├── portfolio/           ← Portfolio gallery images
│   │   └── team/                ← Team photos (if needed)
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← Root layout (fonts, metadata, header/footer)
│   │   ├── page.tsx             ← Home page
│   │   ├── globals.css          ← Design tokens + global styles
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── portfolio/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx       ← Sticky nav with mobile drawer
│   │   │   └── Footer.tsx       ← Full footer with columns
│   │   ├── ui/
│   │   │   ├── Button.tsx       ← Reusable button component
│   │   │   ├── SectionHeading.tsx ← Subtitle + heading pattern
│   │   │   ├── Card.tsx         ← Reusable card component
│   │   │   ├── StatCounter.tsx  ← Animated count-up stat
│   │   │   ├── QuoteModal.tsx   ← "Get a Quote" modal form
│   │   │   └── ScrollReveal.tsx ← Intersection Observer animation wrapper
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── CoreValues.tsx   ← Icon strip (Strategic Planning, etc.)
│   │   │   ├── AboutPreview.tsx ← "Who We Are" section
│   │   │   ├── WhatWeDo.tsx     ← Service categories grid
│   │   │   └── CTABanner.tsx    ← "Ready to plan your next event?"
│   │   ├── about/
│   │   │   ├── AboutHero.tsx
│   │   │   ├── StatsSection.tsx
│   │   │   └── MissionVision.tsx
│   │   ├── services/
│   │   │   ├── ServicesHero.tsx
│   │   │   ├── ServicesGrid.tsx
│   │   │   └── ServicesCTA.tsx
│   │   ├── portfolio/
│   │   │   ├── PortfolioHero.tsx
│   │   │   ├── PortfolioFilter.tsx
│   │   │   └── PortfolioGrid.tsx
│   │   └── contact/
│   │       ├── ContactHero.tsx
│   │       ├── ContactForm.tsx
│   │       ├── ContactInfo.tsx
│   │       └── MapEmbed.tsx
│   └── data/
│       ├── services.ts          ← Service data (title, description, icon)
│       ├── portfolio.ts         ← Portfolio items with categories
│       └── stats.ts             ← Stats data (300+, 100+, 10+)
├── next.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## Proposed Changes — Page by Page

### Phase 0 — Project Setup

#### [NEW] Next.js 15 project initialization

- `npx -y create-next-app@latest ./ --typescript --app --turbopack --no-tailwind --no-eslint --no-src-dir` ... actually we will use `src` directory.
- Command: `npx -y create-next-app@latest ./ --typescript --app --turbopack --no-tailwind --no-eslint --src-dir --import-alias "@/*"`
- Configure `next.config.ts` with `output: 'export'` for static generation
- Set up Google Fonts (Playfair Display + Inter) via `next/font/google`
- Create `public/logo/` directory for user's logo upload
- Generate AI placeholder images for hero, about, services, portfolio

#### [NEW] [globals.css](file:///S:/dev/Monorepo/MDM/src/app/globals.css)
- All CSS custom properties (design tokens from constitution above)
- CSS reset / normalize
- Global typography rules
- Utility classes for animations
- Keyframe definitions (`fadeInUp`, `fadeInLeft`, `scaleUp`, `pulse`)
- Responsive breakpoints

---

### Phase 1 — Shared Components

#### [NEW] [Header.tsx](file:///S:/dev/Monorepo/MDM/src/components/layout/Header.tsx)
- Sticky navigation with glassmorphism backdrop
- Logo (left) + nav links (center) + "Get a Quote" button (right)
- Links: Home, About Us, Services, Portfolio, Contact
- Active state detection using `usePathname()`
- Mobile hamburger → slide-in drawer
- Scroll-triggered background opacity change

#### [NEW] [Footer.tsx](file:///S:/dev/Monorepo/MDM/src/components/layout/Footer.tsx)
- 4-column layout: Brand (logo + tagline), Quick Links, Services, Contact Info
- Social media icon row (Facebook, Instagram, YouTube, TikTok)
- Copyright bar at bottom
- Dark background (`--color-dark`)

#### [NEW] [QuoteModal.tsx](file:///S:/dev/Monorepo/MDM/src/components/ui/QuoteModal.tsx)
- Full-screen overlay with centered card
- Form fields: Full Name, Email, Phone, Company, Event Type (dropdown), Event Date, Message
- Close button (X) + click-outside-to-close
- Animated entry: backdrop fade + card scale up
- Non-functional submit for prototype (just closes with a "thank you" state)

#### [NEW] Reusable UI components
- `Button.tsx` — Primary, Outline, Ghost variants
- `SectionHeading.tsx` — Subtitle label + serif heading + optional description
- `Card.tsx` — Image + content pattern with hover effects
- `StatCounter.tsx` — Animated number count-up on scroll
- `ScrollReveal.tsx` — IntersectionObserver wrapper for fade-in animations

---

### Phase 2 — Home Page

#### [NEW] [page.tsx](file:///S:/dev/Monorepo/MDM/src/app/page.tsx) (Home)

**Sections (top to bottom):**

1. **HeroSection** — Full-width dark overlay on event image, serif heading "EVENTS THAT **MOVE** PEOPLE, **BRANDS**, AND **COMMUNITIES**.", subtitle, two CTAs ("Request a Proposal" → Quote Modal, "Talk to Our Team" → Contact page)

2. **CoreValues** — Horizontal icon strip on slightly elevated card. 5 values: Strategic Planning, Creative Design, Professional Execution, On-Ground Management, Memorable Experiences. Red circle icons.

3. **AboutPreview** — Split layout: left text ("Your Event. Professionally Handled." + description + "Learn More About Us" button), right side image collage/grid of event photos.

4. **WhatWeDo** — Dark section, centered heading "We Create. We Plan. We Deliver." 6 category cards in a grid (Corporate Events, Government & Institutional, Brand Activations & Launches, Festivals & Community Events, Exhibits & Trade Fairs, Production & Technical). Each with red icon + title + short description.

5. **CTABanner** — "READY TO PLAN YOUR NEXT EVENT?" with "Get Started" button → Quote Modal

---

### Phase 3 — About Us Page

#### [NEW] [about/page.tsx](file:///S:/dev/Monorepo/MDM/src/app/about/page.tsx)

**Sections:**

1. **AboutHero** — "ABOUT US" heading with subtitle "We bring your vision to life." Clean, minimal hero.

2. **WhoWeAre** — Split layout: left side team/event image, right side "WHO WE ARE" label + description text + paragraph about the team's passion. Right side also contains the MDM logo watermark.

3. **StatsSection** — 3 animated stat counters in a row: `300+` Events Managed, `100+` Happy Clients, `10+` Years of Experience. Red numbers on white cards.

4. **MissionVision** — Two side-by-side cards. Left: "OUR MISSION" with globe icon + text. Right: "OUR VISION" with target icon + text.

---

### Phase 4 — Services Page

#### [NEW] [services/page.tsx](file:///S:/dev/Monorepo/MDM/src/app/services/page.tsx)

**Sections:**

1. **ServicesHero** — "OUR SERVICES" heading + subtitle "Solutions for every type of event." + description paragraph.

2. **ServicesGrid** — 6 service cards in a 3×2 grid:
   - **Event Planning** — Strategy, concept, timeline, budget management
   - **Event Production** — Stage, lights, sound, LED, AV, and technical
   - **Event Management** — On-site management, coordination, logistics
   - **Venue & Supplier Management** — Sourcing and coordinating venues/vendors
   - **Registration & Guest Management** — Attendee registration, check-in systems
   - **Branding & Design** — Backdrops, signage, booth design, marketing materials

   Each card: Image top + red underline title + description.

3. **ServicesCTA** — "Need a customized solution?" banner + "Talk to Our Team" button

---

### Phase 5 — Portfolio / Gallery Page

#### [NEW] [portfolio/page.tsx](file:///S:/dev/Monorepo/MDM/src/app/portfolio/page.tsx)

**Sections:**

1. **PortfolioHero** — "OUR PORTFOLIO" heading + "A glimpse of the events we've made possible."

2. **PortfolioFilter** — Category filter tabs: All, Corporate, Government, Launches, Festivals. Active tab highlighted in red.

3. **PortfolioGrid** — Masonry or uniform grid of event photos. Each item: image + overlay on hover showing event name + category. Filtered by active category with smooth CSS transitions.

4. **PortfolioCTA** — "Your event could be our next success story." + "Let's Plan It" button → Quote Modal

---

### Phase 6 — Contact Page

#### [NEW] [contact/page.tsx](file:///S:/dev/Monorepo/MDM/src/app/contact/page.tsx)

**Sections:**

1. **ContactHero** — "CONTACT US" heading + "Let's create something amazing together."

2. **ContactContent** — Two-column layout:
   - **Left**: "GET IN TOUCH" with contact details (Phone, Email, Address, Hours) + Social media icons
   - **Right**: Contact form (Full Name, Company/Organization, Email Address, Phone Number, Event Type dropdown, Event Date, Message, "Send Message" button)

3. **MapEmbed** — Google Maps iframe embed (placeholder coordinates for Iloilo City). Full-width section.

---

### Phase 7 — Image Generation & Polish

- Generate AI images for:
  - Hero background (concert/event atmosphere with red lighting)
  - About page team/hands-together photo
  - 6 service category images
  - 8–12 portfolio gallery images across categories
  - Event collage images for the About Preview section
- Final responsive testing adjustments
- Animation timing fine-tuning

---

## Verification Plan

### Automated Tests
```bash
npm run build    # Verify static export compiles without errors
```

### Manual Verification
- Browser preview of all 5 pages at desktop (1440px), tablet (768px), and mobile (375px)
- Verify all navigation links work between pages
- Verify "Get a Quote" modal opens/closes correctly
- Verify scroll animations trigger properly
- Verify portfolio filtering works
- Verify responsive mobile menu functions
- Visual comparison against reference design

---

## Open Questions

> [!IMPORTANT]
> **Google Maps API Key**: For the Contact page map embed, do you have a Google Maps API key? Or should I use a simple iframe embed without an API key (limited styling but functional)?

> [!NOTE]
> **Logo Format**: You mentioned you'll upload the logo to the `public/` folder. I'll create `public/logo/` — please add the logo as `mdm-logo.png` (transparent background preferred). I can also save the reference logo from the image you shared.

> [!NOTE]
> **Content Copy**: The reference design has specific copy for mission/vision statements and service descriptions. Should I use the text visible in the reference image, or do you have a copy document with the real content?
