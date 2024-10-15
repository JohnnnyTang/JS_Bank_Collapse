import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // basicSsl({
        //     /** name of certification */
        //     name: 'test',
        //     /** custom trust domains */
        //     domains: ['*.custom.com'],
        //     /** custom certification directory */
        //     certDir: '/Users/.../.devServer/cert'
        //   })
    ],
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
});
