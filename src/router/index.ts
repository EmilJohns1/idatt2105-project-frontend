import { createRouter, createWebHistory } from 'vue-router'
import UserSignUpView from '../views/UserSignUpView.vue'
import ExploreView from '../views/ExploreView.vue'
import UserPageView from '@/views/UserPageView.vue'
import ContactView from '@/views/ContactView.vue'
import UserResetPasswordView from '@/views/UserResetPasswordView.vue'
import QuizCreationView from '../views/QuizCreationView.vue'
import QuestionCreationView from '../views/QuestionCreationView.vue'
import QuizEditView from '../views/QuizEditView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import NoAccessView from '../views/NoAccessView.vue'
import UserLoginRedirect from '@/components/UserLoginRedirect.vue'
import TokenHandlerView from '@/views/TokenHandlerView.vue'
import { getQuizByQuizId, getUsersByQuizId, getQuizAttemptById } from '@/api/quizHooks'
import { getQuizzesByUsername } from '@/api/userHooks'
import { useUserStore } from '@/stores/userStore'
import UserForgotPasswordView from '@/views/UserForgotPasswordView.vue'
import HomeView from '@/views/HomeView.vue'
import QuizView from '@/views/QuizView.vue'
import QuizAttemptView from '@/views/QuizAttemptView.vue'

const checkAuthentication = async (
  to: { params: { quiz_id: any; quiz_title: { toString: () => any } }; name: string },
  from: any,
  next: (arg0?: string) => void
) => {
  const quizIdParam = to.params.quiz_id
  const quizTitleParam = to.params.quiz_title.toString()
  const quizId = Array.isArray(quizIdParam) ? quizIdParam[0] : quizIdParam
  const quizIdNumber = parseInt(quizId)
  const userStore = useUserStore()
  const currentUser = userStore.getUserName

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
      console.error('User does not have permission to access this quiz:', quizIdNumber)
      next('/no-access')
      return
    }

    if (to.name === 'CreateQuestion' || to.name === 'EditQuestions') {
      const users = await getUsersByQuizId(quizIdNumber)
      if (!users || !users.some((user) => user.username === currentUser)) {
        console.error('User does not have permission to these questions:', quizIdNumber)
        next('/no-access')
        return
      }
    }

    next()
  } catch (error) {
    console.error('Error:', error)
    next('/404')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/explore',
      name: 'Explore',
      component: ExploreView
    },
    {
      path: '/explore/:category',
      name: 'Category',
      component: () => import('../views/QuizCategoryView.vue'),
      props: true
    },
    {
      path: '/quiz/create',
      name: 'createQuiz',
      component: QuizCreationView,
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore()
        const currentUser = userStore.getUserName
        if (!currentUser) {
          console.error('User not logged in')
          next('/login')
          return
        }
        next()
      }
    },
    {
      path: '/quiz/:quiz_id-:quiz_title/attempt/:quizattempt_id',
      name: 'QuizAttempt',
      component: QuizAttemptView,
      props: (route) => ({
        quiz_id: route.params.quiz_id,
        quiz_title: route.params.quiz_title as string,
        quizattempt_id: route.params.quizattempt_id
      }),
      beforeEnter: async (to, from, next) => {
        const quizAttemptIdParam = to.params.quizattempt_id
        const quizAttemptId = Array.isArray(quizAttemptIdParam)
          ? quizAttemptIdParam[0]
          : quizAttemptIdParam
        const quizAttemptIdNumber = parseInt(quizAttemptId)
        try {
          const quizAttemptDetails = await getQuizAttemptById(quizAttemptIdNumber)
          if (!quizAttemptDetails) {
            console.error('Quiz not found:', quizAttemptIdNumber)
            next('/404')
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
      path: '/quiz/:quiz_id-:quiz_title',
      name: 'DoQuiz',
      component: QuizView,
      props: (route) => ({
        quiz_id: route.params.quiz_id,
        quiz_title: route.params.quiz_title as string
      }),
      beforeEnter: async (to, from, next) => {
        const quizIdParam = to.params.quiz_id
        const quizTitleParam = to.params.quiz_title.toString()
        const quizId = Array.isArray(quizIdParam) ? quizIdParam[0] : quizIdParam
        const quizIdNumber = parseInt(quizId)
        try {
          const quizDetails = await getQuizByQuizId(quizIdNumber)
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

          next()
        } catch (error) {
          console.error('Error:', error)
          next('/404')
        }
      }
    },
    {
      path: '/quiz/:quiz_id-:quiz_title/edit',
      name: 'EditQuiz',
      component: QuizEditView,
      props: (route) => ({
        quiz_id: route.params.quiz_id,
        quiz_title: route.params.quiz_title as string
      }),
      beforeEnter: (to, from, next) => {
        const { quiz_id, quiz_title } = to.params
        if (quiz_id && quiz_title) {
          checkAuthentication(
            { params: { quiz_id, quiz_title }, name: 'CreateQuestion' },
            from,
            next
          )
        } else {
          next('/404')
        }
      }
    },
    {
      path: '/quiz/:quiz_id-:quiz_title/questions/add',
      name: 'CreateQuestionAdd',
      component: QuestionCreationView,
      props: (route) => ({
        quiz_id: route.params.quiz_id,
        quiz_title: route.params.quiz_title as string
      }),
      beforeEnter: (to, from, next) => {
        const { quiz_id, quiz_title } = to.params
        if (quiz_id && quiz_title) {
          checkAuthentication(
            { params: { quiz_id, quiz_title }, name: 'CreateQuestionAdd' },
            from,
            next
          )
        } else {
          next('/404')
        }
      }
    },
    {
      path: '/quiz/:quiz_id-:quiz_title/questions/:question_id/edit',
      name: 'CreateQuestionEdit',
      component: QuestionCreationView,
      props: (route) => ({
        quiz_id: route.params.quiz_id,
        quiz_title: route.params.quiz_title as string,
        question_id: route.params.question_id
      }),
      beforeEnter: (to, from, next) => {
        const { quiz_id, quiz_title } = to.params
        if (quiz_id && quiz_title) {
          checkAuthentication(
            { params: { quiz_id, quiz_title }, name: 'CreateQuestionEdit' },
            from,
            next
          )
        } else {
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
      path: '/signup',
      name: 'signup',
      component: UserSignUpView
    },
    {
      path: '/login',
      name: 'login',
      component: UserLoginRedirect
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
      path: '/forgot-password',
      name: 'forgot-password',
      component: UserForgotPasswordView
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: UserResetPasswordView
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
