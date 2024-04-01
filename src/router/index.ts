import { createRouter, createWebHistory } from 'vue-router'
import SignUpView from '../views/SignUpView.vue'
import LoginView from '../views/LoginView.vue'
import ExploreView from '../views/ExploreView.vue'
import SubjectView from '../views/SubjectView.vue'
import UserPageView from '@/views/UserPageView.vue'
import ContactView from '@/views/ContactView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import CreateQuizView from '../views/CreateQuizView.vue'
import CreateQuestionView from '../views/CreateQuestionView.vue'
import EditQuizView from '../views/EditQuizView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import NoAccessView from '../views/NoAccessView.vue'
import { getQuizByQuizId, getUsersByQuizId } from '@/api/quizHooks'
import { getQuizzesByUsername } from '@/api/userHooks'
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
      path: '/explore/:subject',
      name: 'subject',
      component: SubjectView,
      props: true
    },
    {
      path: '/quiz/create',
      name: 'createQuiz',
      component: CreateQuizView
    },
    {
      path: '/quiz/:quiz_id-:quiz_title/edit',
      name: 'EditQuiz',
      component: EditQuizView,
      props: (route) => ({
        quiz_id: route.params.quiz_id,
        quiz_title: route.params.quiz_title as string
      }),
      beforeEnter: async (to, from, next) => {
        const quizIdParam = to.params.quiz_id
        const quizTitleParam = to.params.quiz_title.toString()
        const quizId = Array.isArray(quizIdParam) ? quizIdParam[0] : quizIdParam
        const quizIdNumber = parseInt(quizId)
        const currentUser = sessionStorage.getItem('user')

        if (!currentUser) {
          console.error('User not logged in')
          next('/no-access')
          return
        }

        if (isNaN(quizIdNumber)) {
          console.error('Invalid quiz ID:', quizId)
          next('/404')
          return
        }

        try {
          const quizDetails = await getQuizByQuizId(quizIdNumber)
          console.log('quizDetails:', quizDetails)
          if (!quizDetails) {
            console.error('Quiz not found:', quizIdNumber)
            next('/404')
            return
          }

          const formattedQuizTitle = quizDetails.title.toLowerCase().replace(/ /g, '-')
          const formattedQuizTitleParam = quizTitleParam.toLowerCase().replace(/ /g, '-')
          const quizTitleMatches = formattedQuizTitle === formattedQuizTitleParam

          if (!quizTitleMatches) {
            console.error('Quiz title does not match:', quizDetails.title, to.params.quiz_title)
            next('/404')
            return
          }

          const userQuizzes = await getQuizzesByUsername(currentUser)
          if (!userQuizzes || !userQuizzes.some((quiz) => quiz.id === quizIdNumber)) {
            console.error('User does not have permission to edit quiz:', quizIdNumber)
            next('/no-access')
            return
          }

          next()
        } catch (error) {
          console.error('Error:', error)
          next('/404')
        }
      }
    },
    {
      path: '/quiz/:quiz_id-:quiz_title/questions/:question_number/edit',
      name: 'CreateQuestion',
      component: CreateQuestionView,
      props: (route) => ({
        quiz_id: route.params.quiz_id,
        quiz_title: route.params.quiz_title as string,
        question_number: route.params.question_number
      }),
      beforeEnter: async (to, from, next) => {
        const quizIdParam = to.params.quiz_id
        const quizTitleParam = to.params.quiz_title.toString()
        const quizId = Array.isArray(quizIdParam) ? quizIdParam[0] : quizIdParam
        const quizIdNumber = parseInt(quizId)
        const currentUser = sessionStorage.getItem('user')

        if (!currentUser) {
          console.error('User not logged in')
          next('/no-access')
          return
        }

        if (isNaN(quizIdNumber)) {
          console.error('Invalid quiz ID:', quizId)
          next('/404')
          return
        }

        try {
          const quizDetails = await getQuizByQuizId(quizIdNumber)
          console.log('quizDetails:', quizDetails)
          if (!quizDetails) {
            console.error('Quiz not found:', quizIdNumber)
            next('/404')
            return
          }

          const formattedQuizTitle = quizDetails.title.toLowerCase().replace(/ /g, '-')
          const formattedQuizTitleParam = quizTitleParam.toLowerCase().replace(/ /g, '-')
          const quizTitleMatches = formattedQuizTitle === formattedQuizTitleParam

          if (!quizTitleMatches) {
            console.error('Quiz title does not match:', quizDetails.title, to.params.quiz_title)
            next('/404')
            return
          }

          const userQuizzes = await getQuizzesByUsername(currentUser)
          if (!userQuizzes || !userQuizzes.some((quiz) => quiz.id === quizIdNumber)) {
            console.error('User does not have permission to these questions:', quizIdNumber)
            next('/no-access')
            return
          }

          const users = await getUsersByQuizId(quizIdNumber)
          if (!users || !users.some((user) => user.username === currentUser)) {
            console.error('User does not have permission to these questions:', quizIdNumber)
            next('/no-access')
            return
          }

          next()
        } catch (error) {
          console.error('Error:', error)
          next('/404')
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
      path: '/no-access',
      name: 'NoAccess',
      component: NoAccessView
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/404'
    },
    {
      path: '/token',
      name: 'token',
      component: TokenHandlerView
    }
  ]
})

export default router
