# Design System Document: The Electric Court

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Electric Court."** We are not building a standard sports app; we are capturing the high-voltage atmosphere of a midnight arena under stadium lights. This is a "High-End Editorial" experience that prioritizes energy, momentum, and premium dark-mode aesthetics.

To break the "template" look, this system rejects rigid symmetry. We utilize **intentional asymmetry**, where large-scale typography overlaps containers, and glassmorphic layers bleed into one another. The layout should feel like a motion-blur photograph: kinetic, urgent, and precise.

## 2. Colors & Surface Architecture
Our palette transitions from the infinite depth of a midnight stadium to the searing heat of electric neon.

### Palette Roles
*   **Surface (Base):** `surface` (#0d1321) – The deep foundation.
*   **Primary:** `primary_container` (#fadb09) – Used for "Electric Yellow" highlights and core actions.
*   **Secondary:** `secondary_container` (#014cb3) – The "Vibrant Royal Blue" used for structural accents.
*   **Tertiary/Accent:** `on_tertiary_container` (#c30001) – The "Kinetic Red" reserved for high-impact alerts and "Live" indicators.

### The "No-Line" Rule
**Standard 1px borders are strictly prohibited.** Boundaries must be defined through background color shifts or tonal transitions. To separate a section, shift from `surface` to `surface_container_low`. If a container needs focus, use `surface_container_high`. We define space through mass, not lines.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-transparent sheets. 
*   **Level 0 (Background):** `surface_dim`.
*   **Level 1 (Sections):** `surface_container_low`.
*   **Level 2 (Cards/Modules):** `surface_container_highest` or Glassmorphic panels.

### The "Glass & Glow" Rule
For high-priority floating elements, use a backdrop-blur (20px+) combined with `surface_variant` at 40% opacity. All `primary` elements (Electric Yellow) should possess a subtle `0px 0px 15px` outer glow using a 30% opacity version of the primary color to simulate neon light emission.

## 3. Typography: Editorial Kineticism
We pair the brutalist strength of **Epilogue** with the precision of **Inter**.

*   **Display & Headlines (Epilogue):** Use `Black` (900) or `Black Italic`. Headlines should be oversized (e.g., `display-lg`) to create an editorial feel. Tighten letter-spacing to `-0.04em` for a high-tension, compressed look.
*   **Body & Titles (Inter):** Use for all functional data. Inter provides the "clean" counterpoint to the aggressive headings. Use `Medium` (500) for body-lg to ensure readability against dark backgrounds.
*   **Hierarchy Note:** Don't be afraid to let `display` type overlap image containers or extend off-grid. This breaks the digital "box" and feels like a bespoke magazine layout.

## 4. Elevation & Depth
In "The Electric Court," depth is environmental, not artificial.

*   **Tonal Layering:** Avoid drop shadows for standard components. Use the `surface_container` tiers to create "natural lift." A `surface_container_lowest` card sitting on a `surface_container_low` section creates a recessed, carved-out effect.
*   **Ambient Shadows:** If an element must "float" (e.g., a primary CTA button), use a wide, diffused shadow.
    *   *Shadow Color:* #000000 at 15% opacity.
    *   *Blur:* 30px.
    *   *Spread:* -5px.
*   **The Ghost Border Fallback:** If accessibility requires a stroke, use `outline_variant` at 15% opacity. It should feel like a faint reflection on a glass edge, never a solid line.

## 5. Components & UI Elements

### Buttons
*   **Primary:** High-contrast `primary_container` (Yellow). Shape: `full` (Pill-shaped). No border. Apply the "Electric Glow."
*   **Secondary:** `secondary_container` (Royal Blue) with `on_secondary` text. Shape: `none` (Sharp corners). This contrast between pill-shaped and sharp-edged buttons creates the signature "Vanguarda" tension.
*   **Tertiary:** Ghost style. `title-sm` text with no background. Interaction state triggers a 10% `primary` background tint.

### Cards & Data Lists
*   **Rule:** **Forbid all divider lines.** Separate list items using `spacing-4` (1.4rem) of vertical white space or by alternating background shades between `surface_container_low` and `surface_container`.
*   **Layout:** Use asymmetrical padding. For example, `padding-left: 6` (2rem) and `padding-right: 4` (1.4rem) to give a sense of directional movement.

### Input Fields
*   **Styling:** Use `surface_container_highest` for the field background. Shape: `none` (Sharp). 
*   **Active State:** The bottom edge glows with a 2px `primary_fixed` (Yellow) underline.

### Specialized Components
*   **Glitch Texture Overlays:** Apply a 5% opacity "subtle glitch" noise texture to hero images and large `surface_container_highest` areas to add grit and athletic intensity.
*   **The "Live" Badge:** Kinetic Red (`on_tertiary_container`) with a pulsing opacity animation to signify real-time match data.

## 6. Do's and Don'ts

### Do:
*   **Do** lean into extreme contrast. If a heading is large, make it *massive*.
*   **Do** use asymmetrical container widths (e.g., a 7-column main content area paired with a 3-column offset sidebar).
*   **Do** treat images with a dark, high-contrast "midnight" filter to ensure they blend with the `surface` colors.

### Don't:
*   **Don't** use 1px solid borders to define boxes. It kills the premium editorial feel.
*   **Don't** use standard "Grey" for neutral text. Always use `on_surface_variant` (a warm, muted gold-tinted grey) to maintain the Electric Yellow undertone.
*   **Don't** round every corner. The tension between `roundness-none` (sharp) and `roundness-full` (pill) is the soul of this design system.