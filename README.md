# Loop & Loom — Handmade Crochet Boutique & LMS Academy

> **Boutique handmade luxury e-commerce platform and online crochet learning management system.**  
> Crafted with Next.js 16 (App Router), TypeScript, Tailwind CSS, Zustand, PostgreSQL + Prisma, NextAuth, Razorpay, and signed HLS video playback.

---

## 🎨 Design Tokens & Aesthetic System

Designed strictly around warm, earthy, tactile textures and mindful slow-fashion sensibilities:

| Token | Hex Value | Purpose |
| :--- | :--- | :--- |
| `--bg` | `#FAF3E8` | Warm organic paper background |
| `--bg-alt` | `#D8C4A8` | Soft flax / subtle divider accents |
| `--accent` | `#A96845` | Terracotta (CTAs, highlighted prices, active tabs) |
| `--text` | `#594333` | Deep espresso readable text |
| `--card` | `#FFFDF8` | Crisp ivory card surface |
| `--border` | `#E7DDCF` | Gentle sand border lines |
| `--muted` | `#85776A` | Subdued secondary typography |

- **Typography**: `Cormorant Garamond` (editorial display headings) + `DM Sans` (clean UI body text)
- **Grid & Radii**: 8px spatial rhythm, 12px / 16px / 24px soft rounded corners, WCAG AA contrast compliance.

---

## 📂 Project Architecture

```
app/
├── prisma/
│   ├── schema.prisma          # PostgreSQL models (User, Product, Variant, Order, Course, Lesson, etc.)
│   └── seed.ts                # Database seeder with products, courses & modules
├── public/
│   └── images/                # High-res handmade crochet imagery & artisan portrait
├── src/
│   ├── app/
│   │   ├── page.tsx           # Home: Hero, Arrivals, Category Grid, Brand Story, Sample Reviews
│   │   ├── shop/page.tsx      # Shop: Faceted filters, search, sort, pagination, empty states
│   │   ├── product/[slug]/    # Product Details: Gallery, color/size variants, stock, Add/Buy, Enquiry
│   │   ├── cart/page.tsx      # Basket: Dynamic list, coupons, shipping goal progress bar
│   │   ├── checkout/page.tsx  # Express Checkout: Zod validation, order summary, Razorpay modal
│   │   ├── courses/page.tsx   # Academy Directory: Level filters, duration, lesson count
│   │   ├── courses/[slug]/    # Course Details: Syllabus accordion, free preview modal, instructor bio
│   │   ├── learn/[slug]/      # Interactive LMS: Video player, captions, speed, progress tracker
│   │   ├── dashboard/page.tsx # User Portal: Enrolled courses, resume player, order history, tracking
│   │   ├── login/page.tsx     # Authentication: Email + Google OAuth toggle, password visibility
│   │   ├── about/page.tsx     # Brand narrative: slow fashion philosophy & artisan collective
│   │   ├── contact/page.tsx   # Studio contact: WhatsApp, email, contact form
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth Credentials + Google
│   │       ├── checkout/route.ts            # Razorpay order generation
│   │       ├── checkout/verify/route.ts     # HMAC-SHA256 signature verification
│   │       ├── courses/token/route.ts       # Signed playback token authorization
│   │       ├── courses/progress/route.ts    # Student lesson progress persistence
│   │       └── enquiry/route.ts             # Custom order commissions & contact notes
│   ├── components/
│   │   ├── Header.tsx         # Sticky navigation with search modal trigger & cart count
│   │   ├── Footer.tsx         # Newsletter subscribe, artisan trust badges, site map
│   │   ├── ProductCard.tsx    # Responsive product card with hover animations & quick add
│   │   ├── CourseCard.tsx     # LMS card with level badge, rating, lesson count
│   │   ├── CartDrawer.tsx     # Slide-out interactive shopping basket
│   │   └── SearchModal.tsx    # Live instantaneous search modal across products & courses
│   └── lib/
│       ├── types.ts           # Complete TypeScript domain contracts
│       ├── data.ts            # Rich sample products, categories, courses, and reviews
│       ├── store.ts           # Zustand cart store with localStorage persistence
│       ├── auth-store.ts      # Zustand auth & course enrollment store
│       └── utils.ts           # Formatting helpers (INR currency, dates, class merging)
```

---

## ⚡ Getting Started Locally

### 1. Prerequisites
- Node.js 18.x or 20+
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your credentials for PostgreSQL, NextAuth secret, and Razorpay test keys if testing real payment gateway interactions.

### 4. Database Setup (Prisma + PostgreSQL)
```bash
# Push schema to database
npx prisma db push

# (Optional) Seed initial products and academy courses
npx tsx prisma/seed.ts
```

### 5. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🛡️ Security, SEO & Performance Best Practices

- **Security**:
  - Payment signatures cryptographically verified with HMAC-SHA256 before order confirmation.
  - Video streams protected by signed playback token middleware; only authorized or free-preview lessons stream.
  - Zod runtime schema validation on checkout forms and API payloads.
- **SEO & Metadata**:
  - Descriptive OpenGraph and Twitter cards configured in `layout.tsx`.
  - Semantic HTML5 headings (`h1` - `h4`), descriptive alt tags on all crochet photography, accessible ARIA labels on all interactive icon buttons.
- **Performance**:
  - Next.js 16 App Router with zero-JS initial layout rendering where possible.
  - Responsive image optimization via `next/image`.
