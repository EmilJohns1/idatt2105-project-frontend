import { api } from '@/api/axiosConfig'
import type { ResetPasswordRequest } from '@/types/ResetPasswordRequest'

export const resetPassword = async (resetRequest: ResetPasswordRequest): Promise<string> => {
  try {
    const response = await api.put('/password-reset/reset-password', resetRequest)
    return response.data
  } catch (error) {
    console.error('Error resetting password:', error)
    throw new Error('Failed to reset password')
  }
}