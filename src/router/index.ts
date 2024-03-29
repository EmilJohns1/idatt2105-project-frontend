import { createRouter, createWebHistory } from 'vue-router'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import ExploreView from '../views/ExploreView.vue'
import CategoryView from '../views/CategoryView.vue'
import CreateView from '@/views/CreateView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/explore',
      name: 'Explore',
      component: ExploreView,
    },
    {
      path: '/explore/:category',
      name: 'Category',
      component: CategoryView,
      props: true
    },
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
    }
  ]
})

export default router
