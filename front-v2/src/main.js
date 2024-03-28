import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { DraggablePlugin } from '@braks/revue-draggable';

const pinia = createPinia()

createApp(App)
    .use(DraggablePlugin)
    .use(router)
    .use(ElementPlus)
    .use(pinia)
    .mount('#app')
