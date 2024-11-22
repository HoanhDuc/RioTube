import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/ui/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#262626",
        secondary: "#22C55D",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
      backgroundImage: {
        "live-gradient":
          "conic-gradient(from 0deg, transparent 0%, #ef4444 50%, transparent 100%)",
      },
    },
  },
  plugins: [nextui()],
} satisfies Config;
