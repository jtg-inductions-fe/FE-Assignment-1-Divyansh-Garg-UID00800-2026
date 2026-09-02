import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

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
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
                '@abstracts': fileURLToPath(
                    new URL('./src/styles/abstracts', import.meta.url),
                ),
                '@base': fileURLToPath(
                    new URL('./src/styles/base', import.meta.url),
                ),
                '@components': fileURLToPath(
                    new URL('./src/styles/components', import.meta.url),
                ),
                '@layout': fileURLToPath(
                    new URL('./src/styles/layout', import.meta.url),
                ),
                '@pages': fileURLToPath(
                    new URL('./src/styles/pages', import.meta.url),
                ),
                '@themes': fileURLToPath(
                    new URL('./src/styles/themes', import.meta.url),
                ),
                '@vendors': fileURLToPath(
                    new URL('./src/styles/vendors', import.meta.url),
                ),
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
