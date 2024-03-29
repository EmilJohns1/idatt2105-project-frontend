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
