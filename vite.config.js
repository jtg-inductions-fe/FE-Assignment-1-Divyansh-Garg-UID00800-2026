import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(() => {
    return {
        plugins: [
            createHtmlPlugin({
                minify: true,
            }),
            ViteImageOptimizer({
                test: /\.(jpg|png)$/i,
                includePublic: true,
                logStats: true,
                png: {
                    quality: 90,
                },
                jpg: {
                    quality: 90,
                },
                webp: {
                    quality: 90,
                },
            }),
            vue(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                '@abstracts': path.resolve(__dirname, './src/styles/abstracts'),
                '@base': path.resolve(__dirname, './src/styles/base'),
                '@components': path.resolve(
                    __dirname,
                    './src/styles/components',
                ),
                '@layout': path.resolve(__dirname, './src/styles/layout'),
                '@pages': path.resolve(__dirname, './src/styles/pages'),
                '@themes': path.resolve(__dirname, './src/styles/themes'),
                '@vendors': path.resolve(__dirname, './src/styles/vendors'),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: ({ name }) => {
                        if (/\.(jpg|png)$/.test(name ?? '')) {
                            return 'images/[name]-[hash][extname]';
                        }
                        if (/\.css$/.test(name ?? '')) {
                            return 'css/[name]-[hash][extname]';
                        }
                        return '[name]-[hash][extname]';
                    },
                },
            },
        },
        server: {
            port: 3000,
        },
    };
});
