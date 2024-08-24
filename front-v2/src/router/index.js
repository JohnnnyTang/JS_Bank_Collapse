import {
    createRouter,
    createWebHistory,
    createWebHashHistory,
} from 'vue-router'
import axios from 'axios';
// 1、引入组件
// import BankMainPage from "../views/BankMainPage.vue"
/**
 * 2、配置路由映射关系
 */
const routes = [
    {
        path: '/dataVisual',
        component: () => import('../views/DtVisualView.vue'),
    },
    {
        path: '/knowledgeStore',
        // redirect: '/knowledgeStore/history',
        // component: () => import('../views/KnowledgeStoreView.vue'),
        redirect: '/knowledgeStore/home',
        component: () => import('../components/knowStore/TempKnow.vue'),
        children: [
            {
                path: 'home',
                component: () =>
                    import('../components/knowStore/views/KnowFlowChart.vue'),
            },
            {
                path: 'history',
                component: () =>
                    import('../components/knowStore/views/ScrollHistory.vue')
            },
            {
                path: 'plan',
                component: () =>
                    import('../components/knowStore/views/RiverPlan.vue'),
            },
            {
                path: 'param',
                component: () =>
                    import('../components/knowStore/views/ModelParams.vue'),
            },
            {
                path: 'experience',
                component: () =>
                    import('../components/knowStore/views/ExpertKnow.vue'),
            },
        ],
    },
    {
        path: '/',
        name: 'home',
        // redirect: '/dataVisual'
        redirect: _ => {
            return localStorage.getItem('token') ? '/dataVisual' : '/login';
        }
        // component: () => import("../views/BankMainView.vue")
    },
    {
        path: '/home',
        name: 'main',
        component: () => import("../views/BankMainView.vue")
    },
    {
        path: '/main',
        component: () => import("../views/BankMainView.vue")
    },
    {
        path: '/test',
        component: () => import("../components/dataVisual/test.vue")
    },
    {
        path: '/modelStore',
        redirect: '/modelStore/main',
        children: [
            {
                path: 'main', // 默认子页面
                component: () => import('../views/ModelStoreView.vue')
                // component: () => import('../components/modelStore/ModelTemp.vue')
            },
            {
                path: 'dataInterpretation',
                component: () => import('../components/modelStore/views/DataInterpretation.vue'),
            },
            {
                path: 'soilAnalysis',
                component: () => import('../components/modelStore/views/SoilAnalysis5.vue'),
            },
            {
                path: 'stabilityAnalysis2',
                component: () => import('../components/modelStore/views/StabilityAnalysis.vue'),
            },
            {
                path: 'analysisCenter',
                component: () => import('../components/modelStore/views/AnalysisCenter.vue'),
            },
            {
                path: 'stabilityAnalysis',
                component: () => import('../components/modelStore/views/StabilityAnalysis3.vue'),
            },
            {
                path: 'stabilityCalc',
                component: () => import('../components/modelStore/views/StabilityCalc.vue'),
            },
            {
                path: 'riskWarning',
                component: () => import('../components/modelStore/views/RiskWarning3.vue'),
                // component: () => import('../components/modelStore/views/EmptyPage.vue'),
            },
            // {
            //     path: 'riskWarning2',
            //     component: () => import('../components/modelStore/views/RiskWarning2.vue'),
            // },
            // {
            //     path: 'numericalModel',
            //     component: () => import('../components/modelStore/views/NumericalModel.vue'),
            // }

        ]
    },
    {
        path: '/bankTwin',
        component: () => import('../views/BankTwinMainView.vue')
    },
    {
        path: '/bankManage',
        redirect: '/bankManage/basic/mzs',
        component: () => import('../views/BankTwinManageView.vue'),
        children: [
            {
                path: 'basic/:id', // 默认子页面
                component: () => import('../components/bankManage/BankBasicInfo.vue')
            },
            {
                path: '/bankManage/monitor/:id', // 默认子页面
                component: () => import('../components/bankManage/BankMonitorInfo.vue')
            },
            {
                path: 'warn/:id', // 默认子页面
                component: () => import('../components/bankManage/BankWarnTable.vue')
            }
        ]
    },
    {
        path: '/bankWarn',
        component: () => import('../views/BankRiskWarnView.vue')
    },
    {
        path: '/login',
        component: () => import('../views/LoginView.vue')
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
    routes: routes,
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        const isLoggedIn = localStorage.getItem('token');
        if (isLoggedIn) {
            axios.get('/api/data/monitorInfo').then(res => {
                // as token check
                next()
            }).catch(err => {
                console.log(err)
                next('/login');
            })
            // next()
        } else {
            next('/login');
        }
    }
})

export default router
