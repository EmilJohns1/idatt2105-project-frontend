import { api } from '@/api/axiosConfig'

interface FeedbackData {
  firstName: string
  lastName: string
  email: string
  feedbackType: 'ASSISTANCE' | 'FEEDBACK' | 'REPORT_ISSUE'
  content: string
  userId: number
}

/**
 * Submits user feedback to the server.
 *
 * @param {FeedbackData} feedbackData - The user's feedback including names, email, type, content, and user ID.
 * @returns {Promise<boolean>} Resolves to true if feedback is successfully submitted, false if there's an error.
 */
export const createFeedback = async (feedbackData: FeedbackData): Promise<boolean> => {
  try {
    await api.post('/feedback/create', feedbackData)
    return true
  } catch (error) {
    console.error('Error creating feedback:', error)
    return false
  }
}
