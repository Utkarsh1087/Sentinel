/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,react,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF583B", 
        "primary-dark": "#E64B2F",
        secondary: "#FFB000",   
        success: "#489F48",     
        danger: "#D82222",      
        warning: "#E98316",     
        "text-main": "#FFFFFF", // Total White as per computed spec
        "card-olive": "#484D47", 
        "shade-dark": "#181A18", 
        background: "#000000",
        panel: "#16161D",
        border: "#27272A"
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        heading: ['"JetBrains Mono"', 'monospace'],
        sans: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-.075em',
        widest: '.25em',
      },
      fontWeight: {
        xbold: '900',
      }
    },
  },
  plugins: [],
}
