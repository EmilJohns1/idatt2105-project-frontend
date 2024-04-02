import { createRouter, createWebHistory } from 'vue-router'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import ExploreView from '../views/ExploreView.vue'
import CreateView from '@/views/CreateView.vue'
import UserPageView from '@/views/UserPageView.vue'
import ContactView from '@/views/ContactView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import CreateQuizView from '../views/CreateQuizView.vue'
import EditView from '../views/CreateView.vue'
import LoginRedirect from '@/components/LoginRedirect.vue'
import TokenHandlerView from '@/views/TokenHandlerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/explore',
      name: 'Explore',
      component: ExploreView
    },
    {
      path: '/explore/:category',
      name: 'Category',
      component: () => import('../views/CategoryView.vue'),
      props: true
    },
    {
      path: '/editQuiz',
      name: 'editQuiz',
      component: EditView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateQuizView
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
      component: LoginRedirect
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
    },
    {
      path: '/token',
      name: 'token',
      component: TokenHandlerView
    }
  ]
})

export default router
