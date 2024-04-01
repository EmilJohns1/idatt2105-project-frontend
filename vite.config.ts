import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

/**
 * If you want to use HTTPS, you can uncomment the lines below, and generate the certificates with mkcert
 */
import fs from 'fs'; 
import path from 'path';

const certFile = path.resolve(__dirname, './certs/cert.pem');
const keyFile = path.resolve(__dirname, './certs/key.pem');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: {
      key: fs.readFileSync(keyFile),
      cert: fs.readFileSync(certFile)
    }
  }
})
