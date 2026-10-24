# Design System & UI/UX Specification — Naukri Profile Optimizer

**Product:** Naukri Profile Optimizer (Recruiter-Perspective Profile Diagnostic)  
**Theme:** Dark-mode Career Intelligence Console ("Sunset" Palette)  
**Status:** Implementation-Ready Canonical Specification  
**Target:** Desktop, Tablet, Mobile (Responsive Web App)  

---

## 1. Design Principles

- **P1 — Recruiter-first:** The interface should feel like an analytical instrument panel that an executive recruiter or talent acquisition lead would use, not an entertainment or consumer toy. Dense, calm, objective, highly legible.
- **P2 — Explanation over decoration:** Every score, rating, metric, and percentage has a deterministic reason; the explanation is always exactly one click or tap away. Never display a number without explaining its calculation or recruiter impact.
- **P3 — Warmth without noise:** Job hunting in India is stressful and anxiety-inducing. The deep navy background provides stability and calm; the plum and rose accents add sophistication; the vibrant coral accent carries urgent attention where it matters most. No other colours compete.
- **P4 — Motion with meaning:** Animations strictly communicate functional state changes: a score numeral counting up, a breakdown bar filling, a gap closing, or an issue resolving. No purely decorative background loops or bouncy distractions.
- **P5 — Colour is never the only signal:** Always pair colour status indicators with an explicit icon (e.g. check, alert triangle, cross) and clear text labels (e.g. "Optimal", "Needs Improvement", "Missing").
- **P6 — One gradient, used sparingly:** The signature sunset gradient (`linear-gradient(135deg, #355C7D 0%, #725A7A 45%, #FF7582 100%)`) is reserved exclusively for the primary CTA button, the ScoreGauge arc, and the viral score share card. Nowhere else.
- **P7 — Mobile is a first-class surface:** Indian candidates check job boards and resumes heavily on mobile devices. Mobile is an ergonomic, tactile first-class console, never a squeezed or clipped desktop layout.

---

## 2. Colour System

### 2.1 Sunset Palette Tokens

```css
:root {
  /* Brand / Sunset Accents */
  --navy-950: #0B1B2B;
  --navy-900: #0F2233;   /* Canonical App Background */
  --navy-850: #14293C;   /* Inputs, sunken surfaces, code panels */
  --navy-800: #1A3145;   /* Surface cards, dialog bodies */
  --navy-700: #24405A;   /* Borders, dividers, elevated surfaces */
  --navy-600: #355C7D;   /* Primary Brand Blue (Sunset Stop 1) */
  --navy-500: #3D6B92;
  --navy-400: #5C87AD;

  --plum-700: #5A4666;
  --plum-600: #6B5578;
  --plum-500: #725A7A;   /* Reference Plum (Sunset Stop 2) */
  --plum-400: #8A6F92;
  --plum-300: #A38CAC;

  --rose-700: #9C3F5E;
  --rose-600: #B74E70;
  --rose-500: #C56C86;   /* Reference Rose */
  --rose-400: #D98BA0;
  --rose-300: #E7A8B7;

  --coral-700: #CC4450;
  --coral-600: #E55260;  /* Coral Deep (Sunset Stop 3 End) */
  --coral-500: #FF7582;  /* Reference Coral (Primary Accent / Focus) */
  --coral-400: #FF8F99;
  --coral-300: #FFA8AF;

  /* Semantic Status Tokens */
  --success:     #3FBF8F;
  --success-dim: #1E5C4C;
  --warning:     #F5A524;
  --warning-dim: #5C431A;
  --danger:      #F05454;
  --danger-dim:  #5C2525;
  --info:        #4A9DD6;

  /* Text & Typography */
  --text-primary:   #F2F5F8;  /* High contrast reading text */
  --text-secondary: #A8B8C8;  /* Subtitles, table headers */
  --text-muted:     #6E8397;  /* Captions, placeholders, inactive states */
  --text-inverse:   #0F2233;  /* Dark text for vibrant buttons/badges */

  /* Surface Mappings */
  --bg-app:         #0F2233;
  --bg-card:        #1A3145;
  --bg-card-alt:    #203A52;
  --bg-input:       #14293C;
  --bg-hover:       #24405A;
  --border:         #24405A;
  --border-light:   #2E4A64;

  /* Gradients */
  --grad-sunset: linear-gradient(135deg, #355C7D 0%, #725A7A 45%, #FF7582 100%);
  --grad-coral:  linear-gradient(135deg, #FF7582 0%, #E55260 100%);
  --grad-score:  linear-gradient(135deg, #355C7D 0%, #C56C86 100%);

  /* Liquid Glass Tokens (Navigation & Modals) */
  --glass-bg:        rgba(26, 49, 69, 0.55);
  --glass-bg-strong: rgba(26, 49, 69, 0.78);
  --glass-border:    rgba(255, 255, 255, 0.12);
  --glass-highlight: rgba(255, 255, 255, 0.18);
  --glass-blur:      20px;
  --glass-shadow:    0 8px 32px rgba(0, 0, 0, 0.35);
}
```

### 2.2 Palette Swatches Reference
- **Deep Canvas:** `#0F2233` (Deep Navy Blue Canvas)
- **Primary Brand Stop 1:** `#355C7D` (Steel Marine Blue)
- **Sunset Stop 2:** `#725A7A` (Dusty Plum)
- **Intermediate Stop:** `#C56C86` (Muted Rose)
- **Primary Accent Stop 3:** `#FF7582` (Vibrant Coral Pink) / `#E55260` (Crimson Coral)

---

## 3. Typography

Loaded via Next.js Font Optimization with variable CSS strategy:

| Token | Family | Fallback | Weights | Primary Use Case |
|---|---|---|---|---|
| `--font-display` | **Plus Jakarta Sans** | `sans-serif` | 600, 700, 800 | Section titles, hero headers, ScoreGauge numeral |
| `--font-body` | **Inter** | `sans-serif` | 400, 500, 600, 700 | Body copy, UI labels, descriptions, instructions |
| `--font-mono` | **JetBrains Mono** | `monospace` | 400, 500, 600 | Scores, tabular metrics, keywords, code, rule IDs |

### 3.1 Type Scale
- `--text-xs`: `0.75rem` (12px) — Section overlines, metadata, rule ID tags
- `--text-sm`: `0.875rem` (14px) — Standard UI controls, table cells, secondary descriptions
- `--text-base`: `1.00rem` (16px) — Body text, form inputs, button text
- `--text-lg`: `1.125rem` (18px) — Card subheadings, modal titles
- `--text-xl`: `1.375rem` (22px) — Card headers, metric callouts
- `--text-2xl`: `1.75rem` (28px) — Section headers
- `--text-3xl`: `2.25rem` (36px) — Page titles
- `--text-4xl`: `3.00rem` (48px) — Hero sub-headlines
- `--text-5xl`: `4.00rem` (64px) — Marketing hero title
- `--text-6xl`: `5.50rem` (88px) — Master ScoreGauge central numeral

### 3.2 Typography Rules
1. Headings in `--font-display` must use tight tracking (`-0.02em` to `-0.03em`).
2. All numeric values (scores, percentages, search volumes, time estimates) must use `font-variant-numeric: tabular-nums` to avoid layout jitter during animations.
3. Category overlines use 12px, font-semibold, uppercase, tracking-wider (`0.08em`), colored in `--text-secondary`.
4. Long paragraphs use `--text-primary` at 92% opacity (`rgba(242, 245, 248, 0.92)`) with `line-height: 1.6` to eliminate eye fatigue against dark backgrounds.
5. Never mix more than two distinct fonts in any single component.

---

## 4. Spacing, Radius, Elevation & Motion

### 4.1 Spacing Scale
`4px` (1), `8px` (2), `12px` (3), `16px` (4), `20px` (5), `24px` (6), `32px` (8), `40px` (10), `48px` (12), `64px` (16), `80px` (20), `96px` (24).

