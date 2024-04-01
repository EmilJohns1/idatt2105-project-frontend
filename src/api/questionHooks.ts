import { api } from '@/api/axiosConfig'

export const getAllQuestionsByQuizId = async (quizId: number) => {
  try {
    const response = await api.get(`/question/get/all/${quizId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching questions:', error)
  }
}

export const addQuestionToQuiz = async (questionData: any) => {
  try {
    const response = await api.post('/question/add', questionData)
    return response.data
  } catch (error) {
    console.error('Error adding question:', error)
    throw error
  }
}

export const addAlternativeToQuestion = async (alternativeData: any) => {
  try {
    const response = await api.post('/question/add/alternative', alternativeData)
    return response.data
  } catch (error) {
    console.error('Error adding alternative:', error)
    throw error
  }
}

export const updateTrueOrFalseQuestion = async (questionId: number, isCorrect: boolean) => {
  try {
    const response = await api.patch(`/question/update/true-or-false/${questionId}&&${isCorrect}`)
    return response.data
  } catch (error) {
    console.error('Error updating true or false question:', error)
    throw error
  }
}
