import { api } from '@/api/axiosConfig'

/**
 * Uploads a file to the server.
 * 
 * @param {File} file - The file to upload.
 * @returns {Promise<string | null>} The response data from the server, otherwise null.
 */
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

/**
 * Deletes a file from the server based on its URL.
 * 
 * @param {string} url - The URL of the file to delete.
 * @returns {Promise<boolean>} True if succesful, or false and throws.
 */
export const deletePicture = async (url: string): Promise<boolean> => {
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
