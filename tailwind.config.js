/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        health: {
          primary: "#3B82F6",
          emergency: "#EF4444",
          success: "#10B981",
          warning: "#F59E0B",
        }
      }
    },
  },
  plugins: [],
}
