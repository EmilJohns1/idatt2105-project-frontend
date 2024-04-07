import { api } from '@/api/axiosConfig'

/**
 * Fetches quiz attempts made by a user, sorted by the attempt ID in descending order.
 * This function allows for pagination through parameters that specify the page number and the number of items per page.
 * 
 * @param {number} userId - The id for the user's quiz attempts being fetched.
 * @param {number} requestSize - The number of quiz attempts to return per page.
 * @param {number} pageNumber - The page number for pagination, indicating which set of quiz attempts to return.
 * @returns {Promise<any | null>} A promise that resolves with the quiz attempts data for the specified user. The data includes pagination information and a list of quiz attempts. Returns null if an error occurs during the fetch operation.
 */
export const getAttemptsByUserId = async (userId: number, requestSize:number, pageNumber:number): Promise<any | null> => {
  try {
    const params = {
      page: pageNumber,
      size: requestSize,
      sort: 'id,desc'
    }
    const response = await api.get(`/attempts/all/${userId}`, { params })
    return response.data || []
  } catch (error) {
    console.error('Error getting attempts by user ID:', error)
    return null
  }
}
