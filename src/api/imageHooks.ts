import { api } from '@/api/axiosConfig'

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
