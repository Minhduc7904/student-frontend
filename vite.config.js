import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/student/', // 👈 thêm dòng này

  plugins: [
    react(),
    {
      name: 'trailing-slash-redirect',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/student') {
            res.writeHead(301, { Location: '/student/' });
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],

  server: {
    port: 3000,       // 👈 đổi port
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
    },
  },
})
