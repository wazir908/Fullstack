import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy:
        mode === 'development'
          ? {
              '/api': {
                target: 'https://crm-backend-8e1q.onrender.com',
                changeOrigin: true,
                secure: false,
              },
            }
          : undefined,
    },
  }
})