import { api, oauth2 } from '@/api/axiosConfig'
import { ref } from 'vue'
import type { LoginRequest } from '@/types/LoginRequest.ts'

export const useRegistration = () => {
  const registrationError = ref('')

  const registerUser = async (userData: LoginRequest): Promise<boolean> => {
    try {
      const response = await oauth2.post('/api/user/register', userData)

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

export const uploadFile = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/storage/uploadFile', formData)

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error('Failed to upload file')
    }
  } catch (error) {
    throw new Error(`Error uploading file`)
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

export const deleteProfilePicture = async (url: string): Promise<boolean> => {
  console.log('url:', url)
  try {
    const response = await api.delete('/storage/deleteFile', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        fileUrl: url
      }
    })

    if (response.status === 200) {
      return true
    } else {
      throw new Error(`Failed to delete profile picture. Status: ${response.status}`)
    }
  } catch (error) {
    throw new Error(`Error deleting profile picture: ${error}`)
  }
}
