import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync('./localhost.key'),
      cert: fs.readFileSync('./localhost.crt'),
    },
    port: 5173,
  }
});
