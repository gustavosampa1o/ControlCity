import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
                analytics: resolve(__dirname, 'analytics.html'),
                cameras: resolve(__dirname, 'cameras.html'),
                page2: resolve(__dirname, 'page2.html'),
            },
        },
    },
});
