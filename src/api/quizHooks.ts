import { api } from '@/api/axiosConfig'
import { ref } from 'vue'
import type { QuizRequest } from '@/types/QuizRequest'
import type { Tag } from '@/types/Tag'

export const getQuizByQuizId = async (quizId: number): Promise<any | null> => {
  try {
    const response = await api.get(`/quizzes/${quizId}`)
    return response.data || null
  } catch (error) {
    console.error('Error getting quiz by quiz ID:', error)
    return null
  }
}

export const useRegistration = () => {
  const registrationError = ref('')

  const registerQuiz = async (quizData: QuizRequest): Promise<number | null> => {
    try {
      console.log(quizData)
      const response = await api.post('/quizzes', quizData)

      if (response.status === 201 && response.data && response.data.id) {
        console.log('Quiz registered successfully')
        return response.data.id
      } else {
        console.error('Registration failed:', response.data)
        registrationError.value = 'Registration failed'
        return null
      }
    } catch (error) {
      console.error('Error registering user:', error)
      registrationError.value = 'Registration failed'
      return null
    }
  }

  const clearError = () => {
    registrationError.value = ''
  }

  return { registrationError, registerQuiz, clearError }
}

export const addUserToQuiz = async (quizId: number, userId: number): Promise<void> => {
  try {
    const response = await api.post(`/quizzes/${quizId}/users/${userId}`)

    if (response.status === 201) {
      console.log('User added to quiz successfully')
    } else {
      console.error('Failed to add user to quiz')
    }
  } catch (error) {
    console.error('Error adding user to quiz:', error)
    throw new Error('Failed to add user to quiz')
  }
}

export const addTagsToQuiz = async (tags: Tag[], quizId: number): Promise<void> => {
  try {
    const response = await api.patch(`/quizzes/add/tags/${quizId}`, tags)
    console.log(response)
    if (response.status === 200) {
      console.log('Tag added to quiz successfully')
    } else {
      console.error('Failed to add tag to quiz')
    }
  } catch (error) {
    console.error('Error adding tag to quiz:', error)
    throw new Error('Failed to add tag to quiz')
  }
}

export const getCategories = async (): Promise<string[] | null> => {
  try {
    const response = await api.get('/quizzes/categories', {})
    if (response.status === 200) {
      const categories = response.data.map((category: { name: string }) => category.name)
      return categories
    } else {
      console.error('Failed to fetch categories. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return null
  }
}
