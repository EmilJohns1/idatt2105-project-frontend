import { api } from '@/api/axiosConfig'
import { ref } from 'vue'
import type { QuizRequest } from '@/types/QuizRequest'
import type { QuizAttemptRequest } from '@/types/QuizAttemptRequest'
import type { Tag } from '@/types/Tag'
import type { Page } from '@/types/Page'
import type { QuizDto } from '@/types/QuizDto'
import type { Question } from '@/types/Question'

/**
 * Fetches quiz details by its ID.
 *
 * @param {number} quizId - ID of the quiz to fetch.
 * @returns {Promise<QuizDto | null>} Quiz details or null/error if not found.
 */
export const getQuizByQuizId = async (quizId: number): Promise<any | null> => {
  try {
    const response = await api.get(`/quizzes/${quizId}`)
    return response.data || null
  } catch (error) {
    console.error('Error getting quiz by quiz ID:', error)
    return null
  }
}

/**
 * Updates the details of a specific quiz.
 *
 * @param {number} quizId - The quiz's unique identifier.
 * @param {QuizRequest} quizData - The new details for the quiz.
 * @returns {Promise<void>} Resolves if the update is successful.
 */
export const updateQuizById = async (quizId: number, quizData: QuizRequest): Promise<void> => {
  try {
    const response = await api.put(`/quizzes/${quizId}`, quizData)

    if (response.status !== 200) {
      console.error('Failed to update quiz')
    }
  } catch (error) {
    console.error('Error updating quiz:', error)
    throw new Error('Failed to update quiz')
  }
}

/**
 * Provides registration functionality for a quiz.
 *
 * @returns {Object} - Includes registration functions and error handling.
 */
export const useRegistration = () => {
  const registrationError = ref('')

  const registerQuiz = async (quizData: QuizRequest): Promise<number | null> => {
    try {
      const response = await api.post('/quizzes', quizData)

      if (response.status === 201 && response.data && response.data.id) {
        return response.data.id
      } else {
        console.error('Registration failed:', response.data)
        registrationError.value = 'Registration failed'
        return null
      }
    } catch (error) {
      console.error('Error registering user:', error)
      registrationError.value = 'Registration failed'
      return null
    }
  }

  const clearError = () => {
    registrationError.value = ''
  }

  return { registrationError, registerQuiz, clearError }
}

/**
 * Registers an attempt for a quiz.
 *
 * @param {QuizAttemptRequest} quizData - The attempt data.
 * @returns {Promise<number | null>} The attempt's ID or null if registration fails.
 */
export const registerQuizAttempt = async (quizData: QuizAttemptRequest): Promise<number | null> => {
  try {
    const response = await api.post('/attempts/add', quizData)

    if (response.status === 201 && response.data && response.data.id) {
      return response.data.id
    } else {
      console.error('Registration failed:', response.data)
      return null
    }
  } catch (error) {
    console.error('Error registering quiz attempt:', error)
    return null
  }
}

/**
 * Adds a user to a quiz.
 *
 * @param {number} quizId - The quiz's ID.
 * @param {number} userId - The user's ID.
 * @returns {Promise<void>} Indicates successful addition.
 */
export const addUserToQuiz = async (quizId: number, userId: number): Promise<void> => {
  try {
    const response = await api.post(`/quizzes/${quizId}/users/${userId}`)

    if (response.status !== 201) {
      console.error('Failed to add user to quiz')
    }
  } catch (error) {
    console.error('Error adding user to quiz:', error)
    throw new Error('Failed to add user to quiz')
  }
}

/**
 * Removes a user from a quiz.
 *
 * @param {number} quizId - The quiz's ID.
 * @param {number} userId - The user's ID to remove.
 * @returns {Promise<void>} Indicates successful removal.
 */
export const deleteUserFromQuiz = async (quizId: number, userId: number): Promise<void> => {
  try {
    const response = await api.delete(`/quizzes/${quizId}/users/${userId}`)

    if (response.status !== 200) {
      console.error('Failed to delete user from quiz')
    }
  } catch (error) {
    console.error('Error deleting user from quiz:', error)
    throw new Error('Failed to delete user from quiz')
  }
}

/**
 * Adds tags to a quiz.
 *
 * @param {Tag[]} tags - Tags to add.
 * @param {number} quizId - The quiz's ID.
 * @returns {Promise<void>} Indicates successful add.
 */
export const addTagsToQuiz = async (tags: Tag[], quizId: number): Promise<void> => {
  try {
    const response = await api.patch(`/quizzes/add/tags/${quizId}`, tags)
    if (response.status !== 200) {
      console.error('Failed to add tag to quiz')
    }
  } catch (error) {
    console.error('Error adding tag to quiz:', error)
    throw new Error('Failed to add tag to quiz')
  }
}

/**
 * Updates a quiz's tags.
 *
 * @param {Tag[]} tags - New tags.
 * @param {number} quizId - The quiz's ID.
 * @returns {Promise<void>} Mean successful update.
 */
