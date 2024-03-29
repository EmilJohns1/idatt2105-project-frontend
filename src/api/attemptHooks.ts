import api from '@/api/axiosConfig'

export const getAttemptsByUserId = async (userId: number): Promise<any[] | null> => {
  try {
    const response = await api.get(`/attempts/all/${userId}`)
    console.log('response.data:', response.data)
    return response.data || []
  } catch (error) {
    console.error('Error getting attempts by user ID:', error)
    return null
  }
}
