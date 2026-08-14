---
name: SubPulse
colors:
  surface: '#13131b'
  surface-dim: '#13131b'
  surface-bright: '#393841'
  surface-container-lowest: '#0d0d15'
  surface-container-low: '#1b1b23'
  surface-container: '#1f1f27'
  surface-container-high: '#292932'
  surface-container-highest: '#34343d'
  on-surface: '#e4e1ed'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e4e1ed'
  inverse-on-surface: '#303038'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#ffb783'
  on-tertiary: '#4f2500'
  tertiary-container: '#d97721'
  on-tertiary-container: '#452000'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#13131b'
  on-background: '#e4e1ed'
  surface-variant: '#34343d'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.2'
  data-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style
The design system for this product is built on a "Deep Space Glassmorphism" aesthetic. It evokes a sense of high-fidelity precision and premium financial control. The target audience consists of tech-savvy individuals and professionals managing complex digital footprints. 

The UI should feel like a state-of-the-art command center. This is achieved through high-contrast accents against a slate-midnight foundation, utilizing translucent layers and background blurs to create a sense of physical depth. Motion should be fluid, and the overall experience should feel "breathable" despite the data-heavy nature of subscription management.

## Colors
The palette is rooted in a deep **Slate Midnight** background. To prevent the interface from feeling flat, use large, low-opacity radial gradients (ambient glow orbs) in **Indigo** and **Cyan** behind the primary glass containers.

- **Primary (Indigo):** Used for primary actions and brand presence.
- **Secondary (Cyan):** Used for data visualization highlights and AI-driven insights.
- **Status Accents:** 
    - **Emerald:** Active subscriptions and "money saved" metrics.
    - **Amber:** Pending renewals, trial periods, and warnings.
    - **Rose:** Immediate attention items like price hikes or expired payment methods.

## Typography
This design system employs a dual-font strategy. **Plus Jakarta Sans** provides a modern, friendly, and legible experience for general UI and prose. **JetBrains Mono** is utilized for all "hard data"—including currency symbols, price points, dates, and AI-confidence scores—to emphasize the technical accuracy and "pulsing" data-driven nature of the dashboard.

Headlines should use tight letter-spacing to maintain a sophisticated editorial feel. Data labels should be rendered in uppercase JetBrains Mono to clearly distinguish them from interactive UI labels.

## Layout & Spacing
The layout follows a fluid-grid philosophy for the dashboard, allowing cards to resize and reorganize based on screen width. On desktop, use a 12-column grid with generous margins to allow the background ambient glows to be visible.

- **Desktop:** 12 columns, 24px gutter, 48px side margins.
- **Tablet:** 8 columns, 16px gutter, 24px side margins.
- **Mobile:** 4 columns, 16px gutter, 16px side margins.

Spacing follows a 4px/8px baseline. Use `xl` (40px) or `2xl` (64px) for vertical section breathing room to maintain the premium, spacious feel.

## Elevation & Depth
Depth is created through transparency and blur rather than traditional shadows.
- **Tier 1 (Base):** Slate Midnight background with indigo/cyan radial glows at 15-20% opacity.
- **Tier 2 (Cards):** 65% opacity Slate surfaces with a 16px backdrop-filter blur. Borders are 1px solid, using a white-transparent gradient to simulate a "light catch" on the top-left edge.
- **Tier 3 (Modals/Popovers):** Higher opacity (85%) with a more intense 32px blur and a subtle secondary outer glow in the primary indigo color to indicate focus.

Avoid black shadows; instead, use colored "under-glows" for active states.

## Shapes
The design system uses "Rounded" geometry to balance the technical nature of the typography. 
- **Standard Cards/Containers:** 0.5rem (8px).
- **Secondary Containers (e.g., Mini-graphs):** 1rem (16px).
- **Buttons/Input Fields:** 0.5rem (8px) for a structured, professional appearance.
- **Pills/Status Badges:** Fully rounded (999px) to differentiate status indicators from functional components.

## Components
- **Buttons:** Primary buttons use a solid Indigo to Cyan gradient. Secondary buttons use the frosted glass style with a white border. Ghost buttons use only typography with Indigo hover states.
- **Glass Cards:** Every card must have the 16px blur. Use a subtle inner-glow on hover to indicate interactivity.
- **Subscription Chips:** Compact pills containing the service logo (rounded), the name in Plus Jakarta Sans, and the price in JetBrains Mono.
- **Input Fields:** Semi-transparent dark fills (rgba(0,0,0,0.2)) with 1px borders that glow Cyan when focused.
- **Pulse Indicators:** For AI-powered insights, use a small 8px dot with a 2-step CSS animation creating a "ripple" effect in the secondary Cyan color.
- **Charts:** Use thin lines (2px) with gradient fills beneath the line, transitioning from the accent color to transparent.