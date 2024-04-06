import { api, oauth2 } from '@/api/axiosConfig'
import { ref } from 'vue'
import type { LoginRequest } from '@/types/LoginRequest.ts'

/**
 * Provides composition functions for registration, including state management for registration errors.
 *
 * @returns An object containing the `registrationError` reactive state, `registerUser` function to register a user, and `clearError` function to clear any registration errors.
 */
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

/**
 * Checks if a username is available.
 *
 * @param {string} username - The username to check for availability.
 * @returns {Promise<boolean>} True if the username is available, false otherwise.
 */
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

/**
 * Provides composition functions for user login, including state management for login errors.
 *
 * @returns An object containing the `loginError` reactive state, `loginUser` function to log in a user, and `clearError` function to clear any login errors.
 */
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

/**
 * Retrieves user details by username.
 *
 * @param {string} username - The username to retrieve details for.
 * @returns {Promise<any | null>} The user details if found, null otherwise.
 */
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

/**
 * Fetches quizzes associated with a given user ID.
 *
 * @param {number} userId - The ID of the user whose quizzes are to be fetched.
 * @returns {Promise<any[] | null>} An array of quizzes if found, null otherwise.
 */
export const getQuizzesByUserId = async (userId: number): Promise<any[] | null> => {
  try {
    const response = await api.get(`/user/${userId}/quizzes`)
    return response.data || []
  } catch (error) {
    console.error('Error getting quizzes by user ID:', error)
    return null
  }
}

/**
 * Updates the profile picture of a user.
 *
 * @param {string} username - The username of the user.
 * @param {string} profilePictureUrl - The new URL for the user's profile picture.
 * @returns {Promise<boolean>} True if the update was successful, throws an error otherwise.
 */
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

/**
 * Retrieves quizzes by username.
 *
 * @param {string} username - The username to retrieve quizzes for.
 * @returns {Promise<any[] | null>} An array of quizzes associated with the username, null if the user is not found or on error.
 */
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

/**
 * Retrieves user details by user ID.
 *
 * @param {number} userId - The ID of the user to retrieve details for.
 * @returns {Promise<any | null>} The user details if found, null otherwise.
 */
export const getUserByUserId = async (userId: number): Promise<any | null> => {
  try {
    const response = await api.get(`/user/${userId}`)
    return response.data || null
  } catch (error) {
    console.error('Error getting user by user ID:', error)
    return null
  }
}
