# Design System & UI/UX Specification: Naukri Profile Optimizer (DESIGN.md)

**Document Version:** 1.0.0  
**Theme:** Dark Theme + Sunset Gradient  
**Palette Identity:** Deep Navy `#0F2233` · Plum `#725A7A` · Rose `#C56C86` · Coral `#FF7582`  
**Typography Strategy:** Plus Jakarta Sans (Display) · Inter (Body) · JetBrains Mono (Code/Metrics)  
**Surface Treatment:** Liquid Glass (Blur 20px, Saturate 180%, 1px Specular Border)

---

## 1. Design Principles

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CORE DESIGN PRINCIPLES                          │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ P1: Recruiter-First│ P2: Explanation    │ P3: Warmth Without Noise     │
│ Dense, calm instru-│ Every score has an │ Coral urgency balanced by    │
│ ment panel mindset.│ explainable reason.│ serene deep navy & plum.     │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ P4: Meaningful     │ P5: Multi-Modal    │ P6: One Canonical Gradient   │
│ Motion only signals│ Never rely solely  │ Sunset reserved for CTA,     │
│ real state changes.│ on color tokens.   │ score arc, and share cards.  │
├────────────────────┴────────────────────┴──────────────────────────────┤
│ P7: First-Class Mobile: Responsive instrument panel, not a squeezed desktop. │
└────────────────────────────────────────────────────────────────────────┘
```

- **P1: Recruiter-First:** The interface avoids consumer fluff or childish gamification. It feels like a high-density intelligence console utilized by an executive recruiter: structured, calm, precise, and data-dense.
- **P2: Explanation Over Decoration:** Every visual gauge, score band, rejection tag, and missing keyword has an underlying rationale. The explainability drawer is always accessible in a single click.
- **P3: Warmth Without Noise:** Job hunting in India is high-stress. We pair the urgency of our signature `#FF7582` Coral with the grounding serenity of `#0F2233` Deep Navy and `#725A7A` Plum. Backgrounds remain uncluttered.
- **P4: Motion With Meaning:** Animations are purposeful telemetry indicators (e.g. gauge arc sweeping to represent a verified calculation, a checklist item crossing off, a score incrementing). Zero looping or distracting hover bounces.
- **P5: Multi-Modal Signaling:** Color is never the sole communicator of state. Scores and alerts are accompanied by an icon and an explicit descriptive label (e.g., Red circle + Alert Triangle + "Critical: Action Required").
- **P6: One Gradient, Used Sparingly:** The sunset gradient (`#355C7D` $\rightarrow$ `#725A7A` $\rightarrow$ `#FF7582`) is reserved exclusively for the primary CTA, the central score gauge value arc, and the social score card.
- **P7: Mobile as a Primary Surface:** Designed mobile-first. Bottom sheets replace slide-out drawers, tables convert to actionable touch cards, and the 6-second recruiter simulation stacks naturally.

---

