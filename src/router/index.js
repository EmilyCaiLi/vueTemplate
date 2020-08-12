import Vue from 'vue'
import Router from 'vue-router'
// 路由懒加载
const Home = () => import(/* webpackChunkName: "list" */ '../pages/home/index.vue')
const Index = () => import(/* webpackChunkName: "list" */'../pages/index/index.vue')

Vue.use(Router)

var router = new Router({
  base: '',
  linkActiveClass: 'active',
  routes: [
    { path: '/', redirect: '/index' },
    { name: 'home', path: '/home', component: Home },
    { name: 'index', path: '/index', component: Index }
  ]
})

export default router
