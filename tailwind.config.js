/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Path to your main HTML file (usually in 'public' for Create React App)
    "./public/index.html",

    // Path to all your JavaScript (including JSX) and TypeScript (including TSX) files
    // in the 'src' directory and its subdirectories.
    "./src/**/*.{js,jsx,ts,tsx}",

    // If you have any other file types that contain Tailwind classes (e.g., HTML fragments
    // loaded dynamically, or other templating languages), you'd add them here.
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}