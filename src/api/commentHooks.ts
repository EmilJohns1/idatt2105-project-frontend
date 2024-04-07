import { api } from '@/api/axiosConfig'

/**
 * Fetches comments made by a specific user.
 *
 * @param {number} userId - The ID of the user whose comments are to be fetched.
 * @returns {Promise<any[] | null>} A promise that resolves to an array of comments, or null in case of an error.
 */
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

/**
 * Fetches comments associated with a quiz, with support for pagination and sorting.
 *
 * @param {number} quizId - The ID of the quiz for which comments are to be fetched.
 * @param {Pagination} pagination - Pagination and sorting options.
 * @returns {Promise<any[] | null>} A promise that resolves to an array of comments, or null in case of an error.
 *
 * @typedef {Object} Pagination - Defines pagination and sorting parameters.
 * @property {number} page - Page number.
 * @property {number} size - Number of items per page.
 * @property {string[]} [sort] - Sorting criteria (optional).
 */
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

/**
 * Adds a new comment to a quiz.
 *
 * @param {any} commentData - The comment data to be added.
 * @returns {Promise<any>} A promise that resolves to the added comment data.
 * @throws Will throw an error if adding the comment fails.
 */
export const addCommentToQuiz = async (commentData: any) => {
  try {
    const response = await api.post('/comments', commentData)
    return response.data
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}
