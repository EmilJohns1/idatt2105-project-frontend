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

export const deleteQuestionByQuestionId = async (questionId: number) => {
  try {
    const response = await api.delete(`/question/delete/${questionId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting question:', error)
    throw error
  }
}

export const getQuestionByQuestionId = async (questionId: number) => {
  try {
    const response = await api.get(`/question/get/${questionId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching question:', error)
  }
}

export const updateQuestionById = async (questionData: any) => {
  try {
    const response = await api.post(`/question/update`, questionData)
    return response.data
  } catch (error) {
    console.error('Error updating question:', error)
    throw error
  }
}

export const updateQuestionAlternatives = async (questionId: number, alternatives: any) => {
  try {
    const response = await api.put(`/question/${questionId}/alternatives`, alternatives)
    return response.data
  } catch (error) {
    console.error('Error updating alternatives:', error)
    throw error
  }
}

export const deleteAlternativeByAlternativeId = async (alternativeId: number) => {
  try {
    const response = await api.delete(`/question/delete/alternative/${alternativeId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting alternative:', error)
    throw error
  }
}
