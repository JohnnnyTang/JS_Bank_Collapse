import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'

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
                target: 'http://192.168.1.108:8989/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/device': {
                target: 'http://119.45.198.54:9999/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/device/, ''),
            },
        },
        // https:{
        //     key: fs.readFileSync('cert/192.168.1.107-key.pem'),
        //     cert: fs.readFileSync('cert/192.168.1.107.pem'),
        // }
    },
})
