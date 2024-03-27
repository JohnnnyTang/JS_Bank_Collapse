import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import {Draggable, DraggablePlugin, DraggableDirective } from '@braks/revue-draggable';

const pinia = createPinia()

createApp(App)
    .use(DraggablePlugin).directive('draggable', DraggableDirective).component('Draggable', Draggable)
    .use(router)
    .use(ElementPlus)
    .use(pinia)
    .mount('#app')
