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
                target: 'http://192.168.43.108:8989/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            'http://127.0.0.1:8989/api/v1/': {
                target: 'http://192.168.43.108:8989/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/v1/, ''),
            },
            '/waterServer':{
                target: 'http://218.94.6.92:6080',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/waterServer/, ''),
            },
            '/device': {
                target: 'http://119.45.198.54:9999/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/device/, ''),
            }
        },
    }
})
