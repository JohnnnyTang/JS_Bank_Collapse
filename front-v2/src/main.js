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

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// interceptors config
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers["token"] = token
        }
        return config
    },
    error => {
        return Promise.reject(error);
    }
)
axios.interceptors.response.use(
    response => {
        if (response.data["msg"] === "token过期") {
            ElMessage.error("用户认证过期，请重新登录")
            router.push('/login')
            return Promise.reject(response.data)
        }
        return response
    },
    error => {
        return Promise.reject(error)
    }
)


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
