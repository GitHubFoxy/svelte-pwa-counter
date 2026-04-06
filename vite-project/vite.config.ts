import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const repoBase = '/svelte-pwa-counter/'
  const base = command === 'build' ? repoBase : '/'

  return {
    base,
    plugins: [
      tailwindcss(),
      svelte(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['favicon.svg', 'icons.svg', 'apple-touch-icon.png'],
        manifest: {
          id: `${repoBase}?source=pwa`,
          name: 'Neck Counter',
          short_name: 'Counter',
          description: 'A minimal offline counter for exercise reps.',
          theme_color: '#1c1917',
          background_color: '#efe6d1',
          display: 'standalone',
          orientation: 'portrait',
          scope: repoBase,
          start_url: repoBase,
          icons: [
            {
              src: `${repoBase}pwa-192x192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${repoBase}pwa-512x512.png`,
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: `${repoBase}maskable-icon-512x512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        },
      }),
    ],
  }
})
