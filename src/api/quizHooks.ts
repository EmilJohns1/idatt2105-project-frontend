import api from '@/api/axiosConfig'

export const getQuizByQuizId = async (quizId: number): Promise<any | null> => {
  try {
    const response = await api.get(`/quizzes/${quizId}`)
    return response.data || null
  } catch (error) {
    console.error('Error getting quiz by quiz ID:', error)
    return null
  }
}