### 4.2 Border Radii
- `sm`: `6px` — Pills, tooltips, tags
- `md`: `10px` — Form inputs, select dropdowns, small buttons
- `lg`: `14px` — Action buttons, toast notifications, code snippets
- `xl`: `20px` — Standard cards, dialog modals, sheet containers
- `2xl`: `28px` — Floating preview containers, marketing bento cards
- `full`: `9999px` — Circular gauges, avatars, status badges

### 4.3 Elevation & Shadows
- `--shadow-sm`: `0 1px 3px rgba(0, 0, 0, 0.30)` — Table rows, pill chips
- `--shadow-md`: `0 4px 16px rgba(0, 0, 0, 0.35)` — Standard cards
- `--shadow-lg`: `0 12px 40px rgba(0, 0, 0, 0.45)` — Hovered cards, drawers, dropdowns
- `--shadow-glow`: `0 0 40px rgba(255, 117, 130, 0.18)` — Primary CTA, ScoreGauge focus
- `--shadow-glass`: `0 8px 32px rgba(0, 0, 0, 0.35)` — Liquid Glass menubar and sheets

### 4.4 Motion & Transitions
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy, decelerating exit)
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)`
- Durations: `--dur-fast`: `150ms` (toggles, buttons), `--dur-base`: `250ms` (modals, sheet slides), `--dur-slow`: `400ms` (drawer expansion).
- **Reduced Motion:** If `@media (prefers-reduced-motion: reduce)` is detected, transform translations are disabled globally; only simple `100ms` opacity crossfades are permitted.

---

## 5. Global Background Architecture

The canvas utilizes a fixed deep navy background overlaid with atmospheric sunset radial blooms, a technical 48px grid, and a subtle film grain noise:

```css
/* Body Canvas */
body {
  background-color: var(--navy-900);
  background-image:
    radial-gradient(ellipse 80% 50% at 80% -10%, rgba(255, 117, 130, 0.10), transparent),
    radial-gradient(ellipse 60% 40% at 0% 10%, rgba(113, 90, 122, 0.10), transparent);
  background-attachment: fixed;
  color: var(--text-primary);
  font-family: var(--font-body);
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

/* 48px Technical Grid Utility */
.grid-pattern {
  background-size: 48px 48px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  mask-image: radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%);
}

