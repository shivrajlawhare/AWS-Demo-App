import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all API requests that start with /api to your Express backend
      '/api': {
        target: 'http://16.170.245.26:5000',  // Replace with your backend server's IP or domain
        changeOrigin: true,  // Update the host header to match the target
        rewrite: (path) => path.replace(/^\/api/, ''),  // Remove /api prefix before forwarding
      },
    },
    host: true,
    port: 5173,
  },
});





// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()], // Ensure this line is present
//   server: {
//     proxy: {
//       '/api': '16.170.245.26:5000', // Adjust if needed
//     },
//     host: true,
//     port: 5173,
//   },
// });
