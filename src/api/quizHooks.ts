import { api } from '@/api/axiosConfig'
import { ref } from 'vue'
import type { QuizRequest } from '@/types/QuizRequest'
import type { QuizAttemptRequest } from '@/types/QuizAttemptRequest'
import type { Tag } from '@/types/Tag'
import type { Page } from '@/types/Page'
import type { QuizDto } from '@/types/QuizDto'
import type { Question } from '@/types/Question'

export const getQuizByQuizId = async (quizId: number): Promise<any | null> => {
  try {
    const response = await api.get(`/quizzes/${quizId}`)
    return response.data || null
  } catch (error) {
    console.error('Error getting quiz by quiz ID:', error)
    return null
  }
}

export const updateQuizById = async (quizId: number, quizData: QuizRequest): Promise<void> => {
  try {
    const response = await api.put(`/quizzes/${quizId}`, quizData)

    if (response.status === 200) {
      console.log('Quiz updated successfully')
    } else {
      console.error('Failed to update quiz')
    }
  } catch (error) {
    console.error('Error updating quiz:', error)
    throw new Error('Failed to update quiz')
  }
}

export const useRegistration = () => {
  const registrationError = ref('')

  const registerQuiz = async (quizData: QuizRequest): Promise<number | null> => {
    try {
      console.log(quizData)
      const response = await api.post('/quizzes', quizData)

      if (response.status === 201 && response.data && response.data.id) {
        console.log('Quiz registered successfully')
        return response.data.id
      } else {
        console.error('Registration failed:', response.data)
        registrationError.value = 'Registration failed'
        return null
      }
    } catch (error) {
      console.error('Error registering user:', error)
      registrationError.value = 'Registration failed'
      return null
    }
  }

  const clearError = () => {
    registrationError.value = ''
  }

  return { registrationError, registerQuiz, clearError }
}

export const registerQuizAttempt = async (quizData: QuizAttemptRequest): Promise<number | null> => {
  try {
    console.log(quizData)
    const response = await api.post('/attempts/add', quizData)

    if (response.status === 201 && response.data && response.data.id) {
      console.log('Quiz registered successfully')
      return response.data.id
    } else {
      console.error('Registration failed:', response.data)
      return null
    }
  } catch (error) {
    console.error('Error registering quiz attempt:', error)
    return null
  }
}

export const addUserToQuiz = async (quizId: number, userId: number): Promise<void> => {
  try {
    const response = await api.post(`/quizzes/${quizId}/users/${userId}`)

    if (response.status === 201) {
      console.log('User added to quiz successfully')
    } else {
      console.error('Failed to add user to quiz')
    }
  } catch (error) {
    console.error('Error adding user to quiz:', error)
    throw new Error('Failed to add user to quiz')
  }
}

export const deleteUserFromQuiz = async (quizId: number, userId: number): Promise<void> => {
  try {
    const response = await api.delete(`/quizzes/${quizId}/users/${userId}`)

    if (response.status === 200) {
      console.log('User deleted from quiz successfully')
    } else {
      console.error('Failed to delete user from quiz')
    }
  } catch (error) {
    console.error('Error deleting user from quiz:', error)
    throw new Error('Failed to delete user from quiz')
  }
}

export const addTagsToQuiz = async (tags: Tag[], quizId: number): Promise<void> => {
  try {
    const response = await api.patch(`/quizzes/add/tags/${quizId}`, tags)
    console.log(response)
    if (response.status === 200) {
      console.log('Tag added to quiz successfully')
    } else {
      console.error('Failed to add tag to quiz')
    }
  } catch (error) {
    console.error('Error adding tag to quiz:', error)
    throw new Error('Failed to add tag to quiz')
  }
}

export const updateTags = async (tags: Tag[], quizId: number): Promise<void> => {
  try {
    const response = await api.patch(`/quizzes/${quizId}/tags`, tags)

    if (response.status === 200) {
      console.log('Tag updated successfully')
    } else {
      console.error('Failed to update tag')
    }
  } catch (error) {
    console.error('Error updating tag:', error)
    throw new Error('Failed to update tag')
  }
}

export const getCategories = async (): Promise<string[] | null> => {
  try {
    const response = await api.get('/quizzes/categories', {})

    if (response.status === 200) {
      const categories = response.data.map((category: { name: string }) => category.name)
      return categories
    } else {
      console.error('Failed to fetch categories. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return null
  }
}

export const getUsersByQuizId = async (quizId: number): Promise<any[] | null> => {
  try {
    const response = await api.get(`/quizzes/users/${quizId}`)

    if (response.status === 200) {
      return response.data || []
    } else {
      console.error('Failed to fetch users by quiz ID. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Error fetching users by quiz ID:', error)
    return null
  }
}

export const fetchQuizzesByCategory = async (
  category: string,
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const sortParam = `sort=${sort}`;
  const fetchUrl = `/quizzes/category?category=${encodeURIComponent(category)}&page=${page}&size=${size}&sort=${sort}`;
  try {
    const response = await api.get(fetchUrl)
    if (response.status === 200) {
      console.log('Quizzes by category:', response.data.content)
      return response.data
    } else {
      console.error(`Failed to fetch quizzes by category: ${category}. Status: ${response.status}`)
      return null
    }
  } catch (error) {
    console.error(`Failed to fetch quizzes by category: ${category}`, error)
    return null
  }
}

export const fetchAllQuizzes = async (
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const sortParam = `sort=${sort}`;
  const fetchUrl = `/quizzes?page=${page}&size=${size}&sort=${sort}`;
  try {
    const response = await api.get(fetchUrl)
    if (response.status === 200) {
      console.log('All quizzes:', response.data.content)
      return response.data
    } else {
      console.error('Failed to fetch all quizzes. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Failed to fetch all quizzes:', error)
    return null
  }
}

export const fetchQuizzesByTags = async (
  tags: string[],
  page: number,
  size: number,
  sort: string
): Promise<Page<QuizDto> | null> => {
  const fetchUrl = `/quizzes/filter-by-tags`;
  const requestBody = JSON.stringify(tags); // Ensure tags are correctly serialized
  const queryParams = new URLSearchParams({ page: String(page), size: String(size), sort }).toString();
  const fullUrl = `${fetchUrl}?${queryParams}`;

  try {
    const response = await api.post(fullUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200 && response.data) {
      console.log('Quizzes by tags:', response.data);
      return response.data;
    } else {
      console.error(`Failed to fetch quizzes by tags. Status: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch quizzes by tags: ${error}`);
    return null;
  }
};

export const getQuestionsFromQuizId = async (quizId: number): Promise<Question[] | null> => {
  try {
    const response = await api.get(`/question/get/all/${quizId}`, {})
    if (response.status === 200) {
      return response.data
    } else {
      console.error('Failed to fetch categories. Status:', response.status)
      return null
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return null
  }
}
