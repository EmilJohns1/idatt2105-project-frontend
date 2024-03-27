import { createRouter, createWebHistory } from 'vue-router'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import CreateView from '@/views/CreateView.vue'
import UserPageView from '@/views/UserPageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/create',
      name: 'create',
      component: CreateView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/user',
      name: 'user',
      component: UserPageView
    }
  ]
})

export default router
