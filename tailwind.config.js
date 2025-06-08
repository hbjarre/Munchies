/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'SF Pro Text', 'SF Pro Display', 'system-ui'],
      },
    },
  },
  plugins: [],
} 