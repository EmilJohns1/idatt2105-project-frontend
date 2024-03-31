<template>
  <div class="container">
    <h1 id="header">Edit Quiz</h1>
    <div v-if="quiz">
      <form @submit.prevent="updateQuiz">
        <h2>Title</h2>
        <input v-model="editedQuiz.title" type="text" required class="input-field" />
        <h2>Description</h2>
        <textarea
          v-model="editedQuiz.description"
          type="text"
          class="input-field description"
        ></textarea>
        <h2>Display image</h2>
        <img :src="editedQuiz.quizPictureUrl || placeholderImage" class="quiz-image" /><br />
        <input accept="image/*" type="file" @change="onFileChange" /><br />
        <h3>Add tags</h3>
        <div class="tags-input">
          <ul id="tags">
            <li v-for="(tag, index) in tagArray" :key="index">
              {{ tag }}
              <button class="delete-button" @click="removeTag(index)">X</button>
            </li>
          </ul>
          <input
            type="text"
            v-model="tagInput"
            @keydown.enter="addTag"
            placeholder="Enter tag (e.g. difficult)"
          />
          <button type="button" @click="addTag" :disabled="tagArray.length > 2" id="addTagButton">
            Create tag
          </button>
        </div>
        <h3>Category:</h3>
        <select v-model="editedQuiz.categoryName" required>
          <option disabled value="">Select a category</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <h3>Randomize Questions: <input type="checkbox" v-model="editedQuiz.randomizedOrder" /></h3>
        <h3>Make Public: <input type="checkbox" v-model="editedQuiz.public" /></h3>
        <div class="button-container">
          <button type="submit" class="submit-button">Update Quiz</button>
        </div>
      </form>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getQuizByQuizId, updateQuizById, getCategories, updateTags } from '@/api/quizHooks'
import type { QuizRequest } from '@/types/QuizRequest'
import { uploadFile, deletePicture } from '@/api/imageHooks'

const router = useRouter()
const quizId = parseInt(router.currentRoute.value.params.quiz_id as string)
const placeholderImage = '/placeholder-image.jpg'
const file = ref<File | null>(null)
const quiz = ref<any | null>(null)
const categories = ref<string[] | null>(null)
const editedQuiz = ref<any>({
  title: '',
  description: '',
  quizPictureUrl: '',
  categoryName: '',
  tags: [],
  randomizedOrder: false,
  public: false
})
const tagInput = ref('')

// Fetch quiz details by ID
const fetchQuizDetails = async () => {
  quiz.value = await getQuizByQuizId(quizId)
  console.log('Quiz:', quiz.value)
  if (quiz.value) {
    editedQuiz.value.title = quiz.value.title
    editedQuiz.value.description = quiz.value.description
    editedQuiz.value.quizPictureUrl = quiz.value.quizPictureUrl
    editedQuiz.value.categoryName = quiz.value.categoryName
    editedQuiz.value.tags = quiz.value.tags
    editedQuiz.value.randomizedOrder = quiz.value.randomizedOrder
    editedQuiz.value.public = quiz.value.public
  }
}

// Fetch categories
const fetchCategories = async () => {
  categories.value = await getCategories()
}

// Fetch quiz details and categories on component mount
onMounted(() => {
  fetchQuizDetails()
  fetchCategories()
})

const tagArray = computed(() =>
  editedQuiz.value.tags.map((tag: { tagName: string }) => tag.tagName)
)

// Update quiz details
const updateQuiz = async () => {
  await updateTags(editedQuiz.value.tags, quizId)
  await uploadPicture()

  const quizData: QuizRequest = {
    title: editedQuiz.value.title,
    description: editedQuiz.value.description,
    quizPictureUrl: editedQuiz.value.quizPictureUrl,
    categoryName: editedQuiz.value.category,
    randomizedOrder: editedQuiz.value.randomizedOrder,
    public: editedQuiz.value.public
  }

  console.log('Updating quiz:', quizData)

  await updateQuizById(quizId, quizData)

  console.log('Edited quiz title:', editedQuiz.value.title)

  setTimeout(async () => {
    await redirect(quizId, editedQuiz.value.title)
  }, 1000)
}

