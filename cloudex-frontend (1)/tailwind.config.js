/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F4F8",
        surface: "#FFFFFF",
        ink: {
          DEFAULT: "#0F1729",
          muted: "#5B6478",
          faint: "#9398A8",
        },
        line: "#E4E7EE",
        cobalt: {
          DEFAULT: "#3654FF",
          deep: "#1F35B8",
          soft: "#E9EDFF",
        },
        amber: {
          DEFAULT: "#F5A623",
          soft: "#FDF1DC",
        },
        coral: {
          DEFAULT: "#EF5B4E",
          soft: "#FDEAE8",
        },
        mint: {
          DEFAULT: "#1FAE73",
          soft: "#E4F7EE",
        },
        violet: {
          DEFAULT: "#7C5CFC",
          soft: "#EFEBFF",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 41, 0.04), 0 8px 24px -12px rgba(15, 23, 41, 0.10)",
        pop: "0 12px 32px -8px rgba(15, 23, 41, 0.18)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(6px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        toastIn: {
          "0%": { opacity: 0, transform: "translateY(-8px) scale(0.98)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.35s ease-out both",
        toastIn: "toastIn 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
