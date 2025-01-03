/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2B5B',
          light: '#2A407F',
          lighter: '#3855A3'
        },
        gold: {
          DEFAULT: '#C5A572',
          light: '#D4BC94',
          lighter: '#E3D3B6'
        },
        blue: {
          DEFAULT: '#7D9BB9',
          soft: '#9BB4CA',
          lighter: '#B9CDDB'
        },
        turquoise: {
          DEFAULT: '#4BC5BD',
          light: '#76D4CE',
          lighter: '#A1E3DF'
        },
        purple: {
          DEFAULT: '#6B4C9A',
          light: '#8A6FB3',
          lighter: '#A992CC'
        },
        green: {
          DEFAULT: '#41B38A',
          light: '#6BC4A4',
          lighter: '#95D5BE'
        },
        gray: {
          DEFAULT: '#CED4DA',
          light: '#DEE2E6',
          lighter: '#E9ECEF',
          dark: '#ADB5BD',
          darker: '#6C757D',
          smoke: '#F8F9FA'
        }
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C5A572 0%, #E3D3B6 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #1B2B5B 0%, #7D9BB9 100%)',
        'gradient-tropical': 'linear-gradient(135deg, #4BC5BD 0%, #A1E3DF 100%)',
        'gradient-royal': 'linear-gradient(135deg, #6B4C9A 0%, #A992CC 100%)',
        'gradient-nature': 'linear-gradient(135deg, #41B38A 0%, #95D5BE 100%)',
        'gradient-corporate': 'linear-gradient(135deg, #1B2B5B 0%, #3855A3 100%)',
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(27, 43, 91, 0.2)',
        'glow-lg': '0 0 30px rgba(27, 43, 91, 0.3)',
      }
    }
  },
  plugins: [],
};