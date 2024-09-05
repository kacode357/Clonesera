/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'blob': 'blob 8s infinite',
      },
      maxWidth: {
        '4/5': '80%',
      },
      container: {
        center: true,
        padding: '1rem',
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'scale(1) translate(0, 0)' },
          '33%': { transform: 'scale(1.1) translate(20px, -20px)' },
          '66%': { transform: 'scale(0.9) translate(-20px, 20px)' },
        },
      },
    },
  },
  plugins: [],
}

