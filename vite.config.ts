import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/drawing-editor/',
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    assetsDir: 'assets'
  }
})