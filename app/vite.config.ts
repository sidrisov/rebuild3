import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: 'rebuild3.xyz.local'
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  }
});
