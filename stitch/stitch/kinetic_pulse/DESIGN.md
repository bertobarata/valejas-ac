# Design System Strategy: Kinetic Pulse

## 1. Overview & Creative North Star
The visual identity for Valejas Atlético Clube is defined by a Creative North Star we call **"The Stadium Vanguard."** 

This system rejects the static, boxy nature of traditional sports templates in favor of a high-end editorial experience. We are capturing the velocity of the game—the "Kinetic Pulse"—through intentional asymmetry, overlapping elements that break the container, and a radical use of depth. Inspired by the club’s crest, layouts should feel as though they are in motion, utilizing the diagonal axis of the crest's red sash to guide the eye and create a sense of forward momentum. We don't just display information; we broadcast it with authority.

## 2. Colors & Tonal Architecture
The palette is a high-contrast triad of Secondary Royal Blue (`#1554BB`), Primary Yellow (`#FADB09`), and Tertiary Red (`#D4150C`). To maintain a premium editorial feel, we balance these vibrant hues with a sophisticated surface hierarchy.

*   **The "No-Line" Rule:** To achieve a modern, seamless look, designers are strictly prohibited from using 1px solid borders to define sections. Boundaries must be established through background shifts. For instance, a section utilizing `surface-container-low` (#f2f3ff) should sit adjacent to a `surface` background (#faf8ff).
*   **Surface Hierarchy & Nesting:** Treat the interface as a physical stack of materials. Use `surface-container` tiers to create "nested" depth. A card (`surface-container-lowest`) should feel like it is floating atop a `surface-container-high` section, creating a soft, natural hierarchy without visual clutter.
*   **The "Glass & Gradient" Rule:** Main CTAs and hero headers should utilize subtle gradients rather than flat fills. Use a transition from `secondary` (#1e59c0) to `secondary-container` (#6695ff) to add "soul" and dimension. Floating navigation elements should use Glassmorphism—applying a backdrop-blur to a semi-transparent `surface` color—to allow the energetic brand colors to bleed through.
*   **Signature Textures:** Incorporate the diagonal stripes from the crest as subtle, large-scale background watermarks using `outline-variant` at 5% opacity.

## 3. Typography: The Voice of the Club
The typography is a dialogue between the bold, athletic spirit of **Epilogue** and the technical precision of **Manrope**.

*   **Display & Headline (Epilogue):** These are the "shouting" moments. Use `display-lg` (3.5rem) for player names or scorelines to command immediate attention. The tight kerning and heavy weight of Epilogue convey the power of the Valejas eagle.
*   **Title & Body (Manrope):** Manrope provides a sleek, modern contrast. Use `title-lg` (1.375rem) for editorial subheaders to maintain a "journalistic" feel. `body-lg` (1rem) is the workhorse for long-form content, ensuring high legibility against the dynamic backgrounds.
*   **Hierarchy as Identity:** Always maintain a high-contrast ratio between headlines and body text. Large, asymmetric headings should often overlap containers or imagery to reinforce the "Kinetic Pulse" aesthetic.

## 4. Elevation & Depth: Layered Velocity
We achieve hierarchy through **Tonal Layering** rather than traditional structural lines.

*   **The Layering Principle:** Depth is created by stacking surface-container tokens. A profile card in `surface-container-lowest` (#ffffff) placed on a `surface-container-low` (#f2f3ff) background creates a sophisticated "lift" that feels integrated.
*   **Ambient Shadows:** For floating elements like the club crest or player cards, use extra-diffused shadows. Shadows must use a 40px–60px blur and a low-opacity version of the `on-surface` color (#001945 at 6%) to mimic natural stadium lighting.
*   **The "Ghost Border" Fallback:** If a container requires a boundary for accessibility, use a "Ghost Border." This is the `outline-variant` token (#c3c6d5) at 15% opacity. Never use 100% opaque borders.
*   **Motion Depth:** When a user scrolls, use parallax effects on background elements (like the red sash stripes) to create a three-dimensional field of play.

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#4d4200) with `on-primary` (#ffffff) text. Use `rounded-md` (0.375rem) for a modern, slightly sharp edge.
*   **Secondary:** `secondary` (#1e59c0) with a subtle gradient to `on-secondary-fixed-variant`.
*   **Interaction:** On hover, buttons should shift vertically by `spacing-0.5` (0.125rem) to provide a tactile, kinetic response.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Implementation:** Use `spacing-6` (1.5rem) of vertical white space to separate list items. For cards, use `surface-container-highest` (#d9e2ff) to highlight featured matches or news, creating distinction through color rather than lines.

### Chips
*   **Selection Chips:** Use `secondary-fixed` (#d9e2ff) with `on-secondary-container` (#002d70) text. These should feel like jersey tags—sleek and functional.

### Input Fields
*   **Styling:** Use `surface-container-lowest` for the field background.
*   **Focus State:** Instead of a heavy border, use a soft outer glow using the `primary` (#4d4200) color at 20% opacity to signal activity.

### Additional Component: The "Pulse" Scoreboard
A bespoke component for live matches. It utilizes a `tertiary` (#8a0000) "Live" indicator that slowly pulses. The background should be a dark `inverse-surface` (#002c6f) with white `display-sm` typography for the score, mirroring the high-intensity atmosphere of a night game.

## 6. Do's and Don'ts

### Do:
*   **Do** use the diagonal axis (roughly 45 degrees) for image crops and section transitions to mirror the crest's sash.
*   **Do** embrace negative space. The spacing scale (up to `spacing-24`) is your friend to allow the "Kinetic Pulse" to breathe.
*   **Do** ensure the central brand element (the logo) has significant padding (`spacing-12`) when placed as a hero element.

### Don't:
*   **Don't** use "pure" black (#000000). Use `on-background` (#001945) for deep tones to keep the palette rich and sophisticated.
*   **Don't** use standard 1px dividers. If you feel the need for a line, use a background color shift instead.
*   **Don't** center-align long blocks of text. Stick to editorial left-alignment to maintain the "Vanguard" feel.