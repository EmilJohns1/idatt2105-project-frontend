import { api } from '@/api/axiosConfig'

export const getCommentsByUserId = async (userId: number): Promise<any[] | null> => {
  try {
    const response = await api.get(`/comments/user/${userId}`)
    console.log('response.data:', response.data)
    return response.data || []
  } catch (error) {
    console.error('Error getting comments by user ID:', error)
    return null
  }
}
