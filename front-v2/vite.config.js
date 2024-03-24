import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [
            {
                find: /^@\/(.*)/,
                replacement: `${path.resolve(__dirname, 'src')}/$1`,
            },
        ],
    },
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://172.21.213.47:8989/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
})
