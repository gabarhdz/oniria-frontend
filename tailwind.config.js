/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Colores personalizados de Noctiria
      colors: {
        oniria_darkblue: '#1a1f35',
        oniria_blue: '#2a3f5f',
        oniria_purple: '#9675bc',
        oniria_pink: '#f1b3be',
        oniria_lightpink: '#ffe0db',
      },
      
      // Animaciones personalizadas para notificaciones
      animation: {
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'dropdown-enter': 'dropdownEnter 0.2s ease-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'message-entrance': 'messageEntrance 0.4s ease-out',
        'modal-entrance': 'modalEntrance 0.3s ease-out',
      },
      
      // Keyframes para las animaciones
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        dropdownEnter: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(-10px) scale(0.95)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
        fadeInUp: {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(10px)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) translateX(0px)' 
          },
          '33%': { 
            transform: 'translateY(-20px) translateX(10px)' 
          },
          '66%': { 
            transform: 'translateY(-10px) translateX(-10px)' 
          },
        },
        messageEntrance: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px) scale(0.95)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0) scale(1)',
          },
        },
        modalEntrance: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      
      // Backdrop blur personalizado
      backdropBlur: {
        xs: '2px',
      },
      
      // Box shadows personalizados
      boxShadow: {
        'glow': '0 0 20px rgba(150, 117, 188, 0.3)',
        'glow-pink': '0 0 20px rgba(241, 179, 190, 0.3)',
      },
    },
  },
  plugins: [],
}