## 2. Colour System

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SUNSET PALETTE SWATCHES                         │
├───────────────┬────────────────┬───────────────┬───────────────────────┤
│ Navy-900      │ Navy-600       │ Plum-500      │ Rose-500 / Coral-500  │
│ #0F2233       │ #355C7D        │ #725A7A       │ #C56C86 / #FF7582     │
│ Base Canvas   │ Brand Support  │ Palette Anchor│ Primary Accents       │
└───────────────┴────────────────┴───────────────┴───────────────────────┘
```

### 2.1 CSS Custom Properties (`globals.css`)
```css
:root {
  /* ===== BRAND / SUNSET SCALE ===== */
  --navy-950: #0B1B2B;   /* Deepest page base behind canvas layers */
  --navy-900: #0F2233;   /* PRIMARY APP CANVAS BACKGROUND */
  --navy-850: #14293C;   /* Inputs, sunken surfaces, code wells */
  --navy-800: #1A3145;   /* Cards, interactive panels, dropdowns */
  --navy-700: #24405A;   /* Primary structural borders, dividers */
  --navy-600: #355C7D;   /* Brand support blue / muted gradient stop */
  --navy-500: #3D6B92;
  --navy-400: #5C87AD;

  --plum-700: #5A4666;
  --plum-600: #6B5578;
  --plum-500: #725A7A;   /* BRAND ANCHOR PLUM */
  --plum-400: #8A6F92;
  --plum-300: #A38CAC;
  --plum-200: #C0AFC6;

  --rose-700: #9C3F5E;
  --rose-600: #B74E70;
  --rose-500: #C56C86;   /* BRAND ANCHOR ROSE */
  --rose-400: #D98BA0;
  --rose-300: #E7A8B7;
  --rose-200: #F2C6D1;

  --coral-700: #CC4450;
  --coral-600: #E55260;   /* PRIMARY BUTTON BASE (4.6:1 WCAG AA with White) */
  --coral-500: #FF7582;   /* PRIMARY ACCENT CORAL */
  --coral-400: #FF8F99;
  --coral-300: #FFA8AF;
  --coral-200: #FFC5C9;

  /* ===== SEMANTIC TOKENS ===== */
  --success:      #3FBF8F;   /* Verified, Score 86-100, Passed */
  --success-dim:  #1E5C4C;   /* Success background wells */
  --warning:      #F5A524;   /* Warn, Score 41-70, Missing Booster */
  --warning-dim:  #5C431A;   /* Warning background wells */
  --danger:       #F05454;   /* Critical, Score 0-40, Missing Filter */
  --danger-dim:   #5C2525;   /* Danger background wells */
  --info:         #4A9DD6;   /* Informational tooltips, guidelines */

  /* ===== TEXT TOKENS ===== */
  --text-primary:   #F2F5F8; /* 95% White high-contrast body */
  --text-secondary: #A8B8C8; /* Muted captions, metadata */
  --text-muted:     #6E8397; /* Inactive tabs, placeholder text */
  --text-inverse:   #0F2233; /* Dark text for high-contrast coral badges */

  /* ===== SURFACES ===== */
  --bg-app:         var(--navy-900);
  --bg-card:        var(--navy-800);
  --bg-card-alt:    #203A52;
  --bg-input:       var(--navy-850);
  --bg-hover:       #24405A;
  --border:         var(--navy-700);
  --border-light:   #2E4A64;

  /* ===== GRADIENTS ===== */
  --grad-sunset: linear-gradient(135deg, #355C7D 0%, #725A7A 45%, #FF7582 100%);
  --grad-coral:  linear-gradient(135deg, #FF7582 0%, #E55260 100%);
  --grad-score:  linear-gradient(135deg, #355C7D 0%, #C56C86 100%);

  /* ===== LIQUID GLASS (Menubar & Elevated Overlays) ===== */
  --glass-bg:        rgba(26, 49, 69, 0.55);
  --glass-bg-strong: rgba(26, 49, 69, 0.78);
  --glass-border:    rgba(255, 255, 255, 0.12);
  --glass-highlight: rgba(255, 255, 255, 0.18);
  --glass-blur:      20px;
  --glass-shadow:    0 8px 32px rgba(0, 0, 0, 0.35);
}
```

---

## 3. Typography

```
┌────────────────────────────────────────────────────────────────────────┐
│                        TYPOGRAPHY SYSTEM                               │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ Role                │ Typeface                 │ Primary Usage         │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ Display / Numeral   │ Plus Jakarta Sans        │ Headings, Score Gauges│
│ Body / UI           │ Inter                    │ Paragraphs, Labels    │
│ Tabular / Code      │ JetBrains Mono           │ Keywords, Latencies   │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

### 3.1 Type Scale & Hierarchy
| Token | Font Size | Line Height | Tracking | Recommended Font | Primary Context |
|---|---|---|---|---|---|
| `--text-xs` | 0.75rem (12px) | 1.0rem (16px) | `+0.05em` | Inter (600, Upper) | Section headers, status tags, effort chips |
| `--text-sm` | 0.875rem (14px) | 1.25rem (20px)| `normal` | Inter (400, 500) | Secondary metadata, descriptions, helper text |
| `--text-base` | 1.0rem (16px) | 1.5rem (24px) | `normal` | Inter (400, 500) | Standard body text, form input fields |
| `--text-lg` | 1.125rem (18px) | 1.75rem (28px)| `-0.01em` | Plus Jakarta Sans (600)| Card titles, modal headers |
| `--text-xl` | 1.375rem (22px) | 1.75rem (28px)| `-0.02em` | Plus Jakarta Sans (700)| Key analytical view titles |
| `--text-2xl` | 1.75rem (28px) | 2.0rem (32px) | `-0.02em` | Plus Jakarta Sans (700)| Major page headers |
| `--text-3xl` | 2.25rem (36px) | 2.5rem (40px) | `-0.025em`| Plus Jakarta Sans (800)| Hero sub-headings, section anchors |
| `--text-4xl` | 3.0rem (48px) | 3.25rem (52px)| `-0.03em` | Plus Jakarta Sans (800)| Large marketing titles |
| `--text-5xl` | 4.0rem (64px) | 4.25rem (68px)| `-0.03em` | Plus Jakarta Sans (800)| Marketing Hero H1 |
| `--text-6xl` | 5.5rem (88px) | 1.0 | `tabular-nums` | Plus Jakarta Sans (800)| ScoreGauge central numeral |

### 3.2 Typography Rules
- **Tabular Figures for Data:** All scores, percentages, salary amounts, search volumes, and timers MUST specify `font-variant-numeric: tabular-nums` to eliminate jitter during count-up animations.
- **Section Headers:** Rendered as `12px`, `font-semibold`, `uppercase`, `tracking-wider`, with `--text-secondary` color.
- **Body Copy Opacity:** Continuous paragraph text renders at $92\%$ opacity on `--navy-900` to eliminate visual fatigue and halation on OLED/IPS displays.
- **Font Font Pairing Constraint:** Never render more than 2 distinct typefaces inside a single component card.

---

## 4. Spacing, Radius, Elevation & Motion

### 4.1 Spacing Scale
- Micro: `4px` (`space-1`), `8px` (`space-2`), `12px` (`space-3`), `16px` (`space-4`)
- Macro: `20px` (`space-5`), `24px` (`space-6`), `32px` (`space-8`), `40px` (`space-10`), `48px` (`space-12`), `64px` (`space-16`)

### 4.2 Border Radii
- `sm`: `6px` (Status badges, inline chips)
- `md`: `10px` (Input fields, buttons, table rows)
- `lg`: `14px` (Inner cards, modal sections)
- `xl`: `20px` (Main dashboard cards, liquid glass panels)
- `2xl`: `28px` (Floating action drawers, marketing bento cards)
- `full`: `9999px` (Pills, circular gauges, avatar frames)

### 4.3 Shadows & Elevation
- `--shadow-sm`: `0 1px 3px rgba(0,0,0,0.30)` (Sunken input fields)
- `--shadow-md`: `0 4px 16px rgba(0,0,0,0.35)` (Standard cards)
- `--shadow-lg`: `0 12px 40px rgba(0,0,0,0.45)` (Floating modals, sheets)
- `--shadow-glow`: `0 0 40px rgba(255,117,130,0.18)` (Primary CTA highlight)
- `--shadow-glass`: `0 8px 32px rgba(0,0,0,0.35)` (Liquid glass menubar)

### 4.4 Motion & Transitions
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-in-out`: `cubic-bezier(0.65, 0, 0.35, 1)`
- `--dur-fast`: `150ms` (Button active states, tooltip fade)
- `--dur-base`: `250ms` (Card hover lifts, tab transitions)
- `--dur-slow`: `400ms` (Drawer slide-ins, modal reveals)
- **Reduced Motion:** When `@media (prefers-reduced-motion: reduce)` is active, all translation animations are completely disabled; opacity changes are clamped to $100\text{ms}$.

---

## 5. Global Background Architecture

The app background uses fixed radial sunset gradients layered behind a subtle technical grid pattern:

```css
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

/* Noise Texture for Depth */
.noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
}
```

---

## 6. Core Component Library

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPONENT LIBRARY ANATOMY                       │
├───────────────┬────────────────┬───────────────┬───────────────────────┤
│ 6.1 Buttons   │ 6.2 Cards      │ 6.3 Inputs    │ 6.4 Status Badges     │
│ 5 Variants    │ 4 Surfaces     │ 3 Fields      │ 7 Semantic Pills      │
├───────────────┼────────────────┼───────────────┼───────────────────────┤
│ 6.5 Tabs      │ 6.6 Dialogs    │ 6.7 Toasts    │ 6.8 - 6.10 Tooltips,  │
│ Sliding Coral │ Sheet Drawers  │ +N Point Glow │ Skeletons & Command K │
└───────────────┴────────────────┴───────────────┴───────────────────────┘
```

### 6.1 Button
- **Variants:**
  - `primary`: `bg-gradient-to-r from-[#FF7582] to-[#E55260] text-slate-900 font-extrabold shadow-md hover:brightness-110 hover:shadow-glow`
  - `secondary`: `bg-[#1A3145] text-slate-100 border border-[#24405A] hover:bg-[#203A52]`
  - `ghost`: `bg-transparent text-slate-300 hover:bg-[#24405A]/60 hover:text-white`
  - `outline`: `bg-transparent border border-[#24405A] text-slate-200 hover:bg-[#1A3145]`
  - `danger`: `bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30`
  - `glass`: `bg-[#1A3145]/50 backdrop-blur-md border border-white/10 text-white hover:bg-[#1A3145]/80`
- **Sizes:** `sm` (`h-8 px-3 text-xs`), `md` (`h-10 px-4 text-sm`), `lg` (`h-12 px-6 text-base font-bold`), `icon` (`h-10 w-10 flex items-center justify-center`).
- **Focus State:** `focus-visible:ring-2 focus-visible:ring-[#FF7582] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2233]`
- **Loading State:** Label hidden, width preserved, spinner in center (`w-4 h-4 animate-spin`).

### 6.2 Card
- **Base:** `bg-[#1A3145] border border-[#24405A] rounded-2xl p-6 shadow-sm`
- **Elevated:** `bg-[#203A52] border border-[#2E4A64] rounded-2xl p-6 shadow-md`
- **Interactive:** `hover:-translate-y-1 hover:border-[#355C7D] hover:shadow-lg transition-all duration-200 cursor-pointer`
- **Flush:** `p-0 overflow-hidden` (Tables, score card renders)

### 6.3 Input / Textarea / Select
- **Styling:** `bg-[#14293C] border border-[#24405A] rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-[#6E8397] focus:outline-none focus:border-[#FF7582] focus:ring-2 focus:ring-[#FF7582]/20 transition-all text-sm`
- **Error State:** `border-[#F05454] focus:ring-[#F05454]/20` with helper text: `<span className="text-xs text-red-400 flex items-center gap-1 mt-1.5"><AlertCircle className="w-3.5 h-3.5"/> {error}</span>`

### 6.4 Badge
- **Pill Structure:** `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold`
- **Variants:**
  - `success`: `bg-emerald-500/15 text-emerald-300 border border-emerald-500/30`
  - `warning`: `bg-amber-500/15 text-amber-300 border border-amber-500/30`
  - `danger`: `bg-red-500/15 text-red-300 border border-red-500/30`
  - `accent`: `bg-[#FF7582]/15 text-[#FF7582] border border-[#FF7582]/30`
  - `glass`: `bg-white/5 backdrop-blur-md text-slate-200 border border-white/10`

### 6.5 Tabs
- Accessible Radix Tabs featuring an animated sliding coral indicator:  
  `<motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF7582] to-[#E55260]"/>`

---

## 7. Signature Custom Components

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SIGNATURE COMPONENT MATRIX                      │
├─────────────────────┬──────────────────────────┬───────────────────────┤
│ 7.1 ScoreGauge      │ 7.4 KeywordTable         │ 7.6 RecruiterSim      │
│ Radial SVG Arc      │ Search Volume & Pills    │ 6-Second Ocular View  │
├─────────────────────┼──────────────────────────┼───────────────────────┤
│ 7.5 RewriteCard     │ 7.8 ActionChecklist      │ 7.9 ScoreCardCanvas   │
│ Safe/Metric/Impact  │ Chronological Tasks      │ 1080x1080 PNG Export  │
└─────────────────────┴──────────────────────────┴───────────────────────┘
```

### 7.1 ScoreGauge (Radial SVG)
- **Geometry:** 360-degree circular path with rotating sweep. `strokeWidth = 14`, `strokeLinecap = "round"`.
- **Color Stop Thresholds:**
  - `0 – 40`: Linear gradient `#FF7582` $\rightarrow$ `#E55260`
  - `41 – 70`: Linear gradient `#8A6F92` $\rightarrow$ `#725A7A`
  - `71 – 100`: Linear gradient `#3FBF8F` $\rightarrow$ `#1E5C4C`
- **Centerpiece Display:**
  - Score numeral in `Plus Jakarta Sans`, 88px, weight 800, with `tabular-nums`.
  - Band label underneath (e.g. `Competitive`) rendered in the band's semantic color.
  - Sub-caption: `"Top 14% of Indian Backend Engineers"`.
- **Sweep Animation:** `strokeDasharray` and `strokeDashoffset` transition from `0` to value over `900ms` using `--ease-out`. Numeral counts up over `1200ms`.
- **Sizes Available:** `sm` (120px), `md` (180px), `lg` (240px), `xl` (320px).

### 7.2 ScoreBar
- Track: `h-1.5 bg-[#24405A] rounded-full overflow-hidden`.
- Fill: Status-driven gradient (`success`, `warning`, or `coral`) animating width over `700ms` with a `60ms` staggered delay per row.
- Label: Shows component name on the left, score ratio (`"16/20"`) on the right in tabular monospace.

### 7.3 ComponentBreakdown & Sheet
- 10 rows sorting dynamically by **ROI Impact** (default), **Score Ascending**, or **Alphabetical**.
- Clicking any row triggers a slide-out right Sheet displaying:
  1. *What is wrong:* Plain explanation of identified barrier.
  2. *Recruiter impact:* Why recruiters drop candidates on this metric.
  3. *Exact fix:* Actionable recommendation.
  4. *Exemplary snippet:* Real-world high-scoring demonstration.
  5. *Deep-link button:* Jumps directly to rewriter, keyword tool, or headline editor.
  6. *Rule ID Pill:* Displays small tooltip showing the deterministic rule code (e.g. `H-03`).

### 7.4 KeywordTable & KeywordPill
- Visualizes role keywords categorized as:
  - `PRESENT`: Green dot, active check, count of instances.
  - `WEAK`: Amber dot, warning label: *"In bullets only — add to Skills"*.
  - `MISSING`: Red dot, with a single-click `+ Add` button.
  - `NOISE`: Strikethrough text with red `Cut` button (e.g. `MS Office`).
- Monthly search volume tag: `"142k monthly recruiter searches"`.

### 7.5 RewriteCard
- Two-zone layout:
  - *Top Zone:* Original bullet in a sunken panel (`#14293C`) with red friction tags.
  - *Bottom Zone:* Three revision panels (`SAFE`, `METRIC`, `IMPACT`).
  - *Metric Gating Input:* If the original bullet lacks a number, the METRIC variant surfaces an inline input box (`[Enter % or speedup]`) that updates the text live as the candidate types.
  - *Action Controls:* 1-Click `Accept & Update Profile`, `Edit Text`, and `Reject`.

### 7.6 RecruiterSim (The 6-Second Glance Simulator)
- **Split View (60/40 on Desktop, Stacked on Mobile):**
  - *Left (Browser Frame):* Renders candidate's profile as a recruiter card inside a simulated browser window with window dots and URL bar.
  - *Right (Ocular Timeline):* Three timed beats with countdown timers:
    - `0 – 2s`: Spotlight on Title, Employer, YOE, Location.
    - `2 – 4s`: Spotlight on Top Bullet of latest role.
    - `4 – 6s`: Spotlight on Top 6 Skills.
  - *Verdict Banner:* Large header showing `SKIP (74% drop rate)` or `STRONG MATCH (Top 5%)`.
  - *Persona Switcher:* 4 segmented pills: `Startup Founder`, `Enterprise TA`, `Consultancy Recruiter`, `HR Screener`. Switching animates the score numeral and shifts priority weights.

### 7.7 ScoreCardCanvas (Social Share Generator)
- Renders an exportable 1080×1080 PNG using `html-to-image`:
  - 4 Curated Themes: `Sunset`, `Ocean`, `Forest`, `Mono`.
  - Features candidate name, target role, verified score numeral, percentile ranking, and watermark verification seal.
  - 1-Click buttons: `Download PNG`, `Copy LinkedIn Caption`, `Copy WhatsApp Snippet`.

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

### 8.1 Liquid Glass Menubar
```css
.glass-menubar {
  position: sticky;
  top: 0;
  z-index: 50;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(26, 49, 69, 0.55);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.10);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 8px 32px rgba(0, 0, 0, 0.35);
}
```

### 8.2 Left Navigation Rail (Desktop)
- Fixed 72px width on desktop. Translucent glass styling.
- Vertical icon column: Dashboard, Analyze, Simulation, Keywords, Rewriter, Job Fit, Benchmark, Plan, Score Card, Export, Settings.
- Active state: `#FF7582` Coral left highlight bar (3px), coral-tinted glass background (`rgba(255, 117, 130, 0.12)`), and subtle ambient glow.

### 8.3 Mobile Adaptive Navigation
- Top bar collapses to Logo + Current Score Chip + Hamburger Menu.
- Bottom Tab Bar appears fixed above mobile safe area with 5 touch targets: `Home`, `Analyze`, `Rewrite`, `Plan`, `More`.

---

## 9. Page-by-Page Specifications

```
┌────────────────────────────────────────────────────────────────────────┐
│                          PAGE SPECIFICATION MAP                        │
├─────────────────┬──────────────────┬─────────────────┬─────────────────┤
│ P1: Landing     │ P3: Upload Step  │ P4: Target Role │ P6: Processing  │
│ P7: Dashboard   │ P8: 6-Sec Sim    │ P9: Keywords    │ P10: Rewriter   │
│ P11: Headline   │ P12: Job Fit     │ P14: 7-Day Plan │ P15: Score Card │
└─────────────────┴──────────────────┴─────────────────┴─────────────────┘
```

- **P1: Landing Page:**
  - *Sections:* Top Glass Nav $\rightarrow$ Hero with 80px H1 & Sunset span $\rightarrow$ 3D Tilted Floating App Preview $\rightarrow$ Social Proof Strip $\rightarrow$ 3-Step "How it Works" Glass Cards $\rightarrow$ Bento Grid of Features $\rightarrow$ Testimonial Carousel $\rightarrow$ Final CTA Band.
  - *Primary CTA:* "Get My Free Recruiter Score (60s)".
- **P3: Onboarding Upload (F1):**
  - *Drop Zone:* Large dashed border area. Dragover state shifts border to `#FF7582` Coral with ambient glow. File validation (PDF/DOCX, $\le 5\text{MB}$).
  - *Alternative:* Public profile URL input field with "Fetch Profile" button.
  - *Privacy Guarantee Card:* Prominent unbundled DPDP Act notice.
- **P4: Target Role Selection:**
  - Searchable combobox across 10 curated roles $\rightarrow$ Experience band segmented control ($0\text{-}1$, $1\text{-}3$, $3\text{-}5$, $5\text{-}8$, $8+$ YOE) $\rightarrow$ City multi-select chips with Tier tags.
- **P6: Processing Stepper:**
  - Vertical sequential checklist over progress bar (2–4s real duration):  
    *1. Extracting text $\rightarrow$ 2. Detecting sections $\rightarrow$ 3. Matching skills trie $\rightarrow$ 4. Calculating visibility $\rightarrow$ 5. Generating 7-day plan.*
- **P7: Master Dashboard:**
  - Hero Row: Large `ScoreGauge` (with percentile rank) alongside "Quick Wins" card ($+18$ points available).
  - Tab Strip: `Overview`, `Recruiter View`, `Keywords`, `Rewriter`, `Job Fit`, `Benchmark`, `Plan`.
- **P8: 6-Second Simulation:**
  - Split view. Left: simulated Naukri profile card; Right: 3 timeline scanning beats ($0\text{-}2\text{s}$, $2\text{-}4\text{s}$, $4\text{-}6\text{s}$), verdict banner, and 4-way persona switcher.
- **P9: Keyword Gap Analyzer:**
  - Filter vs Booster volume table, search volume disclosure tag, 1-click add buttons triggering celebratory confetti and live score increases.
- **P10: Bullet Rewriter:**
  - Bullet selector by employer $\rightarrow$ Active bullet analysis $\rightarrow$ 3 variants (SAFE, METRIC, IMPACT) with inline metric prompt $\rightarrow$ Accept button with toast.
- **P12: Job Fit Analyzer:**
  - JD paste textarea $\rightarrow$ Circular MatchRing $\rightarrow$ 5-Factor sub-scores $\rightarrow$ Missing critical skills list $\rightarrow$ Rejection risk predictor.
- **P14: 7-Day Action Plan:**
  - Grouped collapsible checklists (`Today` $\le 45\text{mins}$, `Day 2`, `Day 3-4`, `Week 2`). Sticky progress header.
- **P15: Score Card Generator:**
  - 4 themes, 3 aspect ratios, live canvas preview, 1-click PNG download, and pre-formatted LinkedIn/WhatsApp copy buttons.
- **P16: Export View:**
  - 3 Cards: ATS-Compliant PDF Resume (single column), Naukri Copy Blocks, LinkedIn Copy Blocks. Includes live ATS compliance check readout.

---

## 10. Responsive Breakpoints

| Breakpoint | Viewport Width | Layout Adaptations |
|---|---|---|
| **Mobile (`<640px`)** | $320\text{px} \text{ to } 639\text{px}$ | Single column linear flow. Bottom glass tab bar replaces left rail. Gauges take full width. Simulation stacks profile card above timeline. Tables convert to stacked cards. |
| **Tablet (`640px - 1024px`)** | $640\text{px} \text{ to } 1023\text{px}$ | 2-Column grid layouts. Right rail collapses into a floating drawer button. Simulation maintains side-by-side view. |
| **Desktop (`1024px - 1280px`)** | $1024\text{px} \text{ to } 1279\text{px}$ | Left rail fixed (72px). Main workspace + 320px sticky right Action Plan rail. |
| **Large Desktop (`>1280px`)** | $1280\text{px}+$ | Max-W-7xl centered container with generous whitespace. Master dashboard switches to a 3-column analytical grid. |

---

## 11. Accessibility (WCAG 2.1 AA Compliance)

1. **Color Contrast:** Body copy (`#F2F5F8`) against canvas (`#0F2233`) achieves **13.8:1** contrast ratio (exceeds AAA). Button text on Coral-600 (`#E55260`) achieves **4.6:1** (exceeds AA).
2. **Screen Reader Announcements:** Dynamic score updates use `aria-live="polite"` regions.
3. **SVG Visuals:** The ScoreGauge carries `role="img"` with descriptive `aria-label="Profile score 74 out of 100, status Competitive"`.
4. **Keyboard Focus:** Every interactive control features a visible focus ring:  
   `focus-visible:ring-2 focus-visible:ring-[#FF7582] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F2233]`.

---

## 12. Micro-Interactions & Animation Budget

- **Score Count-Up:** Numeral counts from 0 to value over $1,200\text{ms}$ using `easeOutExpo`.
- **Staggered Bar Fill:** Component breakdown bars animate with a $60\text{ms}$ delay per row.
- **Confetti Burst:** Triggered when a high-impact fix is accepted (canvas-based particles in Coral, Plum, and Rose, lasting $1.2\text{s}$).
- **Card Lift:** Interactive cards elevate $-4\text{px}$ with shadow expansion over $200\text{ms}$.
- **Clipboard Confirmation:** Copy buttons swap to a green check for $2.0\text{s}$ with a subtle scale bounce.

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
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grad-sunset': 'linear-gradient(135deg, #355C7D 0%, #725A7A 45%, #FF7582 100%)',
        'grad-coral': 'linear-gradient(135deg, #FF7582 0%, #E55260 100%)',
        'grad-score': 'linear-gradient(135deg, #355C7D 0%, #C56C86 100%)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(255, 117, 130, 0.18)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 14. Brand Assets & Logos

- **Master Glyph:** A rounded square (`20px` radius) filled with `--grad-sunset` containing an upward-pointing crisp chevron representing visibility acceleration.
- **Wordmark:** *"Naukri Profile Optimizer"* in `Plus Jakarta Sans`, weight 700, with letter spacing `-0.02em`.
- **Favicon:** Scalable SVG glyph with coral-to-rose accent stops.
- **OpenGraph Image ($1200 \times 630$):** Deep navy base with radial sunset glow, displaying the ScoreGauge at 88/100, headline *"Recruiter-Perspective Profile Diagnostic"*, and the tagline *"100% Free · Built for Indian Job Boards"*.

---

## 15. Component Inventory (Build Checklist)

| Component Name | File Path | Type | Props Signature | Key Dependencies |
|---|---|---|---|---|
| `ScoreGauge` | `components/score/ScoreGauge.tsx` | Custom SVG | `{ score: number, max?: number, size?: 'sm'\|'md'\|'lg'\|'xl' }` | None (Pure SVG) |
| `ScoreBar` | `components/score/ScoreBar.tsx` | Atomic UI | `{ score: number, max: number, status: string }` | Tailwind |
| `ComponentBreakdown`| `components/score/ComponentBreakdown.tsx` | Feature View| `{ components: ScoringResultItem[], onSelect: (id: string) => void }` | Sheet Drawer |
| `RecruiterSim` | `components/recruiter/RecruiterSimulation.tsx`| Signature | `{ profile: ParsedProfile, currentScore: number }` | Framer Motion |
| `KeywordTable` | `components/keywords/KeywordGapChecker.tsx` | Feature View| `{ keywords: KeywordEntry[], onAdd: (kw: string) => void }` | Confetti |
| `RewriteCard` | `components/rewriter/BulletRewriterView.tsx` | Feature View| `{ original: string, variants: RewriteVariant[], onAccept: fn }` | Lucide Icons |
| `ActionChecklist` | `components/plan/ActionPlanView.tsx` | Feature View| `{ tasks: PlanTask[], onComplete: (id: string) => void }` | Lucide Icons |
| `ScoreCardCanvas` | `components/shared/ShareCardModal.tsx` | Canvas Tool | `{ profileName: string, score: number, role: string }` | html-to-image |
| `AiConsentToggle` | `components/settings/AiConsentToggle.tsx` | Security UI | `{ consent: boolean, onConsentChange: (val: boolean) => void }` | Lucide Icons |
| `AppShell` | `components/layout/AppShell.tsx` | Master Shell| `{ children: React.ReactNode, currentScore: number }` | Glass Nav |
