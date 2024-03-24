import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'

const pinia = createPinia()

createApp(App).use(router).use(ElementPlus).use(pinia).mount('#app')
