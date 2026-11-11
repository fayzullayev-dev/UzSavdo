/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          soft: "var(--primary-soft)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          soft: "var(--accent-soft)",
        },
        background: "var(--background)",
        surface: {
          DEFAULT: "var(--surface)",
          muted: "var(--surface-muted)",
        },
        border: "var(--border)",
        text: {
          DEFAULT: "var(--text)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        info: "var(--info)",
      },
      borderRadius: {
        card: "16px",
        btn: "12px",
        modal: "20px",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
