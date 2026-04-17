import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://ec2-13-59-18-58.us-east-2.compute.amazonaws.com:3001',
        changeOrigin: true,
      },
    },
  },
})
