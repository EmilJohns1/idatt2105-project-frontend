import { api } from '@/api/axiosConfig'

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
