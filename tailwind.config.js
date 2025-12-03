/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'us-rose': '#E11D48',
                'us-stone': '#78716C',
                'us-indigo': '#4F46E5',
                'us-amber': '#D97706',
            }
        },
    },
    plugins: [],
}
