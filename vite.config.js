import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite will automatically build to a 'dist' folder
  // within this package's directory.
  build: {
    outDir: 'dist'
  }
})