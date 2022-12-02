import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'


const path = require('path')

// set different config for different env
// mainly solve the problem of different proxy settings
// local dev -> devserver to solve CORS, need to call 'http://localhost:5016/api/xxx'
// remote server -> directly call backend api '/xxx'
export default defineConfig(({ command, mode }) => {
  // run on dev mode
  if (command === 'serve') {
    return {
      plugins: [vue(), vueJsx()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
          '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
      },
      server: {
        port: 5016,
        proxy: {
          '/api': {
            // target: 'http://124.223.197.77:5017',
            target: 'http://localhost:5017',
            changeOrigin: true,
            ws: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
        },
        cors: true
      },
      build: {
        outDir: '../server/dist',
      }
    }
  }
  // run on build mode
  else {
    return {
      plugins: [vue(), vueJsx()],
      resolve: {
        alias: {
          '@': fileURLToPath(new URL('./src', import.meta.url)),
          '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
        }
      },
      build: {
        outDir: '../server/dist'
      }
    }
  }
})