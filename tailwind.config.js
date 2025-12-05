/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "float-slow": "float 60s linear infinite",
        "float-medium": "float 45s linear infinite",
        "float-fast": "float 30s linear infinite",
        "bird-switch": "birdSwitch 0.5s ease-in-out",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
        "slide-in-from-left": "slideInFromLeft 0.8s ease-out",
        "bounce-gentle": "bounceGentle 1.5s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(calc(100vw + 300px))" },
        },
        birdSwitch: {
          "0%": { transform: "scale(0) rotate(-180deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(0deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-150px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