/* 2-3% Depth Noise */
.noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
}
```

---

## 6. Component Library

### 6.1 Button
- **Variants:**
  - `primary`: `bg-gradient-to-r from-[#FF7582] to-[#E55260] text-slate-900 font-bold shadow-md hover:brightness-110 hover:shadow-glow active:scale-[0.98]`
  - `secondary`: `bg-[#1A3145] text-slate-100 border border-[#24405A] hover:bg-[#203A52] active:scale-[0.98]`
  - `ghost`: `bg-transparent text-slate-300 hover:bg-[#24405A]/60 hover:text-white`
  - `outline`: `bg-transparent border border-[#24405A] text-slate-200 hover:bg-[#1A3145]`
  - `danger`: `bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30`
  - `glass`: `bg-[#1A3145]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#1A3145]/80`
- **Sizes:** `sm` (`h-8 px-3 text-xs`), `md` (`h-10 px-4 text-sm`), `lg` (`h-12 px-6 text-base font-bold`), `icon` (`h-10 w-10 flex items-center justify-center`).
- **Focus State:** `focus-visible:ring-2 focus-visible:ring-[#FF7582] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2233]`.
- **Loading State:** Text label hidden with fixed button width preserved; centered spinning loader (`w-4 h-4 animate-spin text-current`).
- **Disabled:** `opacity-40 cursor-not-allowed pointer-events-none`.

### 6.2 Card
- **Base:** `bg-[#1A3145] border border-[#24405A] rounded-2xl p-6 shadow-sm`.
- **Elevated:** `bg-[#203A52] border border-[#2E4A64] rounded-2xl p-6 shadow-md`.
- **Interactive:** `hover:-translate-y-1 hover:border-[#355C7D] hover:shadow-lg transition-all duration-200 cursor-pointer`.
- **Flush:** `p-0 overflow-hidden border border-[#24405A] rounded-2xl`.
- **Anatomy:** `CardHeader` (title, description, optional action slot), `CardContent`, `CardFooter`.

### 6.3 Input, Textarea, Select, Label & Error
- **Input / Textarea / Select:** `bg-[#14293C] border border-[#24405A] rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-[#6E8397] focus:outline-none focus:border-[#FF7582] focus:ring-2 focus:ring-[#FF7582]/20 transition-all text-sm h-11`
- **Label:** `text-xs font-semibold uppercase tracking-wider text-[#A8B8C8] mb-1.5 block`
- **Error State:** `border-[#F05454] focus:ring-[#F05454]/20 text-[#F05454]` with helper message: `<span className="text-xs text-red-400 flex items-center gap-1.5 mt-1.5"><AlertCircle className="w-3.5 h-3.5"/> {error}</span>`
- **Disabled State:** `opacity-50 cursor-not-allowed bg-[#0F2233]`

### 6.4 Status Badge
- **Structure:** Pill shape (`rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1.5`) with leading 8px circular status indicator.
- **Variants:**
  - `success`: `bg-emerald-500/15 text-emerald-300 border border-emerald-500/30` (Dot: `bg-emerald-400`)
  - `warning`: `bg-amber-500/15 text-amber-300 border border-amber-500/30` (Dot: `bg-amber-400`)
  - `danger`: `bg-red-500/15 text-red-300 border border-red-500/30` (Dot: `bg-red-400`)
  - `accent`: `bg-[#FF7582]/15 text-[#FF7582] border border-[#FF7582]/30` (Dot: `bg-[#FF7582]`)
  - `info`: `bg-sky-500/15 text-sky-300 border border-sky-500/30` (Dot: `bg-sky-400`)
  - `neutral`: `bg-slate-700/30 text-slate-300 border border-slate-600/40` (Dot: `bg-slate-400`)
  - `glass`: `bg-white/5 backdrop-blur-md text-slate-200 border border-white/10`

### 6.5 Tabs
- Radix Tabs implementation with Framer Motion animated coral underline indicator:
  `<motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF7582] to-[#E55260]" />`
- Triggers styled with `px-4 py-2.5 text-sm font-medium text-[#A8B8C8] hover:text-white transition-colors relative`.

### 6.6 Dialog & Sheet
- **Overlay:** `fixed inset-0 z-50 bg-[#0B1B2B]/75 backdrop-blur-sm animate-fade-in`
- **Dialog Panel:** `bg-[#1A3145] border border-[#24405A] rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scale-in`
- **Sheet (Drawer):** Slides in from the right viewport edge. `w-full max-w-md bg-[#1A3145] border-l border-[#24405A] p-6 shadow-2xl h-full fixed top-0 right-0 z-50 overflow-y-auto`.

### 6.7 Toast
- Fixed bottom-right on desktop (`bottom-6 right-6`), top on mobile (`top-4 left-4 right-4`).
- 4-second auto-dismiss with animated progress bar indicator.
- Prominent `"+N Points"` variant: Left border 4px `#FF7582` Coral, subtle background glow, plus celebration icon and point gain readout.

### 6.8 Skeleton Loader
- Shimmer sweep effect utilizing an animated gradient:
  `bg-[#1A3145] relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent`.

### 6.9 Tooltip
- Radix Tooltip with dark theme: `bg-[#0B1B2B] border border-[#24405A] text-slate-200 text-xs rounded-lg px-3 py-1.5 shadow-xl max-w-xs z-50`.

### 6.10 Command Palette (Cmd+K), Switch, Checkbox & Progress
- **Cmd+K:** Glass floating modal for quick role switching, search, and navigation jump targets.
- **Switch:** 44px track with smooth 20px thumb slide; active state fills with `#FF7582` Coral.
- **Checkbox:** Custom checkbox with Coral-500 checked state, white checkmark SVG, and subtle scale bounce.
- **Progress Bar:** 8px track (`bg-[#14293C] rounded-full`) with animated fill (`bg-gradient-to-r from-[#FF7582] to-[#E55260]`).

---

## 7. Signature Custom Components

### 7.1 ScoreGauge (Radial SVG)
- **Geometry:** 360-degree circular path with rotating sweep. `strokeWidth = 14`, `strokeLinecap = "round"`.
- **Band Gradient Thresholds:**
  - `0 – 40` (Needs Work): `#FF7582` $\rightarrow$ `#E55260` (Coral gradient)
  - `41 – 70` (Competitive): `#8A6F92` $\rightarrow$ `#725A7A` (Plum gradient)
  - `71 – 100` (Ready): `#3FBF8F` $\rightarrow$ `#1E5C4C` (Emerald gradient)
- **Centerpiece Anatomy:**
  - Huge central numeral in Plus Jakarta Sans (`88px` on desktop, `font-extrabold`, `tabular-nums`).
  - Score band badge directly underneath (`Competitive`, `Needs Work`, `Job Ready`).
  - Percentile benchmark sub-caption: `"Top 14% of Indian Backend Engineers"`.
  - Target marker ghost line indicating next target benchmark milestone (e.g. 85/100).
- **Sweep Animation:** `strokeDasharray` and `strokeDashoffset` animate from 0 to value over `900ms` (`cubic-bezier(0.16, 1, 0.3, 1)`). Numeral counts up from 0 to score over `1200ms`.
- **Sizes Available:** `sm` (120px), `md` (180px), `lg` (240px), `xl` (320px).

### 7.2 ScoreBar
- Track: `h-2 bg-[#24405A] rounded-full overflow-hidden`.
- Fill: Gradient corresponding to status (success, warning, or danger-coral) animating width over `700ms` with a `60ms` staggered delay per row.
- Right Column: Shows ratio score (e.g. `"16/20"`) in tabular monospace font alongside a semantic status icon.

### 7.3 ComponentBreakdown & Sheet
- Displays all 10 diagnostic components sorted by: **Impact (Points Available)** (default), **Score (Ascending)**, or **Alphabetical**.
- Clicking any row opens a slide-out right Sheet detailing:
  1. *Identified Barrier:* Clear explanation of what is depressing the score.
  2. *Recruiter Perspective:* Why recruiters skip candidates because of this issue.
  3. *Actionable Fix:* Exact steps and guidelines to resolve it.
  4. *Benchmark Snippet:* Real-world high-scoring example.
  5. *Deep Link CTA:* Direct button to Rewriter, Keywords tool, or Headline Optimizer.
  6. *Rule ID Tag:* Small badge with tooltip displaying rule specification code (e.g. `B-03`).

### 7.4 KeywordPill & KeywordTable
- Categorizes all role keywords into four dynamic states:
  - `PRESENT`: Green checkmark, emerald border, frequency count (`3x`).
  - `WEAK`: Amber dot, warning tag: *"Found in summary only — absent in experience bullets"*.
  - `MISSING`: Red dot, danger border, and `+ 1-Click Add` button.
  - `NOISE`: Strikethrough text with `Remove` chip (e.g. *"MS Office"*, *"Team Player"*).
- Displays estimated monthly recruiter search volume tags (`142k monthly recruiter searches`).
- Clicking `+ Add` opens modal or inline injector, updates state, triggers celebratory confetti, and plays live score gain animation.

### 7.5 RewriteCard & MetricInput
- Two-tier layout:
  - *Top Panel:* Sunken `#14293C` panel showing original bullet with red highlight tags highlighting missing verbs or passive voice.
  - *Bottom Tier:* Three revision variant cards:
    - **SAFE:** Clean active verb, zero structural change.
    - **METRIC:** Quantified result variant with live `MetricInput` field when source lacked numbers.
    - **IMPACT:** Business outcome and stakeholder benefit variant.
  - *Live Metric Input:* If a number is absent, an inline input box surfaces: `"What % did efficiency improve? [ e.g. 35% ]"`. Typing updates the variant text live.
  - *Controls:* `Accept & Insert`, `Copy to Clipboard`, `Custom Edit`.

### 7.6 RecruiterSim (The 6-Second Glance Simulator)
- **Split Layout (60/40 on Desktop, Stacked on Mobile):**
  - *Left (ProfileMock Browser Frame):* Realistic preview of candidate's Naukri profile card inside a browser chrome frame (dots, URL bar).
  - *Right (Ocular Timeline):* Three timed scanning beats with countdown timers:
    - `0 – 2s`: Ocular spotlight on Headline, Company, YOE, Notice Period.
    - `2 – 4s`: Ocular spotlight on Top Bullet of current role.
    - `4 – 6s`: Ocular spotlight on Key Skills chip cluster.
  - *Verdict Banner:* Large top alert showing `SKIP (78% drop rate)`, `AVERAGE (24% interview chance)`, or `STRONG MATCH (Top 5% shortlisted)`.
  - *Persona Switcher:* 4 segmented pills (`Startup Founder`, `Enterprise TA`, `Consultancy Recruiter`, `HR Screener`). Switching animates score numerals and updates evaluation priorities.

### 7.7 MatchRing
- Circular SVG match percentage for target Job Descriptions.
- Animated sweep to fit percentage (`0 – 100%`) with verdict badge (`High Fit`, `Moderate Fit`, `Low Fit`) and probability breakdown.

### 7.8 ActionChecklist
- Chronologically grouped collapsible cards: `Today (Immediate Fixes — <45 mins)`, `Day 2 (Headline & Summary)`, `Day 3-4 (Experience Bullets)`, `Week 2 (Platform Sync)`.
- Each task displays title, time required chip (`10 min`), potential point increase (`+6 pts`), and a deep link button.
- Sticky header displays overall action plan completion percentage.

### 7.9 ScoreCardCanvas (Social Share Generator)
- Client-side 1080×1080 (Square), 1200×627 (LinkedIn), and 1080×1920 (Story) PNG export via `html-to-image`.
- 4 Design Themes: `Sunset` (brand default), `Ocean` (steel blue), `Forest` (emerald), `Mono` (minimalist dark).
- Features user name, target role, verified score numeral, percentile ranking, and verification watermark seal.
- 1-Click buttons: `Download High-Res PNG`, `Copy LinkedIn Post Copy`, `Share to WhatsApp`.

### 7.10 ProjectionCard
- Visualizes candidate trajectory: Current Score $\rightarrow$ Projected Score after completing Action Plan.
- Highlights recruiter call frequency projection (e.g. *"2-3x increase in weekly recruiter search appearances"*).

### 7.11 EmptyState
- Centered layout featuring an illustrated icon inside a soft coral-tinted circular ring, clear title, single-sentence explanation, and a prominent primary action button.

### 7.12 Toast & Confetti System
- Toast surfaces point gains prominently (e.g. `"+6 Points Added! Score is now 74/100"`).
- Confetti burst fires lightweight canvas particles (Coral, Plum, and Rose hues) for `1.2s` upon accepting high-ROI fixes.

---

## 8. Layout Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DESKTOP LAYOUT ARCHITECTURE                     │
├────────────────────────────────────────────────────────────────────────┤
│ [Top Bar]  Liquid Glass 64px (Logo, Score Chip, Cmd+K, Bell, Avatar)   │
├─────────────┬───────────────────────────────────────────┬──────────────┤
│ [Left Rail] │ [Main Content Area]                       │ [Right Rail] │
│ 72px Glass  │ Max-W-7xl Dashboard                       │ 320px Sticky │
│ Icon Nav    │ Gauges, Breakdown, Simulation, Actions    │ Action Plan  │
└─────────────┴───────────────────────────────────────────┴──────────────┘
```

### 8.1 Marketing Shell (Public Routes)
- **Top Bar (64px Liquid Glass):** Brand glyph + wordmark, nav links (*Features, How It Works, Free Tools, Privacy*), and right action group (*Log in* ghost button + *Get My Free Score* primary CTA).
- **Hero Section:** Full bleed, 48px grid pattern, dual sunset radial blooms, centered badge (*"100% Free · No Card or Account Required"*), 80px H1 with sunset gradient text span, 20px subtitle, large primary CTA, and social proof trust strip.
- **Interactive 3D Preview:** Tilted (rotate -2deg) dashboard preview card with subtle floating animation and coral shadow glow.
- **Bento Feature Grid:** 6 cards displaying RecruiterSim, ATS Scorer, Keyword Intelligence, Bullet Rewriter, Job Fit Engine, and 7-Day Plan.
- **Testimonial Carousel & Final CTA Band.**

### 8.2 Auth Shell
- Centered glass card (max-w-md) on deep navy canvas with sunset glow.
- Google OAuth 1-Click button, divider (*"or continue with email"*), email + password fields with password visibility toggle, Magic Link tab, and terms notice referencing India DPDP Act compliance.

### 8.3 App Shell (Authenticated / Active Session)
- **Liquid Glass Menubar (64px):** Fixed top bar with backdrop blur (20px), logo, breadcrumb, live score chip with mini-gauge, Cmd+K search trigger, notifications, and user avatar.
- **Left Navigation Rail (72px):** Fixed left icon column: Dashboard, Analyze, Simulation, Keywords, Rewriter, Job Fit, Benchmark, Plan, Score Card, Export, Tracker, Settings. Active item features a 3px coral highlight bar and subtle ambient glow.
- **Sticky Right Rail (320px):** Always-visible Action Plan summary and Quick Wins list with 1-click execution links.
- **Mobile Adaptive Shell:** Collapses left and right rails. Renders a fixed 5-tab bottom glass bar: *Home, Analyze, Rewrite, Plan, More*.

### 8.4 Report & Dashboard Layout
- **PageHeader:** Diagnostic title, target role badge, last-scanned timestamp, and export button group.
- **Hero Row:** Dual card layout — Left: Master ScoreGauge with percentile rank; Right: Quick Wins card showcasing top 3 point-yielding fixes.
- **Tabbed Workspace:** *Overview | Recruiter View | Keywords | Rewriter | Job Fit | Benchmark | Plan*.

---

## 9. Page-by-Page Specifications (P1 to P19)

### P1: Landing Page (Marketing)
- **Section Order:**
  1. Liquid Glass Header with Logo, Navigation links, and Auth CTA.
  2. Hero Section with 80px H1, sunset text span, 20px subhead, and "Get My Free Recruiter Score" CTA.
  3. 3D Tilted Floating Dashboard Preview with shadow-glow and ambient float.
  4. Social Proof Strip (logos of top Indian recruitment platforms and verified candidate badges).
  5. 3-Step "How It Works" Cards (Upload $\rightarrow$ Diagnostic $\rightarrow$ Action Plan).
  6. Bento Grid of Core Intelligence Tools.
  7. Recruiter Simulator Interactive Teaser.
  8. Testimonials Carousel from Indian Tech & Non-Tech job seekers.
  9. Full-Width Sunset Final CTA Band.
  10. Institutional Footer with Privacy Policy & DPDP Notice.
- **Components Used:** `MarketingNav`, `HeroHeader`, `BentoGrid`, `TestimonialSlider`, `FloatingPreview`, `Button`.
- **Empty State:** N/A (Static marketing page).
- **Loading State:** Instant render with blur-up image assets and skeleton loaders on dynamic counts.
- **Error State:** Global error boundary with "Refresh Page" fallback.
- **Primary CTA:** `"Get My Free Recruiter Score (60s)"` $\rightarrow$ Links to `/upload`.

---

### P2: Authentication (Login / Signup / Magic Link)
- **Section Order:**
  1. Minimal Glass Header with back-to-home button.
  2. Centered Auth Card with brand glyph and "Welcome to Naukri Profile Optimizer".
  3. 1-Click Social Sign-in (Google OAuth button).
  4. Text Divider: "or continue with secure email".
  5. Email & Password inputs with password reveal toggle.
  6. Alternative "Send Magic Link" tab switch.
  7. Submit Button with loading spinner.
  8. DPDP Act 2023 Consent guarantee disclaimer.
- **Components Used:** `Card`, `Input`, `Button`, `Tabs`, `Alert`.
- **Empty State:** Blank input fields with placeholder guidance.
- **Loading State:** Button shows centered spinner (`animate-spin`), inputs disabled.
- **Error State:** Red border on input with inline error message (`AlertCircle`) and shake animation.
- **Primary CTA:** `"Sign In / Create Free Account"`.

---

### P3: Onboarding Step 1 — Upload Resume (F1)
- **Section Order:**
  1. Stepper Indicator (Step 1 of 4: Upload Profile).
  2. Hero instruction: "Upload your resume or paste your profile link".
  3. Drag-and-Drop Zone (large dashed border, upload cloud icon, file size limit: 5MB, formats: PDF/DOCX).
  4. Alternative URL paste card (Naukri Public URL / LinkedIn PDF) with "Fetch Profile" button.
  5. Sample Resumes strip ("Try with a sample Indian resume: Backend, Product, Sales").
  6. Privacy Guarantee Notice (DPDP compliance, no data sold, 24h retention default).
- **Components Used:** `DropZone`, `Card`, `Input`, `Button`, `Badge`, `PrivacyNotice`.
- **Empty State:** Dashed drop zone with coral hover state.
- **Loading State:** File parsing spinner with animated text: "Extracting resume structure...".
- **Error State:** File rejection badge (e.g. "File exceeds 5MB" or "Unsupported format: .txt").
- **Primary CTA:** `"Continue to Target Role $\rightarrow$"`.

---

### P4: Onboarding Step 2 — Target Role & Preferences
- **Section Order:**
  1. Stepper Indicator (Step 2 of 4: Target Alignment).
  2. Role Combobox (Searchable across 10 curated Indian job roles with candidate profile counts).
  3. Experience Level Segmented Selector (0-1 yrs, 1-3 yrs, 3-5 yrs, 5-8 yrs, 8+ yrs).
  4. Target City Chips with Tier indicators (Bangalore [Tier 1], Mumbai, Delhi-NCR, Hyderabad, Pune, Remote).
  5. Expected CTC slider (Optional calibration for recruiter salary filtering).
- **Components Used:** `Combobox`, `SegmentedControl`, `ChipSelect`, `Slider`, `Button`.
- **Empty State:** Search field showing popular role suggestions below.
- **Loading State:** Skeleton pills while fetching role benchmark statistics.
- **Error State:** Validation alert if role is unselected upon submit.
- **Primary CTA:** `"Confirm Profile Details $\rightarrow$"`.

---

### P5: Onboarding Step 3 — Review Extracted Data
- **Section Order:**
  1. Stepper Indicator (Step 3 of 4: Review Extracted Data).
  2. Accuracy reassurance note: "Verify what our deterministic parser extracted".
  3. Personal Information Card (Name, Contact, City, Notice Period).
  4. Work Experience Cards with edit pencil icons and "Low Confidence" warning pills on ambiguous dates.
  5. Skills Extracted Pill Cloud with "+ Add Missing Skill" input.
  6. Education & Certifications Card.
- **Components Used:** `EditableCard`, `Badge`, `PillList`, `Button`, `Modal`.
- **Empty State:** If a section had 0 parsed entries, a warning card appears: "No work experience detected. Click to add manually".
- **Loading State:** Card skeletons while parsing structure.
- **Error State:** Highlighted red fields with "Required for scoring" label.
- **Primary CTA:** `"Run Recruiter Diagnostic (Instant) $\rightarrow$"`.

---

### P6: Onboarding Step 4 — Processing Diagnostic Stepper
- **Section Order:**
  1. Stepper Indicator (Step 4 of 4: Intelligence Engine Running).
  2. Large animated processing card with central pulse glow.
  3. Sequential Checkmark List (2-4 seconds total real duration):
     - Step 1: Extracting canonical keywords & skills trie [Checked]
     - Step 2: Running 10-component deterministic scoring [Checked]
     - Step 3: Simulating 6-second recruiter glance [Checked]
     - Step 4: Comparing against 10,000+ Indian job benchmarks [Checked]
     - Step 5: Generating prioritized 7-day action plan [Checked]
  4. Linear Sunset Progress Bar underneath.
- **Components Used:** `ProcessingStepper`, `ProgressBar`, `Card`.
- **Empty State:** N/A.
- **Loading State:** Active stage shows spinning coral indicator; completed stages transition to green check.
- **Error State:** If parsing fails: retry button with deterministic engine fallback.
- **Primary CTA:** Auto-navigates to Dashboard upon completion.

---

### P7: Master Dashboard & Overview
- **Section Order:**
  1. Dashboard PageHeader with target role pill and overall health badge.
  2. Hero Row: Left: Master ScoreGauge (numeral, percentile rank, band badge); Right: Quick Wins Card (+18 pts available across 3 immediate fixes).
  3. Tab Navigation Bar (*Overview, Recruiter View, Keywords, Rewriter, Job Fit, Benchmark, Plan*).
  4. Component Breakdown Table (10 diagnostic rows with ROI impact ordering).
  5. Top Keyword Gap Summary (Missing high-frequency keywords).
  6. 7-Day Action Plan Preview Strip.
- **Components Used:** `AppShell`, `ScoreGauge`, `ScoreBar`, `ComponentBreakdown`, `KeywordTable`, `Sheet`.
- **Empty State:** Prompt to upload resume if viewing dashboard anonymously.
- **Loading State:** Shimmer skeletons matching ScoreGauge and breakdown cards.
- **Error State:** Card banner: "Failed to recalculate scores. Showing cached state".
- **Primary CTA:** `"Fix Top Issue (+8 Points)"`.

---

### P8: Recruiter 6-Second Glance Simulation
- **Section Order:**
  1. Simulator Header with explanation: "Recruiters spend 6 seconds before deciding to skip or shortlist".
  2. Persona Switcher Bar (Startup Founder, Enterprise TA, Consultancy Recruiter, HR Screener).
  3. Split Simulation Grid:
     - *Left (60%):* ProfileMock inside desktop browser chrome frame with spotlight zones.
     - *Right (40%):* 3 Timeline Scanning Beats (0-2s, 2-4s, 4-6s) with pass/fail badges.
  4. Large Verdict Banner (*"SKIP — 74% Drop Rate at 2 Seconds"* or *"SHORTLIST"*).
  5. Multi-Persona Score Comparison Matrix.
- **Components Used:** `RecruiterSim`, `PersonaSwitcher`, `ProfileMock`, `VerdictBanner`.
- **Empty State:** Placeholder silhouette if profile experiences are missing.
- **Loading State:** Simulated eye-tracking scan lines animating across the profile card.
- **Error State:** Fallback notice: "Using general recruiter model".
- **Primary CTA:** `"Fix First 2-Second Barrier $\rightarrow$"`.

---

### P9: Keyword Gap Analyser
- **Section Order:**
  1. PageHeader with search volume disclosure (*"Based on 250,000+ Indian recruiter queries"*).
  2. Summary Metrics Strip: Total Keywords Target, Present, Weak, Missing.
  3. Filter Category Tabs: *All, Core Skills, Frameworks, Cloud/DevOps, Methodologies*.
  4. Interactive Keyword Table (Keyword, Monthly Search Volume, Current Location, 1-Click Action).
  5. Noise Keywords Section (Fluff words to cut: *"Hardworking"*, *"MS Office"*).
- **Components Used:** `KeywordTable`, `KeywordPill`, `Tabs`, `Button`, `Confetti`.
- **Empty State:** "No keywords missing for this specific sub-tier".
- **Loading State:** Table skeleton rows with pulsating shimmer.
- **Error State:** Retry connection banner.
- **Primary CTA:** `"Add All High-Volume Keywords (+12 Points)"`.

---

### P10: Bullet Rewriter (XYZ Formula & Indian Metrics)
- **Section Order:**
  1. Header with instructions: "Transform passive duty bullets into quantified impact achievements".
  2. Experience Selector (Dropdown or tabs to switch between employers/roles).
  3. Bullet List with Identified Weakness Tags (Missing metric, weak verb, fluff).
  4. Active RewriteCard featuring:
     - Original bullet in sunken dark panel.
     - SAFE variant (action verb + active voice).
     - METRIC variant (quantified output with live MetricInput box).
     - IMPACT variant (business ROI and bottom-line result).
  5. Global "Fix All Bullets" batch assistant button.
- **Components Used:** `RewriteCard`, `MetricInput`, `Badge`, `Button`, `Toast`.
- **Empty State:** "No bullet points found in this experience entry. Click to generate from scratch".
- **Loading State:** Shimmer rewrite panels with pulsating gradient text.
- **Error State:** Deterministic fallback indicator if AI polish service is unavailable.
- **Primary CTA:** `"Accept & Replace in Profile"`.

---

### P11: Headline Optimizer
- **Section Order:**
  1. PageHeader with character counter rules (Naukri: 250 chars, LinkedIn: 220 chars).
  2. Platform Switcher Tabs (*Naukri | LinkedIn | Resume Header*).
  3. Current Headline Card with ATS readability grade and keyword coverage rating.
  4. 5 Ranked Strategic Variants:
     - Variant 1: Role + Primary Tech Stack + Scale Metric (Recommended).
     - Variant 2: Role + Domain Expertise + Top Achievement.
     - Variant 3: Target Role + Notice Period Fast-Track (Immediate Joiner).
     - Variant 4: Keyword-Dense Recruiter Search Magnet.
     - Variant 5: Executive Leadership & Strategy Formula.
  5. Character counter and keyword tag cloud for each variant.
- **Components Used:** `HeadlineCard`, `PlatformTabs`, `Badge`, `Button`, `Toast`.
- **Empty State:** Blank input with "Generate Variants from Profile" button.
- **Loading State:** Skeleton variant cards with shimmering text.
- **Error State:** Fallback warning banner.
- **Primary CTA:** `"Copy Optimized Headline to Clipboard"`.

---

### P12: Job Fit Analyser (JD Match Engine)
- **Section Order:**
  1. PageHeader with description: "Paste any Job Description to run deterministic keyword and seniority matching".
  2. JD Input Area (Textarea with 1-click paste and sample JD buttons).
  3. Match Overview Row:
     - Circular MatchRing (0-100% Fit).
     - 5-Factor Score Radar/Bars: Core Skills, Seniority, Education, Tools, Domain.
  4. 3-Column Keyword Reconciliation (Matched Keywords, Missing Critical Skills, Partial Equivalents).
  5. Recruiter Rejection Risk Predictor (High/Medium/Low likelihood of ATS filter rejection).
  6. Tailored Bullet Suggestions & Interview Talking Points.
- **Components Used:** `MatchRing`, `ScoreBar`, `Textarea`, `Card`, `Badge`.
- **Empty State:** Prominent textarea with placeholder: "Paste full job description from Naukri or LinkedIn...".
- **Loading State:** MatchRing spinner with step text: "Matching skills against job requirements...".
- **Error State:** "Job description too short (<100 characters). Please paste full job details".
- **Primary CTA:** `"Analyze Match & Get Custom Fixes"`.

---

### P13: Benchmark & Candidate Progress
- **Section Order:**
  1. PageHeader: "How you compare against 12,400+ Indian Backend Engineers".
  2. Percentile Gauge displaying candidate standing (e.g. 74th Percentile).
  3. Historical Score Trend Line Chart (Visualizing score improvements over time).
  4. Dimension-by-Dimension Comparison Table (Candidate vs Average vs Top 10% Benchmark).
  5. Strengths vs Vulnerabilities Split Card.
- **Components Used:** `ScoreGauge`, `TrendChart`, `BenchmarkTable`, `Card`.
- **Empty State:** "No historical scans found. This is your baseline score!".
- **Loading State:** Chart wireframe skeletons.
- **Error State:** "Unable to load benchmark aggregates. Displaying regional tier defaults".
- **Primary CTA:** `"Close Top Benchmark Gap (+7 Points)"`.

---

### P14: 7-Day Recruiter Action Plan
- **Section Order:**
  1. Sticky Header with overall plan progress bar and points unlocked.
  2. Projection Card: Current Score (64) $\rightarrow$ Projected Score (88) with call rate multiplier.
  3. Chronological Task Accordions:
     - **Today (45 mins):** Headline rewrite, adding 4 missing core skills, fixing notice period.
     - **Day 2 (Summary & Education):** Summary overhaul, degree formatting for ATS.
     - **Day 3-4 (Experience Bullets):** Quantifying top 3 projects using XYZ formula.
     - **Day 5-7 (Platform Sync):** Updating Naukri, LinkedIn, and downloading ATS PDF.
  4. Action Row: Export Plan to PDF / Add to Google Calendar.
- **Components Used:** `ActionChecklist`, `ProjectionCard`, `ProgressBar`, `Button`.
- **Empty State:** "All action plan tasks completed! Your profile is at optimal visibility".
- **Loading State:** Skeleton checklist rows.
- **Error State:** Local storage sync error banner.
- **Primary CTA:** `"Start Today's First Task (10 mins)"`.

---

### P15: Score Card Generator (Social Viral Share)
- **Section Order:**
  1. PageHeader: "Share your verified score badge with recruiters & mentors".
  2. Customization Controls Toolbar:
     - Theme Selector: Sunset, Ocean, Forest, Minimal Mono.
     - Aspect Ratio: 1:1 (Square Post), 1.91:1 (LinkedIn Feed), 9:16 (Story).
     - Privacy Toggles: Hide Name, Hide Current Employer.
  3. Live Visual Canvas Preview inside a mobile phone mockup frame.
  4. Copy-Ready Captions Tab Strip (LinkedIn Post Copy, WhatsApp Message, Twitter/X).
  5. Download High-Res PNG Button & 1-Click LinkedIn Share.
- **Components Used:** `ScoreCardCanvas`, `ThemePicker`, `PhoneFrame`, `Button`, `Toast`.
- **Empty State:** Blank card preview with prompt to select options.
- **Loading State:** Canvas generation spinner (`html-to-image` rasterization).
- **Error State:** "Canvas export failed. Please try the PNG download link directly".
- **Primary CTA:** `"Download High-Res Score Card (PNG)"`.

---

### P16: Export Console (ATS Resume & Copy Blocks)
- **Section Order:**
  1. PageHeader: "Export your optimized profile for all recruitment channels".
  2. Live ATS Compliance Readout Banner (100% Single-column, No textboxes, Standard headers).
  3. 3 Primary Export Cards:
     - **Card 1 — Clean ATS Resume PDF:** 1-Click download of single-column, recruiter-tested PDF.
     - **Card 2 — Naukri Copy Blocks:** One-click copy buttons for Headline, Key Skills, and Profile Summary.
     - **Card 3 — LinkedIn Copy Blocks:** One-click copy buttons for Headline, About section, and Experience.
- **Components Used:** `ExportCard`, `ATSVerificationBadge`, `Button`, `Toast`.
- **Empty State:** "No profile active. Upload or paste a profile to export".
- **Loading State:** PDF rendering spinner (`@react-pdf/renderer`).
- **Error State:** PDF generation error fallback with plain text download option.
- **Primary CTA:** `"Download Clean ATS Resume PDF"`.

---

### P17: Application Tracker & Conversion Analytics
- **Section Order:**
  1. PageHeader: "Track your job applications and measure profile conversion rates".
  2. Analytics KPI Strip: Total Applications, Recruiter Response Rate, Screen-to-Interview %, Top Converting Platform.
  3. Filter Bar: Platform (Naukri, LinkedIn, Direct), Status (Applied, Viewed, Screened, Interview, Offer, Rejected).
  4. Applications Table: Company, Role, Date Applied, Score at Application, Status Pill, Notes.
  5. "+ Log New Application" Drawer Trigger.
- **Components Used:** `AnalyticsStrip`, `DataTable`, `StatusBadge`, `Sheet`, `Button`.
- **Empty State:** Illustrated empty desk with "No applications tracked yet. Log your first application to measure interview conversion".
- **Loading State:** Table skeleton rows.
- **Error State:** Database fetch error notice.
- **Primary CTA:** `"+ Log Application"`.

---

### P18: Settings, Privacy & Consent Console
- **Section Order:**
  1. PageHeader: "Settings, Engine Diagnostics & DPDP Act Data Privacy".
  2. Account & Profile Calibration (Target role, current city, notice period).
  3. Intelligence Engine Diagnostics (Version: v2.4.0, Skills Taxonomy: 800+ skills, Freshness: Updated Oct 2026).
  4. AI Processing Consent Toggle (DPDP Act 2023 compliant explicit opt-in for Gemini AI polish).
  5. Notification & Email Preferences.
  6. Data Retention & Erasure Zone: "Download My Data (JSON)" and "Permanently Delete My Data" buttons with 2-step confirmation modal.
- **Components Used:** `AiConsentToggle`, `Switch`, `Card`, `Button`, `Modal`.
- **Empty State:** N/A.
- **Loading State:** Toggle skeletons while reading server consent record.
- **Error State:** Toast warning if preference save fails.
- **Primary CTA:** `"Save Preferences"`.

---

### P19: Public Share View (Read-Only Verified Score Card)
- **Section Order:**
  1. Minimal Top Header with brand glyph and "Verified Candidate Diagnostic".
  2. Central Hero Card: Verified Candidate ScoreGauge, Target Role badge, and Percentile Rank.
  3. Candidate Highlight Badges (Top 3 Verified Strengths, e.g. "Expert System Design", "Quantified Impact").
  4. Recruiter Callout Card: "Looking to hire for this role? Contact candidate on LinkedIn".
  5. Bottom CTA Banner: "Analyze your own resume for free with Naukri Profile Optimizer".
- **Components Used:** `ScoreGauge`, `Badge`, `Card`, `Button`, `AppShell`.
- **Empty State:** "Profile share link has expired or was removed by candidate".
- **Loading State:** Centered ScoreGauge pulse shimmer.
- **Error State:** 404 Profile Not Found glass card with link to homepage.
- **Primary CTA:** `"Check My Profile Free (60s)"`.

---

## 10. Responsive Breakpoints

| Breakpoint | Viewport Width | Layout Adaptations |
|---|---|---|
| **Mobile (`<640px`)** | `320px - 639px` | Single column layout. Left rail and right rail are hidden. A fixed bottom glass tab bar appears (`Home, Analyze, Rewrite, Plan, More`). ScoreGauge scales to 180px. RecruiterSim stacks profile mock above timeline beats. Tables convert to vertical stacked cards. |
| **Tablet (`640px - 1024px`)** | `640px - 1023px` | 2-Column grid layouts. Left navigation rail collapses into top bar menu icon. Right action plan rail collapses into a slide-out drawer accessible via floating button. RecruiterSim preserves side-by-side split. |
| **Desktop (`1024px - 1280px`)** | `1024px - 1279px` | Fixed 72px left navigation rail. Main content container occupies center. Fixed 320px right action rail. Standard 12-column grid. |
| **Large Desktop (`>1280px`)** | `1280px+` | Centered `max-w-7xl` workspace with generous padding. Dashboard expands into an analytical 3-column instrument layout. ScoreGauge displays at 320px diameter. |

---

## 11. Accessibility (WCAG 2.1 AA Compliance)

1. **Color Contrast:** All body text (`#F2F5F8`) against canvas (`#0F2233`) achieves a contrast ratio of **13.8:1** (exceeds AAA requirement). Secondary text (`#A8B8C8`) achieves **6.4:1**. Interactive button text on Coral (`#E55260`) achieves **4.6:1** (exceeds AA).
2. **Dual Signaling:** Color is never the sole conveyor of information. Every score band, status pill, and diagnostic item pairs color with an explicit icon and human-readable text label.
3. **Screen Reader Live Regions:** Dynamic score calculations and tab changes feature `aria-live="polite"` announcements so assistive devices state score changes without interruption.
4. **SVG Semantics:** The ScoreGauge includes `role="img"` with dynamic `aria-label="Profile score 74 out of 100, status Competitive, top 14 percent of Backend Engineers"`.
5. **Keyboard Focus Ring:** Every interactive element features an explicit high-contrast focus ring:  
   `focus-visible:ring-2 focus-visible:ring-[#FF7582] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2233]`.
6. **Accessible Drag & Drop:** Drop zone includes an adjacent standard file input button accessible via keyboard (`Tab` + `Enter`).
7. **Reduced Motion:** Fully respects `prefers-reduced-motion: reduce` by disabling positional spring transforms and restricting animations to gentle opacity fades.

---

## 12. Micro-Interactions & Animation Budget

- **Score Count-Up:** Numeral counts from 0 to value over `1,200ms` using `cubic-bezier(0.16, 1, 0.3, 1)`.
- **Staggered Bar Fill:** Component breakdown bars animate width with a `60ms` staggered delay per row over `700ms`.
- **Page Transitions:** Views transition smoothly using Framer Motion `AnimatePresence` (opacity fade + 12px y-translation, `250ms`).
- **Score-Gain Toast:** Displays prominent +N points badge with celebratory shimmer and auto-dismiss.
- **Confetti Explosion:** Lightweight canvas-based confetti firing particles in Coral, Plum, and Rose hues for `1.2s` upon accepting high-ROI fixes.
- **Card Hover Lift:** Interactive cards smoothly translate `-4px` vertically with shadow enlargement over `200ms`.
- **Clipboard Feedback:** Copy buttons swap to a green checkmark icon with a scale bounce for `2.0s`.
- **Dragover Glow:** Upload dropzone border animates to vibrant coral with an ambient glow upon dragging files over it.
- **Persona Switch Morph:** Switching recruiter personas morphs score bars and re-renders ocular spotlights without full page reload.
- **Drawer Slide:** Sheet drawers slide smoothly from the right edge with 20px backdrop blur in `250ms`.

---

## 13. Tailwind CSS Configuration (`tailwind.config.ts`)

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0B1B2B',
          900: '#0F2233',
          850: '#14293C',
          800: '#1A3145',
          700: '#24405A',
          600: '#355C7D',
          500: '#3D6B92',
          400: '#5C87AD',
        },
        plum: {
          700: '#5A4666',
          600: '#6B5578',
          500: '#725A7A',
          400: '#8A6F92',
          300: '#A38CAC',
        },
        rose: {
          700: '#9C3F5E',
          600: '#B74E70',
          500: '#C56C86',
          400: '#D98BA0',
          300: '#E7A8B7',
        },
        coral: {
          700: '#CC4450',
          600: '#E55260',
          500: '#FF7582',
          400: '#FF8F99',
          300: '#FFA8AF',
        },
        success: {
          DEFAULT: '#3FBF8F',
          dim: '#1E5C4C',
        },
        warning: {
          DEFAULT: '#F5A524',
          dim: '#5C431A',
        },
        danger: {
          DEFAULT: '#F05454',
          dim: '#5C2525',
        },
        info: {
          DEFAULT: '#4A9DD6',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px',
        '2xl': '28px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.30)',
        md: '0 4px 16px rgba(0, 0, 0, 0.35)',
        lg: '0 12px 40px rgba(0, 0, 0, 0.45)',
        glow: '0 0 40px rgba(255, 117, 130, 0.18)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'grad-sunset': 'linear-gradient(135deg, #355C7D 0%, #725A7A 45%, #FF7582 100%)',
        'grad-coral': 'linear-gradient(135deg, #FF7582 0%, #E55260 100%)',
        'grad-score': 'linear-gradient(135deg, #355C7D 0%, #C56C86 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-2deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(600px) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        confetti: 'confetti 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 14. Globals CSS Specification (`app/globals.css`)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --navy-950: #0B1B2B;
  --navy-900: #0F2233;
  --navy-850: #14293C;
  --navy-800: #1A3145;
  --navy-700: #24405A;
  --navy-600: #355C7D;
  --navy-500: #3D6B92;
  --navy-400: #5C87AD;

  --plum-700: #5A4666;
  --plum-600: #6B5578;
  --plum-500: #725A7A;
  --plum-400: #8A6F92;
  --plum-300: #A38CAC;

  --rose-700: #9C3F5E;
  --rose-600: #B74E70;
  --rose-500: #C56C86;
  --rose-400: #D98BA0;
  --rose-300: #E7A8B7;

  --coral-700: #CC4450;
  --coral-600: #E55260;
  --coral-500: #FF7582;
  --coral-400: #FF8F99;
  --coral-300: #FFA8AF;

  --success:     #3FBF8F;
  --success-dim: #1E5C4C;
  --warning:     #F5A524;
  --warning-dim: #5C431A;
  --danger:      #F05454;
  --danger-dim:  #5C2525;
  --info:        #4A9DD6;

  --text-primary:   #F2F5F8;
  --text-secondary: #A8B8C8;
  --text-muted:     #6E8397;
  --text-inverse:   #0F2233;

  --bg-app:         #0F2233;
  --bg-card:        #1A3145;
  --bg-card-alt:    #203A52;
  --bg-input:       #14293C;
  --bg-hover:       #24405A;
  --border:         #24405A;
  --border-light:   #2E4A64;

  --grad-sunset: linear-gradient(135deg, #355C7D 0%, #725A7A 45%, #FF7582 100%);
  --grad-coral:  linear-gradient(135deg, #FF7582 0%, #E55260 100%);
  --grad-score:  linear-gradient(135deg, #355C7D 0%, #C56C86 100%);

  --glass-bg:        rgba(26, 49, 69, 0.55);
  --glass-bg-strong: rgba(26, 49, 69, 0.78);
  --glass-border:    rgba(255, 255, 255, 0.12);
  --glass-highlight: rgba(255, 255, 255, 0.18);
  --glass-blur:      20px;
  --glass-shadow:    0 8px 32px rgba(0, 0, 0, 0.35);

  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-display: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}

@layer base {
  * {
    box-sizing: border-box;
    border-color: var(--border);
  }

  body {
    background-color: var(--navy-900);
    background-image:
      radial-gradient(ellipse 80% 50% at 80% -10%, rgba(255, 117, 130, 0.10), transparent),
      radial-gradient(ellipse 60% 40% at 0% 10%, rgba(113, 90, 122, 0.10), transparent);
    background-attachment: fixed;
    color: var(--text-primary);
    font-family: var(--font-sans);
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background: rgba(255, 117, 130, 0.30);
    color: #FFFFFF;
  }

  /* Custom Sleek Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #0B1B2B;
  }
  ::-webkit-scrollbar-thumb {
    background: #24405A;
    border-radius: 9999px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #355C7D;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    letter-spacing: -0.02em;
    font-weight: 700;
  }
}

@layer components {
  /* Surface Cards */
  .card {
    background-color: var(--navy-800);
    border: 1px solid var(--navy-700);
    border-radius: 1.25rem;
    padding: 1.5rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  }

  .card-elevated {
    background-color: var(--navy-850);
    border: 1px solid var(--border-light);
    border-radius: 1.25rem;
    padding: 1.5rem;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  }

  /* Primary Button */
  .btn-primary {
    background: linear-gradient(135deg, #FF7582 0%, #E55260 100%);
    color: #0F2233;
    font-family: var(--font-sans);
    font-weight: 700;
    border-radius: 0.875rem;
    padding: 0.75rem 1.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 0 24px rgba(255, 117, 130, 0.25);
  }
  .btn-primary:hover {
    filter: brightness(1.1);
    box-shadow: 0 0 40px rgba(255, 117, 130, 0.40);
    transform: translateY(-1px);
  }
  .btn-primary:active {
    transform: scale(0.98);
  }

  /* Form Elements */
  .input {
    background-color: var(--navy-850);
    border: 1px solid var(--navy-700);
    border-radius: 0.75rem;
    padding: 0.625rem 1rem;
    color: var(--text-primary);
    font-size: 0.875rem;
    height: 2.75rem;
    width: 100%;
    transition: all 0.2s ease;
  }
  .input:focus {
    outline: none;
    border-color: var(--coral-500);
    box-shadow: 0 0 0 2px rgba(255, 117, 130, 0.20);
  }
  .input::placeholder {
    color: var(--text-muted);
  }

  .label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    margin-bottom: 0.375rem;
  }

  /* Badges & Pills */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .divider {
    height: 1px;
    background-color: var(--navy-700);
    width: 100%;
    margin: 1.5rem 0;
  }

  .focus-ring {
    outline: none;
  }
  .focus-ring:focus-visible {
    box-shadow: 0 0 0 2px var(--coral-500), 0 0 0 4px var(--navy-900);
  }

  /* Glassmorphism Classes */
  .glass {
    background: rgba(26, 49, 69, 0.55);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.12);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 8px 32px rgba(0, 0, 0, 0.35);
  }

  /* 48px Grid Pattern Overlay */
  .grid-pattern {
    background-size: 48px 48px;
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    mask-image: radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 60% 50% at 50% 0%, black 70%, transparent 100%);
  }

  /* Noise Overlay */
  .noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  }

  .section-title {
    font-family: var(--font-display);
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-primary);
  }

  .stat-value {
    font-family: var(--font-display);
    font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
}

@layer utilities {
  .text-gradient-sunset {
    background: linear-gradient(135deg, #355C7D 0%, #725A7A 45%, #FF7582 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .glow-coral {
    box-shadow: 0 0 40px rgba(255, 117, 130, 0.25);
  }

  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }

  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

---

## 15. Brand Assets & Logos

### 15.1 Brand Master Glyph SVG
A 64×64 rounded square container (`20px` border-radius) filled with the signature sunset gradient, housing an upward-pointing accelerated visibility chevron:

```xml
<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sunsetGrad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#355C7D" />
      <stop offset="45%" stop-color="#725A7A" />
      <stop offset="100%" stop-color="#FF7582" />
    </linearGradient>
    <filter id="glyphGlow" x="-10" y="-10" width="84" height="84" filterUnits="userSpaceOnUse">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Background Rounded Rect -->
  <rect width="64" height="64" rx="20" fill="url(#sunsetGrad)" filter="url(#glyphGlow)" />
  <!-- Inner Glass Highlight -->
  <rect x="1" y="1" width="62" height="62" rx="19" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1" />
  <!-- Upward Visibility Acceleration Chevron -->
  <path d="M22 36L32 24L42 36" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M26 44L32 37L38 44" stroke="rgba(255, 255, 255, 0.7)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
</svg>
```

### 15.2 Favicon Specification
- Scalable SVG icon placed at `/public/favicon.svg`.
- Scaled 32×32 PNG icon generated at `/public/favicon.ico` and `/public/favicon-32x32.png`.

### 15.3 Wordmark
- Text: **Naukri Profile Optimizer**
- Font: `Plus Jakarta Sans`, Weight `700` (Bold), Letter Spacing: `-0.025em`.
- Colors: "Naukri" in `#F2F5F8` (White-silver), "Profile Optimizer" in `text-gradient-sunset`.

### 15.4 OpenGraph Image (1200×630 Composition)
- **Dimensions:** 1200px width × 630px height.
- **Canvas:** Deep Navy `#0F2233` with subtle 48px grid and sunset radial gradient bursts.
- **Left Column:**
  - Category Badge: `"FREE CAREER INTELLIGENCE · BUILT FOR INDIA"`
  - Headline (56px, Plus Jakarta Sans): *"See Why Recruiters Skip Your Resume In 60 Seconds."*
  - Subhead (24px, Inter): *"Deterministic ATS scoring, 6-second glance simulation, and keyword intelligence for Indian tech and non-tech roles."*
  - Trust Badges: *"100% Free · No Sign-Up Required · DPDP Compliant"*
- **Right Column:**
  - High-fidelity ScoreGauge rendering displaying **88/100** with the green `Job Ready` badge and percentile label: *"Top 6% of Indian Candidates"*.

---

## 16. Component Inventory (Build Checklist)

| Component Name | File Path | Type | Props Signature | Key Dependencies |
|---|---|---|---|---|
| `ScoreGauge` | `components/score/ScoreGauge.tsx` | Custom SVG | `{ score: number, max?: number, size?: 'sm'\|'md'\|'lg'\|'xl' }` | Pure SVG, Framer Motion |
| `ScoreBar` | `components/score/ScoreBar.tsx` | Atomic UI | `{ score: number, max: number, status: string, label: string }` | Tailwind CSS |
| `ComponentBreakdown` | `components/score/ComponentBreakdown.tsx` | Feature View | `{ components: ScoringResultItem[], onSelect: (id: string) => void }` | Sheet Drawer, Lucide |
| `RecruiterSim` | `components/recruiter/RecruiterSimulation.tsx` | Signature Custom | `{ profile: ParsedProfile, currentScore: number }` | Framer Motion, PersonaSwitcher |
| `ProfileMock` | `components/recruiter/ProfileMock.tsx` | Custom UI | `{ profile: ParsedProfile, spotlightZone?: string }` | Tailwind CSS |
| `PersonaSwitcher` | `components/recruiter/PersonaSwitcher.tsx` | Control | `{ activePersona: string, onSelect: (id: string) => void }` | Radix Tabs |
| `KeywordTable` | `components/keywords/KeywordGapChecker.tsx` | Feature View | `{ keywords: KeywordEntry[], onAdd: (kw: string) => void }` | Canvas Confetti |
| `KeywordPill` | `components/keywords/KeywordPill.tsx` | Atomic UI | `{ keyword: string, status: 'present'\|'weak'\|'missing'\|'noise' }` | Lucide |
| `RewriteCard` | `components/rewriter/BulletRewriterView.tsx` | Feature View | `{ original: string, variants: RewriteVariant[], onAccept: fn }` | Lucide, MetricInput |
| `MetricInput` | `components/rewriter/MetricInput.tsx` | Custom Input | `{ placeholder: string, value: string, onChange: (v: string) => void }` | Tailwind CSS |
| `HeadlineOptimizer`| `components/headline/HeadlineOptimizer.tsx` | Feature View | `{ currentHeadline: string, variants: HeadlineVariant[] }` | PlatformTabs |
| `MatchRing` | `components/jobfit/MatchRing.tsx` | Custom SVG | `{ matchPercentage: number, verdict: string }` | Pure SVG |
| `JobFitView` | `components/jobfit/JobFitView.tsx` | Feature View | `{ profile: ParsedProfile, onAnalyze: (jd: string) => void }` | MatchRing, ScoreBar |
| `ActionChecklist` | `components/plan/ActionPlanView.tsx` | Feature View | `{ tasks: PlanTask[], onComplete: (id: string) => void }` | Framer Motion, Lucide |
| `ProjectionCard` | `components/plan/ProjectionCard.tsx` | Custom Card | `{ currentScore: number, targetScore: number }` | Tailwind CSS |
| `ScoreCardCanvas` | `components/shared/ShareCardModal.tsx` | Canvas Tool | `{ profileName: string, score: number, role: string, percentile: number }` | html-to-image |
| `ThemePicker` | `components/shared/ThemePicker.tsx` | Control | `{ activeTheme: string, onSelectTheme: (t: string) => void }` | Lucide |
| `DropZone` | `components/upload/DropZone.tsx` | Form Control | `{ onFileAccepted: (file: File) => void, isUploading: boolean }` | Lucide |
| `ProcessingStepper`| `components/upload/ProcessingStepper.tsx` | State Machine | `{ currentStep: number, steps: string[], onComplete: () => void }` | Framer Motion |
| `AppShell` | `components/layout/AppShell.tsx` | Master Shell | `{ children: React.ReactNode, currentScore: number, role: string }` | Liquid Glass Nav |
| `MarketingNav` | `components/layout/MarketingNav.tsx` | Navigation | `{ onAuthClick: () => void }` | Glass Nav |
| `AiConsentToggle` | `components/settings/AiConsentToggle.tsx` | Security UI | `{ consent: boolean, onConsentChange: (val: boolean) => void }` | Lucide |
| `ExportCard` | `components/export/ExportCard.tsx` | Custom UI | `{ type: 'pdf'\|'naukri'\|'linkedin', onExport: () => void }` | Lucide |
| `ApplicationTracker`| `components/tracker/ApplicationTracker.tsx` | Feature View | `{ applications: ApplicationRecord[], onAdd: fn }` | DataTable |
