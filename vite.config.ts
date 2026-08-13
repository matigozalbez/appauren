import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'Mi Auren',
        short_name: 'Auren',
        description: 'Todo resuelto, en un solo lugar.',
        theme_color: '#071328', // Coincide con el fondo de tu app (#071328)
        background_color: '#071328',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/auren-isotipo.png', sizes: '192x192', type: 'image/png' },
          { src: '/auren-isotipo.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})