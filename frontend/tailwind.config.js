/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        brand: {
          50:'#eef2ff',100:'#e0e7ff',200:'#c7d2fe',300:'#a5b4fc',400:'#818cf8',
          500:'#6366f1',600:'#4f46e5',700:'#4338ca',800:'#3730a3',900:'#312e81',
        },
      },
      boxShadow: {
        soft: '0 12px 40px rgba(2, 6, 23, 0.10)',
        card: '0 8px 24px rgba(2, 6, 23, 0.08)',
      },
      fontFamily: {
        inter: ['Inter','ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Arial','sans-serif'],
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' }
    },
  },
  plugins: [],
};
