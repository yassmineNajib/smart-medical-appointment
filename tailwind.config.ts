import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        medical: {
          navy: "hsl(var(--medical-navy))",
          blue: "hsl(var(--medical-blue))",
          teal: "hsl(var(--medical-teal))",
          sky: "hsl(var(--medical-sky))",
        },
        champagne: "hsl(var(--champagne))",
        ivory: "hsl(var(--ivory))",
        petrol: "hsl(var(--petrol))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.08)",
        premium: "0 24px 70px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
