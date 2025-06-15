/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
const config =  {
  content: [
    './app/**/*.{ts,tsx}',      // App Router pages
    './pages/**/*.{ts,tsx}',    // Fallback (if used)
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class', // 👈 enable class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;