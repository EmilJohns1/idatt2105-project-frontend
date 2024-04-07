import { api } from '@/api/axiosConfig'

/**
 * Fetches all questions for a given quiz by its ID.
 *
 * @param {number} quizId - The ID of the quiz.
 * @returns {Promise<any>} A list of questions associated with the quiz.
 */
export const getAllQuestionsByQuizId = async (quizId: number) => {
  try {
    const response = await api.get(`/question/get/all/${quizId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching questions:', error)
  }
}

/**
 * Adds a new question to a quiz.
 *
 * @param {any} questionData - The data for the new question.
 * @returns {Promise<any>} The created question's data.
 */
export const addQuestionToQuiz = async (questionData: any) => {
  try {
    const response = await api.post('/question/add', questionData)
    return response.data
  } catch (error) {
    console.error('Error adding question:', error)
    throw error
  }
}

/**
 * Adds an alternative to a question.
 *
 * @param {any} alternativeData - The data for the new alternative.
 * @returns {Promise<any>} The created alternative's data.
 */
export const addAlternativeToQuestion = async (alternativeData: any) => {
  try {
    const response = await api.post('/question/add/alternative', alternativeData)
    return response.data
  } catch (error) {
    console.error('Error adding alternative:', error)
    throw error
  }
}

/**
 * Updates a true or false question by its ID.
 *
 * @param {number} questionId - The ID of the question.
 * @param {boolean} isCorrect - The correctness of the question.
 * @returns {Promise<any>} The updated question's data.
 */
export const updateTrueOrFalseQuestion = async (questionId: number, isCorrect: boolean) => {
  try {
    const response = await api.patch(`/question/update/true-or-false/${questionId}&&${isCorrect}`)
    return response.data
  } catch (error) {
    console.error('Error updating true or false question:', error)
    throw error
  }
}

/**
 * Deletes a question by its ID.
 *
 * @param {number} questionId - The ID of the question to delete.
 * @returns {Promise<any>} Confirmation of deletion.
 */
export const deleteQuestionByQuestionId = async (questionId: number) => {
  try {
    const response = await api.delete(`/question/delete/${questionId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting question:', error)
    throw error
  }
}

/**
 * Fetches a single question by its ID.
 *
 * @param {number} questionId - The ID of the question.
 * @returns {Promise<any>} The fetched question's data.
 */
export const getQuestionByQuestionId = async (questionId: number) => {
  try {
    const response = await api.get(`/question/get/${questionId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching question:', error)
  }
}

/**
 * Updates a question by its ID.
 *
 * @param {any} questionData - The updated data for the question.
 * @returns {Promise<any>} The updated question's data.
 */
export const updateQuestionById = async (questionData: any) => {
  try {
    const response = await api.post(`/question/update`, questionData)
    return response.data
  } catch (error) {
    console.error('Error updating question:', error)
    throw error
  }
}

/**
 * Updates the alternatives for a question.
 *
 * @param {number} questionId - The ID of the question.
 * @param {any} alternatives - The updated alternatives.
 * @returns {Promise<any>} The updated alternatives' data.
 */
export const updateQuestionAlternatives = async (questionId: number, alternatives: any) => {
  try {
    const response = await api.put(`/question/${questionId}/alternatives`, alternatives)
    return response.data
  } catch (error) {
    console.error('Error updating alternatives:', error)
    throw error
  }
}

/**
 * Deletes an alternative by its ID.
 *
 * @param {number} alternativeId - The ID of the alternative to delete.
 * @returns {Promise<any>} Confirmation of deletion.
 */
export const deleteAlternativeByAlternativeId = async (alternativeId: number) => {
  try {
    const response = await api.delete(`/question/delete/alternative/${alternativeId}`)
    return response.data
  } catch (error) {
    console.error('Error deleting alternative:', error)
    throw error
  }
}
