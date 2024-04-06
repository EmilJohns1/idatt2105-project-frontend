import { api } from '@/api/axiosConfig'

/**
 * Sends an email to the specified recipient.
 * 
 * @param {string} to - The email address of the recipient.
 * @throws {Error} Throws an error if the email sending fails.
 */
export const sendEmail = async (to: string) => {
  try {
    const response = await api.post('/sendEmail?to=' + to)
    console.log('Email sent successfully!')
    return response.data
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}
