import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  port: 5173,
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // 👈 proxy all /api calls to backend
    },
  },
  
})
