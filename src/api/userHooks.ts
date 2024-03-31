import api from '@/api/axiosConfig'
import { ref } from 'vue'
import type { LoginRequest } from '@/types/LoginRequest.ts'

export const useRegistration = () => {
  const registrationError = ref('')

  const registerUser = async (userData: LoginRequest): Promise<boolean> => {
    try {
      const response = await api.post('/user/register', userData)

      if (response.status === 200) {
        console.log('User registered successfully')
        return true
      } else {
        console.error('Registration failed:', response.data)
        registrationError.value = 'Registration failed'
        return false
      }
    } catch (error) {
      console.error('Error registering user:', error)
      registrationError.value = 'Registration failed'
      return false
    }
  }

  const clearError = () => {
    registrationError.value = ''
  }

  return { registrationError, registerUser, clearError }
}

export const checkUsername = async (username: string): Promise<boolean> => {
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

export const useLogin = () => {
  const loginError = ref('')

  const loginUser = async (userData: LoginRequest): Promise<boolean> => {
    try {
      const response = await api.post('/user/login', userData)

      if (response.status === 200) {
        console.log('User logged in successfully')
        return true
      } else {
        console.error('Login failed:', response.data)
        loginError.value = 'Login failed'
        return false
      }
    } catch (error) {
      console.error('Error logging in:', error)
      loginError.value = 'Login failed'
      return false
    }
  }

  const clearError = () => {
    loginError.value = ''
  }

  return { loginError, loginUser, clearError }
}

export const getUserByUsername = async (username: string): Promise<any | null> => {
  try {
    const response = await api.get('/user/username', {
      params: { username: username }
    })
    return response.data || null
  } catch (error) {
    console.error('Error getting user by username:', error)
    return null
  }
}

export const getQuizzesByUserId = async (userId: number): Promise<any[] | null> => {
  try {
    const response = await api.get(`/user/${userId}/quizzes`)
    return response.data || []
  } catch (error) {
    console.error('Error getting quizzes by user ID:', error)
    return null
  }
}

export const updateProfilePicture = async (
  username: string,
  profilePictureUrl: string
): Promise<boolean> => {
  try {
    const response = await api.put(
      `/user/profile-picture?username=${username}&profilePictureUrl=${profilePictureUrl}`
    )

    if (response.status === 200) {
      return true
    } else {
      throw new Error(`Failed to update profile picture. Status: ${response.status}`)
    }
  } catch (error) {
    throw new Error(`Error updating profile picture: ${error}`)
  }
}

export const getQuizzesByUsername = async (username: string): Promise<any[] | null> => {
  try {
    const user = await getUserByUsername(username)

    if (user) {
      return await getQuizzesByUserId(user.id)
    } else {
      return null
    }
  } catch (error) {
    console.error('Error getting quizzes by username:', error)
    return null
  }
}
