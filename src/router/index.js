import Vue from 'vue'
import Router from 'vue-router'

const Compress = resolve => require(['@/views/Compress'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)

Vue.use(Router)

let routes = [
    { path: '/', component: resolve => require(['@/views/Home'], resolve) },
    { path: '/home2', component: resolve => require(['@/views/Home2'], resolve) },
    { path: '/debug', component: resolve => require(['@/views/Debug'], resolve) },
    { path: '/createBatch', component: resolve => require(['@/views/CreateBatch'], resolve) },
    { path: '/createBatchMd', component: resolve => require(['@/views/CreateBatchMd'], resolve) },
    {
        path: '/compress',
        component: Compress
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
