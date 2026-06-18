# Apex Premium Finance Design System (Stitch)

## Brand & Style

The design system is engineered for a high-fidelity digital wallet experience that prioritizes security, speed, and institutional-grade reliability. The brand personality is "Technological Sophistication"—it feels like a high-end physical vault translated into a digital interface.

The design style leverages **Glassmorphism** and **Corporate Modern** aesthetics. It utilizes deep navy backgrounds and translucent layers to create a sense of infinite depth. High-contrast accent colors are used sparingly to guide the user's eye toward critical financial actions and data visualizations. The overall emotional response should be one of "calm control" over complex financial data.

## Colors

This design system uses a curated "Midnight" palette designed for deep focus and high legibility in low-light environments. 

- **Primary (Accent Teal):** Represents growth and successful transactions.
- **Secondary (Accent Blue):** Used for information, connectivity, and trust-based indicators.
- **Tertiary (Accent Orange):** Reserved for pending states and high-attention warnings.
- **Neutral Stack:** Built on a deep blue-gray scale to maintain professional warmth rather than cold pure blacks. 

Backgrounds utilize a layered approach where higher elevation surfaces use progressively lighter shades (`Secondary` and `Tertiary`) to signify prominence.

## Typography

The typography hierarchy balances the geometric, modern character of **Outfit** for high-impact data and the systematic clarity of **Inter** for functional UI and body text.

**Outfit** is used for currency values, account balances, and page titles to provide a premium, "tech-forward" feel. **Inter** handles all micro-copy, labels, and forms to ensure maximum readability and a professional, neutral tone. 

Currency displays should always use `Outfit` with tabular lining figures to ensure numbers align perfectly in vertical columns during transaction history viewing.

## Layout & Spacing

The design system follows a strict 4px/8px grid system. 

- **Desktop:** A 12-column fluid grid with a 1280px max-width. Gutters are fixed at 24px to maintain clear separation between data widgets.
- **Mobile:** A 4-column fluid grid with 16px side margins. 

Layouts should favor high-density information display but utilize generous padding (`24px`+) within card containers to prevent the UI from feeling cluttered. Alignment is strictly anchored to the left for text, while numerical data and currency are right-aligned in tables to facilitate quick comparison.

## Elevation & Depth

Depth is conveyed through a combination of **Glassmorphism** and **Tonal Layering**. Unlike traditional shadow-based elevation, this system uses light and transparency to signify height.

- **Level 0 (Base):** Background Primary (#0B0F19).
- **Level 1 (Cards/Panels):** Background Secondary (#151D30) with a subtle 1px border (#2D3D60).
- **Level 2 (Overlays/Modals):** Glassmorphic surfaces using `rgba(21, 29, 48, 0.75)` with a `12px` backdrop blur. These elements must have a `1px` inner border of `rgba(45, 61, 96, 0.4)` to define their edges against the dark background.

Shadows are used sparingly and should be "Ambient"—low opacity (`0.3`), large blur (`24px`), and tinted with the Primary background color to avoid a "muddy" look.

## Shapes

The shape language is "Soft-Tech." It avoids fully circular buttons (pills) in favor of precision-milled corners.

- **6px (Small):** Used for checkboxes, tooltips, and small tags.
- **10px (Medium):** The standard for buttons and input fields.
- **16px (Large):** Used for primary dashboard cards and modals.

This progression of radii ensures that smaller nested elements feel visually balanced inside larger containers.

## Components

- **Buttons:** Primary buttons use a solid Accent Teal background with white text. Secondary buttons use a transparent background with a 1px border. "Glass" buttons use the backdrop blur effect for low-priority actions.
- **Input Fields:** Backgrounds should be Background Tertiary. Borders should be subtle (#2D3D60), becoming Accent Blue on focus.
- **Cards:** Dashboard widgets must use the Medium or Large radius. They feature a 1px top-down gradient border to simulate a "rim light" effect.
- **Chips/Status Tags:** Small radius (6px). Use low-opacity versions of the accent colors for the background (e.g., 10% Teal) with full-opacity text for high legibility without visual noise.
- **Lists:** Transaction items should have a subtle separator line or be contained in "cells" with the secondary background color.
- **Graphs/Charts:** Use thin 2px lines for strokes. Accent Teal for positive trends, Accent Red for negative. Use the Accent Blue for neutral volume bars.
