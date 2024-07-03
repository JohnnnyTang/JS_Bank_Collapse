import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router/index'
import ElementPlus, { ElMessage } from 'element-plus'
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
        const token = localStorage.getItem('token');
        // const token = sessionStorage.getItem('token');
        if (token) {
            config.headers["token"] = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
axios.interceptors.response.use(
    response => {
        if (response.data["msg"] === "token过期") {
            ElMessage.error("用户认证过期，请重新登录");
            router.push('/login');
            return Promise.reject(response.data);
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);


window.addEventListener('keydown', (e) => {
    if (e.key == '1') {
        axios.get('/api/data/monitorInfo').then((res) => {
            console.log(res.data)
        })
    }
})


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