export const updateTags = async (tags: Tag[], quizId: number): Promise<void> => {
  try {
    const response = await api.patch(`/quizzes/${quizId}/tags`, tags)

    if (response.status !== 200) {
      console.error('Failed to update tag')
    }
  } catch (error) {
    console.error('Error updating tag:', error)
    throw new Error('Failed to update tag')
  }
}

/**
 * Retrieves all quiz categories.
 *
 * @returns {Promise<string[] | null>} List of category names or null.
 */
export const getCategories = async (): Promise<string[] | null> => {
  try {
    const response = await api.get('/quizzes/categories', {})

    if (response.status === 200) {
      const categories = response.data.map((category: { name: string }) => category.name)
      return categories
    } else {
      console.error('Failed to fetch categories. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return null
  }
}

/**
 * Fetches all users associated with a quiz.
 *
 * @param {number} quizId - The quiz's ID.
 * @returns {Promise<any[] | null>} User data or null.
 */
export const getUsersByQuizId = async (quizId: number): Promise<any[] | null> => {
  try {
    const response = await api.get(`/quizzes/users/${quizId}`)

    if (response.status === 200) {
      return response.data || []
    } else {
      console.error('Failed to fetch users by quiz ID. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Error fetching users by quiz ID:', error)
    return null
  }
}

/**
 * Fetches quizzes by category with pagination and optional sorting.
 *
 * @param {string} category - Category name.
 * @param {number} page - Page index.
 * @param {number} size - Page size.
 * @param {string} sort - Sorting criteria.
 * @returns {Promise<Page<QuizDto> | null>} Paginated quiz data or null.
 */
export const fetchQuizzesByCategory = async (
  category: string,
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const fetchUrl = `/quizzes/category?category=${encodeURIComponent(category)}&page=${page}&size=${size}&sort=${sort}`
  try {
    const response = await api.get(fetchUrl)
    if (response.status === 200) {
      return response.data
    } else {
      console.error(`Failed to fetch quizzes by category: ${category}. Status: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error(`Failed to fetch quizzes by category: ${category}`, error)
    return null
  }
}

/**
 * Retrieves all quizzes with optional pagination and sorting.
 *
 * @param {number} page - Page index.
 * @param {number} size - Page size.
 * @param {string} sort - Sorting criteria.
 * @returns {Promise<Page<QuizDto> | null>} Paginated quiz data or null.
 */
export const fetchAllQuizzes = async (
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const fetchUrl = `/quizzes?page=${page}&size=${size}&sort=${sort}`
  try {
    const response = await api.get(fetchUrl)
    if (response.status === 200) {
      return response.data
    } else {
      console.error('Failed to fetch all quizzes. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Failed to fetch all quizzes:', error)
    return null
  }
}

/**
 * Fetches quizzes filtered by tags with pagination and sorting.
 *
 * @param {string[]} tags - Tags to filter by.
 * @param {number} page - Page index.
 * @param {number} size - Page size.
 * @param {string} sort - Sorting criteria.
 * @returns {Promise<Page<QuizDto> | null>} Paginated quiz data or null.
 */
export const fetchQuizzesByTags = async (
  tags: string[],
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const fetchUrl = `/quizzes/filter-by-tags`
  const requestBody = JSON.stringify(tags)
  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort
  }).toString()
  const fullUrl = `${fetchUrl}?${queryParams}`

  try {
    const response = await api.post(fullUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200 && response.data) {
      return response.data
    } else {
      console.error(`Failed to fetch quizzes by tags. Status: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error(`Failed to fetch quizzes by tags: ${error}`)
    return null
  }
}

/**
 * Retrieves all tags used in quizzes.
 *
 * @returns {Promise<Tag[] | null>} List of tags or null.
 */
export const fetchAllTags = async (): Promise<Tag[] | null> => {
  try {
    const response = await api.get('/api/quizzes/all/tags')
    if (response.status === 200) {
      return response.data
    } else {
      console.error('Failed to fetch all tags. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Failed to fetch all tags:', error)
    return null
  }
}

/**
 * Fetches all questions for a given quiz ID.
 *
 * @param {number} quizId - The quiz's ID.
 * @returns {Promise<Question[] | null>} List of questions or null.
 */
export const getQuestionsFromQuizId = async (quizId: number): Promise<Question[] | null> => {
  try {
    const response = await api.get(`/question/get/all/${quizId}`, {})
    if (response.status === 200) {
      return response.data
    } else {
      console.error('Failed to fetch categories. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return null
  }
}

/**
 * Retrieves a specific quiz attempt by its ID.
 *
 * @param {number} id - The attempt's ID.
 * @returns {Promise<QuizAttemptRequest | null>} Attempt details or null.
 */
export const getQuizAttemptById = async (id: number): Promise<QuizAttemptRequest | null> => {
  try {
    const response = await api.get(`/attempts/${id}`, {})
    if (response.status === 200) {
      return response.data
    } else {
      console.error('Error fetching attempt')
      return null
    }
  } catch (error) {
    console.error('Error checking attemptId:', error)
    return null
  }
}
