/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // "Aurora" — deep slate lit by a mint→sky glow. brand = safe/local green,
        // accent = sky blue. Mint (#6EE7A8 ≈ brand-300) is the glow highlight.
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7a8', // aurora mint (glow / dark accents)
          400: '#34d399',
          500: '#10b981',
          600: '#059669', // primary (readable with white text)
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#5ea9ff', // aurora sky
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        // Deep slate grounds from the Aurora pitch.
        night: {
          900: '#0d141f', // panel
          950: '#0b1018', // page
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
