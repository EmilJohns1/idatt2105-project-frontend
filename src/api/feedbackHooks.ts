import { api } from '@/api/axiosConfig'

interface FeedbackData {
  firstName: string
  lastName: string
  email: string
  feedbackType: 'ASSISTANCE' | 'FEEDBACK' | 'REPORT_ISSUE'
  content: string
  userId: number
}

export const createFeedback = async (feedbackData: FeedbackData): Promise<boolean> => {
  try {
    const response = await api.post('/feedback/create', feedbackData)
    console.log('Feedback created:', response.data)
    return true
  } catch (error) {
    console.error('Error creating feedback:', error)
    return false
  }
}
