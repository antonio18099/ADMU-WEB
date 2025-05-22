import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: ['5173-inaskn5g5phr0fiety545-aea5ec1f.manus.computer'],
  }
})

