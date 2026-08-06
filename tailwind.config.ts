import type { Config } from "tailwindcss";

/**
 * All values here proxy CSS custom properties defined in
 * src/styles/tokens/*.css — never hardcode raw values in components.
 */
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "otaru-ink": "var(--color-ink)",
        "otaru-chalk": "var(--color-chalk)",
        "otaru-cream": "var(--color-cream)",
        "otaru-stone": "var(--color-stone)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        surface: "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        foreground: "var(--color-foreground)",
        "foreground-muted": "var(--color-foreground-muted)",
        background: "var(--color-background)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      fontSize: {
        "display-xl": "var(--text-display-xl)",
        "display-lg": "var(--text-display-lg)",
        "display-md": "var(--text-display-md)",
        "display-sm": "var(--text-display-sm)",
        "body-lg": "var(--text-body-lg)",
        "body-md": "var(--text-body-md)",
        "body-sm": "var(--text-body-sm)",
        caption: "var(--text-caption)",
      },
      letterSpacing: {
        tighter: "var(--tracking-tighter)",
        tight: "var(--tracking-tight)",
        wide: "var(--tracking-wide)",
        widest: "var(--tracking-widest)",
      },
      spacing: {
        "1": "var(--spacing-1)",
        "2": "var(--spacing-2)",
        "3": "var(--spacing-3)",
        "4": "var(--spacing-4)",
        "5": "var(--spacing-5)",
        "6": "var(--spacing-6)",
        "8": "var(--spacing-8)",
        "10": "var(--spacing-10)",
        "12": "var(--spacing-12)",
        "16": "var(--spacing-16)",
        "20": "var(--spacing-20)",
        "24": "var(--spacing-24)",
        "32": "var(--spacing-32)",
      },
      transitionDuration: {
        "0": "var(--motion-0)",
        "1": "var(--motion-1)",
        "2": "var(--motion-2)",
        "3": "var(--motion-3)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        "out-expo": "var(--ease-out-expo)",
        "in-out-quart": "var(--ease-in-out-quart)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
    },
  },
  plugins: [],
};

export default config;
