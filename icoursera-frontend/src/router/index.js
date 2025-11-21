import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/course/:id',
      name: 'course-detail',
      component: () => import('../views/CourseDetail.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/SearchResults.vue')
    }
  ],
  // 路由跳转后滚动到页面顶部
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

export default router