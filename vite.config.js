import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Allow external connections
    port: 5173, // Same as your vite dev server port
    allowedHosts: ['.loca.lt'], // Allow any loca.lt tunnel
  },
})
