import api from '@/api/axiosConfig'

export const checkUsername = async (username: string): Promise<boolean> => {
  // Specify return type as Promise<boolean>
  try {
    const response = await api.get('/user/username', {
      params: { username: username }
    })
    return response.status === 200 // Return true if response status is 200, false otherwise
  } catch (error) {
    console.error('Error checking username:', error)
    return false
  }
}
