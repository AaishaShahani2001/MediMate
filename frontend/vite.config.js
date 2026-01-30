import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],

  define: {
    global: "window", // required for simple-peer
  },

  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
    },
  },

  optimizeDeps: {
    include: ["buffer", "process"],
  },
});
