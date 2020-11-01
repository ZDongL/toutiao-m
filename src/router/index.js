import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/login') },
  {
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      // { path: '', redirect: '/home' },
      { path: '/home', component: () => import('@/views/home') },
      { path: '/qa', component: () => import('@/views/qa') },
      { path: '/video', component: () => import('@/views/video') },
      { path: '/my', component: () => import('@/views/my') }
    ]
  },
  { path: '/search', component: () => import('@/views/search') },
  {
    path: '/article/:articleId',
    component: () => import('@/views/article'),
    // 向该（article）组件传参  把动态的 :articleId 传过去  接收拿props接收
    props: true
  },
  { path: '/user/profile', component: () => import('@/views/user-profile') },
  { path: '/user/chat', component: () => import('@/views/user-chat') }

]

const router = new VueRouter({
  routes
})

export default router