const redirect = async (quiz_id: number, quiz_title: string) => {
  router.push(`/quiz/${quiz_id}-${quiz_title.toLowerCase().replace(/ /g, '-')}/edit`)
  setTimeout(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, 250)
}

// Image preview
const previewImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      editedQuiz.value.quizPictureUrl = reader.result as string
    }
    reader.readAsDataURL(file)
  } else {
    editedQuiz.value.quizPictureUrl = ''
  }
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !editedQuiz.value.tags.includes(tag)) {
    editedQuiz.value.tags.push({ tagName: tag }) // Pushing an object with tagName property
    tagInput.value = ''
  }
}

// Remove tag
const removeTag = (index: number) => {
  editedQuiz.value.tags.splice(index, 1)
}

const onFileChange = (event: Event) => {
  validateImageSize(event)
  previewImage(event)
}

const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
  return validTypes.includes(file.type)
}

const validateImageSize = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]

  if (selectedFile) {
    const fileSize = selectedFile.size / 1024 // Convert to KB
    const maxSizeKB = 1024 * 3 // Max size in KB (3 MB)

    if (!validateImageFile(selectedFile)) {
      // Show an alert if file type is not valid
      window.alert('Invalid file type. Please select a PNG, JPG, or JPEG file.')
      // Reset the file input to clear the selected file
      target.value = ''
    } else if (fileSize > maxSizeKB) {
      // Show an alert if file size exceeds the maximum limit
      window.alert('File size exceeds the maximum limit. Maximum 3 MB allowed.')
      // Reset the file input to clear the selected file
      target.value = ''
    } else {
      // Update the file variable with the selected file
      file.value = selectedFile
    }
  }
}

const uploadPicture = async (): Promise<void> => {
  if (file.value) {
    try {
      if (editedQuiz.value.profilePicture) {
        const modifiedProfilePictureUrl = editedQuiz.value.profilePicture.replace(
          'https://',
          'https://quiz-project-fullstack.'
        )

        console.log('Deleting current profile picture:', modifiedProfilePictureUrl)
        const deleteSuccess = await deletePicture(modifiedProfilePictureUrl)

        if (!deleteSuccess) {
          console.error('Failed to delete current profile picture.')
          return
        }
      }

      // Upload the new profile picture
      const imageUrl: string | null = await uploadFile(file.value)
      console.log('Uploaded profile picture:', imageUrl)

      if (imageUrl) {
        const modifiedImageUrl = imageUrl.replace('https://quiz-project-fullstack.', 'https://')
        editedQuiz.value.quizPictureUrl = modifiedImageUrl
        console.log('Profile picture updated successfully.')
      } else {
        console.error('Failed to update profile picture.')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
    }
  } else {
    console.warn('No file selected.')
  }
}
</script>

<style scoped>
.tags-input {
  height: 100px;
}
#input-tag {
  position: absolute;
  bottom: 0;
  left: 0;
}
#addTagButton {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20%;
  font-size: 15px;
  color: white;
  border-radius: 10%;
  background-color: black;
  border: 0px;
  cursor: pointer;
}
#addTagButton:disabled {
  background-color: rgb(143, 143, 143);
  cursor: default;
}
#category {
  min-width: 150px;
}
h3 {
  margin-top: 20px;
}
.description {
  height: 100px;
  resize: none;
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100%;
  margin-top: 20px;
}

#header {
  font-size: 3rem;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.button-container {
  margin-top: 10px;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 5px;
}

.additional-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  width: 100%;
}

.submit-button,
.additional-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: black;
  color: white;
  cursor: pointer;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.submit-button:hover,
.additional-button:hover {
  background-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
form {
  width: 470px;
  padding-bottom: 20px;
}

.quiz-image {
  max-width: 100%;
  max-height: 200px;
  width: auto;
  height: auto;
}
</style>
