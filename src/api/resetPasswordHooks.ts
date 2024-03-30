import api from '@/api/axiosConfig'
import type { LoginRequest } from '@/types/LoginRequest'

export const findTokenByEmail = async (email: string): Promise<any | null> => {
  try {
    const response = await api.get(`/password-reset/find-by-email?email=${email}`)
    return response.data || null
  } catch (error) {
    console.error('Error finding token by email:', error)
    return null
  }
}

export const resetPassword = async (resetRequest: LoginRequest): Promise<string> => {
  try {
    const response = await api.put('/password-reset/reset-password', resetRequest)
    return response.data
  } catch (error) {
    console.error('Error resetting password:', error)
    throw new Error('Failed to reset password')
  }
}

export const deleteByEmail = async (email: string): Promise<string> => {
  try {
    const response = await api.delete(`/password-reset/delete-by-email?email=${email}`)
    return response.data
  } catch (error) {
    console.error('Error deleting token by email:', error)
    throw new Error('Failed to delete token by email')
  }
}
