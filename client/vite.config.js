import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  port: 5173,
  server: {
   proxy: {
      '/api': {
        target: 'http://localhost:5000', // backend port
        changeOrigin: true,
      },
  },
},
})
