import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
// 1、引入组件
// import BankMainPage from "../views/BankMainPage.vue"
/**
 * 2、配置路由映射关系
 */
const routes = [
    {
        path: '/',
        component: () => import("../views/BankMainView.vue")
    },
    {
        path: '/device',
        component: () => import("../views/DeviceManageView.vue")
    },
    {
        path: '/knowledge',
        component: () => import("../views/BankKnowledgeView.vue")
    },
    {
        path: '/tree',
        component: () => import("../views/ResourceTreeView.vue")
    },
    
]
// 3、创建一个路由的对象
const router = createRouter({
    // 指定模式
    /**
     * createWebHashHistory 带 # 号
     * createWebHistory 不带 # 号
     */
    history: createWebHistory(),
    // 下面这个 可以写成ES6的简写 routers
    routes:routes
})

export default router;