export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // proxy: {
    //   '/api': 'http://16.170.245.26:5000',
    // },
  },
});
