import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import DataVVue3 from '@kjgl77/datav-vue3'
import { DraggablePlugin } from '@braks/revue-draggable'
// import './utils/unityInteraction.js'
// E:\WATER\BankCollapse\JS_Bank_Collapse\front-v2\src\utils\unityInteraction.js
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


axios.interceptors.request.use(
    config => {
        const token = sessionStorage.getItem('token');
        if (token) {
            console.log("token存在");
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// axios.interceptors.response.use(
//     response => {
//         if (response.data.errno === 999) {
//             router.replace('/');
//             console.log("token过期");
//         }
//         return response;
//     },
//     error => {
//         return Promise.reject(error);
//     }
// );


const app = createApp(App)
    .use(DraggablePlugin)
    .use(router)
    .use(DataVVue3)
    .use(ElementPlus)
    .use(pinia)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
