import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'

// const addPrefixPlugin = (prefix) => ({
//     name: 'add-prefix-plugin',
//     async transformIndexHtml(html) {
//         return html.replace(/(href|src)="(?!http|\/\/)(?!\/cjbaweb\/)([^"]*)"/g, `$1="${prefix}$2"`)
//     },
// })

// https://vitejs.dev/config/
export default defineConfig({
    base: '/cjbaweb/',
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
                target: 'http://172.21.213.243:8989/api/v1',
                // target: 'http://172.21.212.166:8989/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/cry': {
                target: 'http://localhost:8989/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/cry/, ''),
            },
            '/device': {
                target: 'http://119.45.198.54:9999/api/v1',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/device/, ''),
            },
            '/api2': {
                // target: 'http://172.21.212.166:8989/api/v2',
                // target: 'http://localhost:8989/api/v2',
                target: 'http://172.21.213.243:8989/api/v2',
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

