import { api } from '@/api/axiosConfig'

export const getCommentsByUserId = async (userId: number): Promise<any[] | null> => {
  try {
    const response = await api.get(`/comments/user/${userId}`)
    return response.data || []
  } catch (error) {
    console.error('Error getting comments by user ID:', error)
    return null
  }
}

interface Pagination {
  page: number
  size: number
  sort?: string[]
}

export const getCommentsByQuizId = async (
  quizId: number,
  pagination: Pagination
): Promise<any[] | null> => {
  const { page, size, sort } = pagination
  const queryParams = `?page=${page}&size=${size}` + (sort ? `&sort=${sort.join(',')}` : '')
  try {
    const response = await api.get(`/comments/quiz/page/${quizId}${queryParams}`)
    return response.data || []
  } catch (error) {
    console.error('Error getting comments by quiz ID:', error)
    return null
  }
}

export const addCommentToQuiz = async (commentData: any) => {
  try {
    const response = await api.post('/comments', commentData)
    return response.data
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}
