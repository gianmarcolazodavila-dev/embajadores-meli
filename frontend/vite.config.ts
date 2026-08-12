import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            /^\/api/,
            '/macros/s/AKfycbyV6w9BwYpJmJSnW6CzdCVdYaPxr4xuwwOVOt5HQ7yucJDGCD-a1dx0pNWz99u_XXIR/exec'
          ),
      },
    },
  },
})
