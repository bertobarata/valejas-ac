import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── BRAND COLOURS ────────────────────────────────────────────────
      // These never change between modes. They are the club's identity.
      colors: {
        // Primary: Electric Yellow
        "yellow": {
          DEFAULT: "#FADB09",
          dim:     "#E2C600",
          glow:    "rgba(250,219,9,0.30)",
        },
        // Secondary: Royal Blue
        "blue": {
          DEFAULT: "#1554BB",
          deep:    "#014CB3",
          light:   "#6695FF",
          on:      "#FFFFFF",
        },
        // Tertiary: Kinetic Red
        "red": {
          DEFAULT: "#D4150C",
          kinetic: "#C30001",
          on:      "#FFFFFF",
        },

        // ── SURFACE TOKENS (switch per theme via CSS vars) ────────────
        // Used as: bg-surface, bg-surface-low, text-on-surface, etc.
        // Values are set in globals.css via CSS variables.
        surface: {
          DEFAULT:   "rgb(var(--surface)          / <alpha-value>)",
          dim:       "rgb(var(--surface-dim)       / <alpha-value>)",
          low:       "rgb(var(--surface-low)       / <alpha-value>)",
          mid:       "rgb(var(--surface-mid)       / <alpha-value>)",
          high:      "rgb(var(--surface-high)      / <alpha-value>)",
          highest:   "rgb(var(--surface-highest)   / <alpha-value>)",
        },
        "on-surface": {
          DEFAULT: "rgb(var(--on-surface)         / <alpha-value>)",
          muted:   "rgb(var(--on-surface-muted)   / <alpha-value>)",
        },
      },

      // ── TYPOGRAPHY ───────────────────────────────────────────────────
      fontFamily: {
        // Títulos: Archivo variável — peso até 900, itálico e eixo de
        // largura. Ver src/app/fonts.ts e as utilidades .wdth-* em globals.css.
        headline: ["var(--font-headline)", "system-ui", "sans-serif"],
        // Texto corrido: General Sans — limpa, moderna, legível.
        body:     ["var(--font-body)", "system-ui", "sans-serif"],
        /* Havia aqui `font-display`, com a mesma fonte dos títulos mas sem
           as regras deles. Deu dois estilos de título no mesmo site:
           umas páginas em maiúsculas pretas, outras em minúsculas leves.
           Foi removida a 14/09/2026 — há um só estilo de título. */
      },

      // ── BORDER RADIUS ────────────────────────────────────────────────
      // Sharp cards + pill buttons = the "Vanguarda" tension.
      borderRadius: {
        none:    "0px",
        sm:      "0.125rem",
        DEFAULT: "0.25rem",
        md:      "0.375rem",
        lg:      "0.5rem",
        xl:      "0.75rem",
        full:    "9999px",
      },

      // ── CUSTOM UTILITIES ─────────────────────────────────────────────
      boxShadow: {
        "yellow-glow": "0 0 20px rgba(250,219,9,0.35)",
        "ambient":     "0 20px 60px -10px rgba(0,0,0,0.15)",
        "float":       "0 30px 60px -5px rgba(0,25,69,0.06)",
      },
      backgroundImage: {
        // Diagonal stripe watermark — crest sash motif
        "diagonal-stripe": `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 20px,
          rgba(21,84,187,0.04) 20px,
          rgba(21,84,187,0.04) 22px
        )`,
        // Hero gradient overlays
        "hero-dark":  "linear-gradient(to right, rgba(13,19,33,0.90) 0%, rgba(13,19,33,0.50) 60%, transparent 100%)",
        "hero-light": "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.70) 60%, transparent 100%)",
      },
      keyframes: {
        pulse_live: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
        slide_up: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-live": "pulse_live 1.5s ease-in-out infinite",
        "slide-up":   "slide_up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
