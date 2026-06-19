import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base يُضبط تلقائيًا عند النشر على GitHub Pages عبر VITE_BASE=/REPO/
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
})
