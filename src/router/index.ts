import { createRouter, createWebHistory } from 'vue-router'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import ExploreView from '../views/ExploreView.vue'
import SubjectView from '../views/SubjectView.vue'
import UserPageView from '@/views/UserPageView.vue'
import ContactView from '@/views/ContactView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import EditView from '../views/CreateView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { getQuizByQuizId } from '@/api/quizHooks'
import { getQuizzesByUsername } from '@/api/userHooks'

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
      path: '/quiz/:quiz_id-:quiz_title/edit',
      name: 'editQuizDetail',
      component: EditView,
      props: route => ({
        quiz_id: route.params.quiz_id,
        quiz_title: route.params.quiz_title
      }),
      beforeEnter: async (to, from, next) => {
        const quizIdParam = to.params.quiz_id;
        
        const quizId = Array.isArray(quizIdParam) ? quizIdParam[0] : quizIdParam;
        
        const quizIdNumber = parseInt(quizId);

        const currentUser = sessionStorage.getItem('user');
        
        if (!currentUser) {
          next('/404');
          return;
        }
    
        if (isNaN(quizIdNumber)) {
          next('/404');
          return;
        }
      
        try {
          const quizIdExists = await getQuizByQuizId(quizIdNumber);
          if (!quizIdExists) {
            next('/404');
            return;
          }
      
          const quizTitleMatches = quizIdExists.title === to.params.quiz_title;
          if (!quizTitleMatches) {
            next('/404'); 
            return;
          }

          const userQuizzes = await getQuizzesByUsername(currentUser);
        
          if (!userQuizzes || !userQuizzes.some(quiz => quiz.id === quizIdNumber)) {
            next('/404');
            return;
          }
      
          next();
        } catch (error) {
          console.error('Error:', error);
          next('/404');
        }
      }
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFoundView
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
