/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontSize: {
                h1: ['32px', { lineHeight: '1.2', fontWeight: '680' }],
                'subhead-1': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
                h2: ['28px', { lineHeight: '1.2', fontWeight: '680' }],
                h3: ['20px', { lineHeight: '1.3', fontWeight: '640' }],
                h4: ['16px', { lineHeight: '1.4', fontWeight: '680' }],
                'subhead-4': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
                'text-4': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
                h5: ['12px', { lineHeight: '1.4', fontWeight: '680' }],
                'subhead-5': ['12px', { lineHeight: '1.4', fontWeight: '600' }],
                'text-5': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
            },
            fontWeight: {
                640: '640',
                680: '680',
                600: '600',
            },
            colors: {
                blue: {
                    900: '#0D41A9',
                    800: '#194DB6',
                    100: '#DFE9FF',
                    50: '#E6F2F4',
                    cyan: '#3CABFF',
                    aqua: '#5BFAFF',
                    soft: '#D9FCFC',
                    light: '#80C7FD',
                    lighter: '#E3F2FF',
                },
                yellow: {
                    500: '#FDD22C',
                    100: '#FFEFA5',
                    50: '#FDF8E1',
                },
                red: {
                    600: '#F53C37',
                    500: '#FF4B1A',
                    100: '#FDE3CF',
                    400: '#EB4335',
                },
                green: {
                    500: '#4BD200',
                    100: '#EAFDE7',
                },
                pink: {
                    500: '#FF5280',
                    100: '#FFDBE5',
                },
                purple: {
                    500: '#9B51E0',
                    100: '#EBEAFF',
                },
                gray: {
                    1000: '#24252C',
                    900: '#333333',
                    800: '#525252',
                    700: '#737373',
                    500: '#9B9B9A',
                    300: '#D9D9D9',
                    200: '#D4D4D4',
                    muted: '#6E6A7C',
                    subtle: '#7E818C',
                    100: '#E4E5E7',
                    
                },
                background: '#F4F8FF',
                white: '#FFFFFF',
            },
            fontFamily: {
                sans: ['"Open Sans"', 'system-ui', 'sans-serif'],
            },
        },
    },
};
