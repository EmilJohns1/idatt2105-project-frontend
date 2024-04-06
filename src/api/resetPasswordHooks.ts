import { api } from '@/api/axiosConfig'
import type { ResetPasswordRequest } from '@/types/ResetPasswordRequest'

/**
 * Function to start the process of resetting password.
 * 
 * @param {ResetPasswordRequest} resetRequest - The details required to reset the password, including token and new password.
 * @returns {Promise<string>} The response message from the server being either success or fail.
 */
export const resetPassword = async (resetRequest: ResetPasswordRequest): Promise<string> => {
  try {
    const response = await api.put('/password-reset/reset-password', resetRequest)
    return response.data
  } catch (error) {
    console.error('Error resetting password:', error)
    throw new Error('Failed to reset password')
  }
}