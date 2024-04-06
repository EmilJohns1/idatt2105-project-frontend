import { api } from '@/api/axiosConfig'

/**
 * Fetches quiz attempts made by a user, sorted by the attempt ID in descending order.
 * This function allows for pagination through parameters that specify the page number and the number of items per page.
 * 
 * @param {number} userId - The id for the user's quiz attempts being fetched.
 * @param {number} requestSize - The number of quiz attempts to return per page.
 * @param {number} pageNumber - The page number for pagination, indicating which set of quiz attempts to return.
 * @returns {Promise<any | null>} A promise that resolves with the quiz attempts data for the specified user. The data includes pagination information and a list of quiz attempts. Returns null if an error occurs during the fetch operation.
 * 
 * @example
 * // Fetch the first five quiz attempts for user with ID 1
 * getAttemptsByUserId(1, 5, 1).then(data => {
 *   console.log(data);
 * }).catch(error => {
 *   console.error(error);
 * });
 */
export const getAttemptsByUserId = async (userId: number, requestSize:number, pageNumber:number): Promise<any | null> => {
  try {
    const params = {
      page: pageNumber,
      size: requestSize,
      sort: "id,desc"
    }
    const response = await api.get(`/attempts/all/${userId}`,{ params })
    console.log('response.data:', response.data)
    return response.data || []
  } catch (error) {
    console.error('Error getting attempts by user ID:', error)
    return null
  }
}
