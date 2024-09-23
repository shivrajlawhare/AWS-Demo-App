import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // Ensure this line is present
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Adjust if needed
    },
  },
});
