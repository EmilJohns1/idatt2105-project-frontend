import { api } from '@/api/axiosConfig'
import { ref } from 'vue'
import type { QuizRequest } from '@/types/QuizRequest'
import type { QuizAttemptRequest } from '@/types/QuizAttemptRequest'
import type { Tag } from '@/types/Tag'
import type { Page } from '@/types/Page'
import type { QuizDto } from '@/types/QuizDto'
import type { Question } from '@/types/Question'

/**
 * Fetches a quiz by its quizId.
 * 
 * @param {number} quizId - The unique identifier for the quiz to fetch.
 * @returns {Promise<QuizDto | null>} A promise that resolves with the quiz data or null if the quiz cannot be found or an error occurs.
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
 * Updates a quiz by quizId with new information.
 * 
 * @param {number} quizId - The unique identifier for the quiz to update.
 * @param {QuizRequest} quizData - The data to update the quiz with.
 * @returns {Promise<void>} A promise that resolves when the quiz is updated successfully.
 * @throws {Error} Throws an error if the quiz cannot be updated.
 */
export const updateQuizById = async (quizId: number, quizData: QuizRequest): Promise<void> => {
  try {
    const response = await api.put(`/quizzes/${quizId}`, quizData)

    if (response.status === 200) {
      console.log('Quiz updated successfully')
    } else {
      console.error('Failed to update quiz')
    }
  } catch (error) {
    console.error('Error updating quiz:', error)
    throw new Error('Failed to update quiz')
  }
}

/**
 * Register a new quiz with the provided quiz data.
 * 
 * @returns {Object} An object containing a `registrationError` ref string, `registerQuiz` method, and `clearError` method.
 */
