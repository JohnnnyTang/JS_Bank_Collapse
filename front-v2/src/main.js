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
import { useStatusStore } from './store/statusStore'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const login = import.meta.env.VITE_LOGIN
if (login === 'NOT') {
    // nothing
} else if (login === 'YES') {
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
            if (response.data["state"] === false) {
                ElMessage.error("用户认证未通过，请重新登录")
                router.push('/login')
                useStatusStore().loginStatus = false
                return Promise.reject(response.data)
            }
            return response
        },
        error => {
            return Promise.reject(error)
        }
    )
}



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
