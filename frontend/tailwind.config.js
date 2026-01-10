/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                siemens: {
                    teal: '#009999',
                    gray: '#EBF0F5',
                    dark: '#2D3748'
                }
            }
        },
    },
    plugins: [],
}