export const useRegistration = () => {
  const registrationError = ref('')

  const registerQuiz = async (quizData: QuizRequest): Promise<number | null> => {
    try {
      console.log(quizData)
      const response = await api.post('/quizzes', quizData)

      if (response.status === 201 && response.data && response.data.id) {
        console.log('Quiz registered successfully')
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
 * Registers a new quiz attempt with provided quiz data.
 * 
 * @param { QuizAttemptRequest } quizData - The data to register the quiz attempt with. 
 * @returns { Promise<number | null> } A promise that resolves with the quiz attempt ID or null if the attempt cannot be registered or an error occurs.
 */
export const registerQuizAttempt = async (quizData: QuizAttemptRequest): Promise<number | null> => {
  try {
    console.log(quizData)
    const response = await api.post('/attempts/add', quizData)

    if (response.status === 201 && response.data && response.data.id) {
      console.log('Quiz registered successfully')
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
 * Adds a user to a quiz by their respective identifiers.
 * 
 * @param {number} quizId - The unique identifier for the quiz.
 * @param {number} userId - The unique identifier for the user to add to the quiz.
 * @returns {Promise<void>} A promise that resolves when the user is added successfully.
 * @throws {Error} Throws an error if the user cannot be added to the quiz.
 */
export const addUserToQuiz = async (quizId: number, userId: number): Promise<void> => {
  try {
    const response = await api.post(`/quizzes/${quizId}/users/${userId}`)

    if (response.status === 201) {
      console.log('User added to quiz successfully')
    } else {
      console.error('Failed to add user to quiz')
    }
  } catch (error) {
    console.error('Error adding user to quiz:', error)
    throw new Error('Failed to add user to quiz')
  }
}

/**
 * Deletes a user from a quiz by their respective identifiers.
 * 
 * @param {number} quizId - Identifier for the quiz.
 * @param {number} userId - Identifier for the user to delete from the quiz.
 * @returns {Promise<void>} A promise that resolves when the user is deleted successfully.
 * @throws {Error} Throws an error if the user cannot be deleted from the quiz.
 */
export const deleteUserFromQuiz = async (quizId: number, userId: number): Promise<void> => {
  try {
    const response = await api.delete(`/quizzes/${quizId}/users/${userId}`)

    if (response.status === 200) {
      console.log('User deleted from quiz successfully')
    } else {
      console.error('Failed to delete user from quiz')
    }
  } catch (error) {
    console.error('Error deleting user from quiz:', error)
    throw new Error('Failed to delete user from quiz')
  }
}

/**
 * Adds tags to a quiz by its unique id.
 * 
 * @param {Tag[]} tags - The tags to add to the quiz.
 * @param {number} quizId - The id for the quiz.
 * @returns {Promise<void>} A promise that resolves when the tags are added successfully.
 * @throws {Error} Throws an error if the tags cannot be added to the quiz.
 */
export const addTagsToQuiz = async (tags: Tag[], quizId: number): Promise<void> => {
  try {
    const response = await api.patch(`/quizzes/add/tags/${quizId}`, tags)
    console.log(response)
    if (response.status === 200) {
      console.log('Tag added to quiz successfully')
    } else {
      console.error('Failed to add tag to quiz')
    }
  } catch (error) {
    console.error('Error adding tag to quiz:', error)
    throw new Error('Failed to add tag to quiz')
  }
}

/**
 * Updates tags for a quiz by its id.
 * 
 * @param {Tag[]} tags - The updated tags for the quiz.
 * @param {number} quizId - The unique id for the quiz.
 * @returns {Promise<void>} A promise that resolves when the tags are updated successfully.
 * @throws {Error} Throws an error if the tags cannot be updated.
 */
export const updateTags = async (tags: Tag[], quizId: number): Promise<void> => {
  try {
    const response = await api.patch(`/quizzes/${quizId}/tags`, tags)

    if (response.status === 200) {
      console.log('Tag updated successfully')
    } else {
      console.error('Failed to update tag')
    }
  } catch (error) {
    console.error('Error updating tag:', error)
    throw new Error('Failed to update tag')
  }
}

/**
 * Fetches all categories.
 * 
 * @returns {Promise<string[] | null>} A promise that resolves with an array of category names or null if an error occurs.
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
 * Fetches all users associated with a quiz by its id.
 * 
 * @param {number} quizId - The id for the quiz.
 * @returns {Promise<any[] | null>} A promise that resolves with an array of users or null if an error occurs.
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
 * Fetches quizzes by category.
 * 
 * @param {string} category - The category to filter quizzes by.
 * @param {number} page - The page number for pagination.
 * @param {number} size - The number of quizzes per page.
 * @param {string} sort - The sorting criteria.
 * @returns {Promise<Page<QuizDto> | null>} A promise that resolves with a page of quizzes or null if an error occurs.
 */
export const fetchQuizzesByCategory = async (
  category: string,
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const fetchUrl = `/quizzes/category?category=${encodeURIComponent(category)}&page=${page}&size=${size}&sort=${sort}`;
  try {
    const response = await api.get(fetchUrl)
    if (response.status === 200) {
      console.log('Quizzes by category:', response.data.content)
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
 * Fetches all quizzes with optional pagination and sorting.
 * 
 * @param {number} page - The page number for pagination.
 * @param {number} size - The number of quizzes per page.
 * @param {string} sort - The sorting criteria.
 * @returns {Promise<Page<QuizDto> | null>} A promise that resolves with a page of quizzes or null if an error occurs.
 */
export const fetchAllQuizzes = async (
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const fetchUrl = `/quizzes?page=${page}&size=${size}&sort=${sort}`;
  try {
    const response = await api.get(fetchUrl)
    if (response.status === 200) {
      console.log('All quizzes:', response.data.content)
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
 * Fetches quizzes filtered by tags.
 * 
 * @param {string[]} tags - The tags to filter quizzes by.
 * @param {number} page - The page number for pagination.
 * @param {number} size - The number of quizzes per page.
 * @param {string} sort - The sorting criteria.
 * @returns {Promise<Page<QuizDto> | null>} A promise that resolves with a page of quizzes or null if an error occurs.
 */
export const fetchQuizzesByTags = async (
  tags: string[],
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const fetchUrl = `/quizzes/filter-by-tags`;
  const requestBody = JSON.stringify(tags); 
  const queryParams = new URLSearchParams({ page: String(page), size: String(size), sort }).toString();
  const fullUrl = `${fetchUrl}?${queryParams}`;

  try {
    const response = await api.post(fullUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200 && response.data) {
      console.log('Quizzes by tags:', response.data);
      return response.data;
    } else {
      console.error(`Failed to fetch quizzes by tags. Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch quizzes by tags: ${error}`);
    return null;
  }
};

/**
 * Fetches all tags used in quizzes.
 * 
 * @returns {Promise<Tag[] | null>} A promise that resolves with an array of tags or null if an error occurs.
 */
export const fetchAllTags = async (): Promise<Tag[] | null> => {
  try {
    const response = await api.get('/api/quizzes/all/tags');
    if (response.status === 200) {
      console.log('All tags:', response.data);
      return response.data;
    } else {
      console.error('Failed to fetch all tags. Status:', response.status);
      return null;
    }
  } catch (error) {
    console.error('Failed to fetch all tags:', error);
    return null;
  }
};

/**
 * Fetches all questions for a given quiz by its id.
 * 
 * @param {number} quizId - The id for the quiz.
 * @returns {Promise<Question[] | null>} A promise that resolves with an array of questions or null if an error occurs.
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
 * Fetches a quiz attempt by its id.
 * 
 * @param {number} id - The id for the quiz-attempt.
 * @returns {Promise<QuizAttemptRequest | null>} A promise that resolves with the quiz attempt data or null if an error occurs.
 */
export const getQuizAttemptById = async (id: number): Promise<QuizAttemptRequest | null> => {
  try {
    const response = await api.get(`/attempts/${id}`, {})
    if (response.status === 200 ){
    return response.data
    } else{
      console.error('Error fetching attempt')
      return null
    }
  } catch (error) {
    console.error('Error checking attemptId:', error)
    return null
  }
}
