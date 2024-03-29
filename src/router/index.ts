import { createRouter, createWebHistory } from 'vue-router'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import ExploreView from '../views/ExploreView.vue'
import SubjectView from '../views/SubjectView.vue'
import CreateView from '@/views/CreateView.vue'
import UserPageView from '@/views/UserPageView.vue'
import ContactView from '@/views/ContactView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/explore',
      name: 'Explore',
      component: ExploreView
    },
    {
      path: '/explore/:subject',
      name: 'subject',
      component: SubjectView,
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
    },
    {
      path: '/user',
      name: 'user',
      component: UserPageView
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView
    }
  ]
})

export default router
