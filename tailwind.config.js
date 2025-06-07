/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "float": 'float 3s ease-in-out infinite',
      },

      colors: {},
    },

    variants: {
      extend: {
        transform: ["hover", "focus"],
        scale: ["hover", "focus"],
      },
    },
  },
  plugins: [tailwindcssAnimate],
};


 