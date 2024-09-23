import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Ensure this line is present
  server: {
    proxy: {
      '/api': '16.170.245.26:5000', // Adjust if needed
    },
    host: true,
    port: 80,
  },
});
