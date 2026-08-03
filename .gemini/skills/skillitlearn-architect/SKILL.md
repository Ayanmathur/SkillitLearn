---
name: skillitlearn-architect
description: Comprehensive architecture, design system, and multi-layer fallback guidelines for the SkillItLearn web application. Use when developing, debugging, refactoring, or auditing SkillItLearn features.
---

# SkillItLearn Architecture & Engineering Guide

This skill provides full engineering standards, design tokens, fallback mechanisms, database schema definitions, and mobile-first layout rules for the **SkillItLearn** platform.

---

## 1. Core Technological Stack

- **Framework**: Next.js 14 (App Router, React Server Components, Server Actions)
- **Database ORM**: Prisma 5+ with PostgreSQL (Supabase backend)
- **Fast-Path Data Access (DAL)**: Lightweight `@supabase/supabase-js` PostgREST client (`src/lib/dal/index.ts`) for zero-cold-start edge rendering
- **Authentication**: Supabase Auth (Cookie-based session handling via `@supabase/ssr`)
- **PDF & QR Generation**: `pdfkit` + `qrcode` with Base64 Data URL streaming fallback
- **Styling**: Vanilla CSS custom variables (`globals.css`) + Tailwind CSS utility classes (`tailwind.config.ts`)
- **Icons**: Inline SVG icons (heroicons / custom stroke icons)

---

## 2. Design System & Theme Specification

### Color Tokens
| CSS Token | Light Value | Dark Value | Usage |
|---|---|---|---|
| `--bg-surface` | `#ffffff` | `#141627` | Page background |
| `--bg-surface-raised` | `#f5f5f5` | `#1c1f36` | Card & container background |
| `--text-primary` | `#1f2937` | `#e4e5ee` | Headings & primary text |
| `--text-secondary` | `#4b5563` | `#a5a8c4` | Subtitles & description text |
| `--accent` | `#5bbd72` | `#66bb6a` | Primary CTA, checkmarks, progress bars |
| `--header-bg` | `#1a1a2e` | `#0f1120` | Dark navy top navigation header bar |
| `--border-color` | `#e5e7ed` | `#2a2e48` | Card & section dividers |

### Default Theme Rule
- Default Theme **MUST ALWAYS** be initialized as **Light Mode** (`defaultTheme="light" enableSystem={false}`).
- Users on PC and Mobile Web launch in clean Light Mode by default, but can manually toggle to Dark Mode via the `<ThemeToggle />` button in the sticky header or mobile dropdown menu.

---

## 3. Mobile Optimization Guidelines (6.1" to 6.7" iOS / Android Screens)

1. **Responsive Typography Scale**:
   - `h1`: `text-2xl sm:text-3xl md:text-5xl lg:text-6xl`
   - `h2`: `text-xl sm:text-2xl md:text-4xl`
   - `h3`: `text-lg sm:text-xl md:text-3xl`
   - `h4`: `text-base sm:text-lg md:text-2xl`
2. **Badge & Button Padding**:
   - Pill badges: `px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm`
   - Action buttons: `px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base`
3. **iOS Back Navigation**:
   - iOS webviews and Safari lack a physical hardware back button.
   - `MobileHeaderControls` (`src/components/layout/mobile-header-controls.tsx`) detects iOS devices (`iPhone`, `iPad`, `iPod` user agents) and renders a glassmorphic `< Back` pill in the sticky header on all non-homepage routes.

---

## 4. Multi-Layer Fallback Architecture

### Auth & User Persistence
- `getCurrentUser()` uses **Prisma ORM** for direct DB lookup, bypassing RLS restrictions.
- **Fallback**: If DB query fails, falls back to minimal Supabase Auth user metadata (`id`, `email`, `fullName`) so the user **never falsely appears signed out**.

### Progress Tracking & Step Completion ("Mark Done")
- **Layer 1**: Saves completed step IDs instantly to Supabase Auth `user_metadata.completed_step_ids`.
- **Layer 2**: Upserts row to Prisma DB `learner_progress` table.
- **Layer 3**: Merges completed step IDs from both auth metadata and Prisma DB queries using a `Set` union, followed by `router.refresh()`.

### Quiz Questions & Grading
- **Primary**: PostgREST fast-fetch from `quiz_questions`.
- **Fallback**: If PostgREST query returns 0 questions or encounters column variations, automatically falls back to Prisma ORM (`prisma.quizQuestion.findMany`).
- **Pass Threshold**: 10 / 15 correct (≥66%). On pass, sets **both** `quizPassed: true` AND `stepsCompleted: true` on `SkillCompletion`.

### Certificate PDF Generation & Download
- **Layer 1 (Signatory)**: If no custom admin template exists for a learning path, `issueCertificate` uses official SkillItLearn default signatory values (`Ayan Mathur`, `Founder & Director, SkillItLearn`).
- **Layer 2 (PDF Storage)**: If Supabase Storage upload or URL signing fails, `getCertificateDownloadUrl` generates a Base64 PDF Data Stream on the fly.
- **Layer 3 (Browser Download)**: `download-client.tsx` triggers Base64 Data URL downloads via a programmatic DOM anchor (`<a download>`), bypassing pop-up blockers in Chrome, Safari, and Firefox.

---

## 5. Dynamic Terminology & Calculation Rules

- **Module → Track Masking**: The database table maps `modules`, but UI titles mask the string dynamically using `maskTitle()` ("Module" → "Track", "Modules" → "Tracks").
- **Realistic Mastery Hours**: Estimated completion hours are calculated as `(trackCount * 5 + 3)` per skill (~18 to 28 hours), reflecting true video study, hands-on practice, and quiz preparation time.
- **Strict Email Verification**: Manual signup requires email verification before login.
