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
        port: 5173,
        proxy: {
            '/api': {
                // target: 'http://localhost:8989/api/v1',
                target: 'http://223.2.47.202:8989/api/v1',
                // target: 'http://172.21.213.243:8989/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/device': {
                // target: 'http://119.45.198.54:9999/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/device/, ''),
            },
            '/model/': {
                target: 'http://223.2.47.202:8989/api/v2',
                // target: 'http://172.21.213.243:8989/api/v2',
                // target: 'http://localhost:8989/api/v2',
                // target: 'http://119.45.198.54:80/model',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/model/, ''),
            },
        },
        // https:{
        //     key: fs.readFileSync('cert/192.168.1.107-key.pem'),
        //     cert: fs.readFileSync('cert/192.168.1.107.pem'),
        // }
    },
    optimizeDeps: {
        include: ['pdfjs-dist'], // optionally specify dependency name
        esbuildOptions: {
            supported: {
                'top-level-await': true,
            },
        },
    },
    build: {
        target: 'es2022',
    },
    esbuild: {
        supported: {
            'top-level-await': true,
        },
    },
})

