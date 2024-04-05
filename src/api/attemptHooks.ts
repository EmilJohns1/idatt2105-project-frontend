import { api } from '@/api/axiosConfig'

export const getAttemptsByUserId = async (userId: number, requestSize:number, pageNumber:number): Promise<any | null> => {
  try {
    const params = {
      page: pageNumber,
      size: requestSize,
      sort: "id,asc"
    }
    const response = await api.get(`/attempts/all/${userId}`,{ params })
    console.log('response.data:', response.data)
    return response.data || []
  } catch (error) {
    console.error('Error getting attempts by user ID:', error)
    return null
  }
}
