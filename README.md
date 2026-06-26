# MDM Events Management Website

A modern, high-performance static prototype website for **MDM Events Management** built with **Next.js 15**, **Turbopack**, and **TypeScript**.

## 🎨 Tech Stack & Features

- **Framework:** Next.js 15 (App Router) with Turbopack for lightning-fast development builds.
- **Styling:** CSS Modules & Vanilla CSS (supporting CSS custom variables/tokens for global design alignment).
- **Language:** TypeScript for type safety and clean component properties.
- **Rendering Mode:** Static Site Generation (SSG) / Static Export (`output: 'export'`).
- **Animations:** Custom CSS transitions, keyframes, and scroll-reveal triggers utilizing `IntersectionObserver`.
- **Responsive Design:** Optimized layouts for Desktop, Tablet, and Mobile devices.

---

## 📂 Project Architecture

```text
MDM/
├── public/                     # Static assets (images, logos, icons)
│   ├── logo/                   # Brand logo (mdm-logo.png)
│   └── images/                 # Theme and event photos
├── src/
│   ├── app/                    # Next.js App Router (Layout & Pages)
│   │   ├── globals.css         # CSS variables & typography rules
│   │   ├── about/              # About page
│   │   ├── services/           # Services page
│   │   ├── portfolio/          # Portfolio page
│   │   ├── contact/            # Contact page
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable UI & Layout Components
│   │   ├── layout/             # Header, Footer
│   │   ├── ui/                 # Buttons, Cards, Modals, Scroll Reveals
│   │   ├── home/               # Sections exclusive to Home page
│   │   ├── about/              # Sections exclusive to About page
│   │   ├── services/           # Sections exclusive to Services page
│   │   ├── portfolio/          # Sections exclusive to Portfolio page
│   │   └── contact/            # Sections exclusive to Contact page
│   └── data/                   # Mock content (Services, Portfolio, Stats data)
├── next.config.ts              # Configuration (configured for static export)
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and build scripts
```

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have Node.js installed (v18.x or later recommended).

### Installation

Install the project dependencies:

```bash
npm install
```

### Running Locally (Development)

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### Building for Production (Static Export)

Build and export the project into static HTML/CSS/JS files:

```bash
npm run build
```

The exported site will be generated in the `out/` folder, ready to be deployed on static hosting providers like Netlify, Vercel, GitHub Pages, or AWS S3.

---

## 🏛️ Design Constitution

### Color Palette

- **Primary Brand Red:** `#9B1B30` (CTAs, headings, accents, active states)
- **Primary Brand Red Dark:** `#7A1526` (Hover states)
- **Primary Brand Red Light:** `#C42B42` (Gradients and highlights)
- **Secondary (Dark Navy):** `#1A1A2E` (Hero overlays, dark sections)
- **Dark Background:** `#0D0D1A` (Header, footer)
- **Off-white Background:** `#F7F7F8` (Alternating section backgrounds)
- **Premium Accent Gold:** `#D4A853` (Highlights and special details)

### Typography

- **Headings & Hero Text:** *Playfair Display* (Serif)
- **Body, Nav & Buttons:** *Inter* (Sans-serif)
