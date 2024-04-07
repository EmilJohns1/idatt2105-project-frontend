<template>
  <div class="container">
    <div class="sidebar">
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="question"
        @click="editQuestion(index)"
      >
        <div class="image-container">
          <img
            :src="question.mediaUrl || '/icons/default_quiz/question.png'"
            alt="Question"
            class="question-image"
          />
        </div>
        <div class="text-container">
          <h4 class="question-title" :title="question.questionText">{{ question.questionText }}</h4>
        </div>
        <div class="add-question-button-container">
          <img
            src="/icons/trash-white-circle.png"
            alt="Remove"
            class="remove-icon"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
            @click="removeQuestion(index)"
            @click.stop
          />
        </div>
      </div>
      <div class="image-container add-question" @click="addQuestion">
        <icon class="icon" name="plus"></icon>
      </div>
    </div>
    <div class="edit-quiz">
      <h1 id="header1">Edit Quiz</h1>
      <div v-if="quiz" class="quiz-is-present-container">
        <form @submit.prevent="updateQuiz" class="edit-quiz-form">
          <div class="top-row-container">
            <div class="image-container">
              <h2>Display image</h2>
              <img :src="editedQuiz.quizPictureUrl || placeholderImage" class="quiz-image" /><br />
              <input
                accept="image/*"
                name="file"
                type="file"
                id="file"
                class="inputfile"
                @change="onFileChange"
              />
              <label for="file">Choose a file</label>
            </div>

            <div class="title-desc-container">
              <h2>Title</h2>
              <input v-model="editedQuiz.title" type="text" required class="input-field" />
              <h2>Description</h2>
              <textarea
                v-model="editedQuiz.description"
                type="text"
                class="input-field description"
              ></textarea>
            </div>
          </div>

          <h3>Category:</h3>
          <select v-model="editedQuiz.categoryName" required>
            <option disabled value="">Select a category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <div class="tag-div">
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
              <button
                type="button"
                @click="addTag"
                :disabled="tagArray.length > 2"
                id="addTagButton"
              >
                Create tag
              </button>
            </div>
          </div>

          <h3>Randomize Questions:</h3>
          <label class="switch">
            <input type="checkbox" v-model="editedQuiz.randomizedOrder" />
            <span class="slider round"></span>
          </label>
          <h3>Make Public:</h3>
          <label class="switch">
            <input type="checkbox" v-model="editedQuiz.public" />
            <span class="slider round"></span>
          </label>
          <Popup
            id="popup"
            v-if="isVisible"
            :error-message="popupMessage.message"
            :font-color="popupMessage.color"
            @popup-closed="isVisible = false"
          />
          <div class="button-container">
            <button type="submit" class="submit-button">Update Quiz</button>
          </div>
        </form>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
    <div class="additional-buttons">
      <button
        v-if="isAuthor"
        @click="showCollaborateModal"
        class="additional-button collaborate-button"
      >
        Collaborate
      </button>
      <ImportButton :quizId="quizId" />
      <ExportButton :quizId="quizId" />
      <button @click="redirectToHelp" class="additional-button collaborate-button">
        Help
      </button>
    </div>
    <CollaborateModal v-if="showModal" @close="hideCollaborateModal" :quizId="quizId" />
  </div>
</template>

<script setup lang="ts">
import Popup from '@/components/Popup.vue'
import CollaborateModal from '@/components/CollaborateModal.vue'
import ImportButton from '@/components/ImportButton.vue'
import ExportButton from '@/components/ExportButton.vue'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getQuizByQuizId,
  updateQuizById,
  getCategories,
  updateTags,
  getUsersByQuizId
} from '@/api/quizHooks'
import type { QuizRequest } from '@/types/QuizRequest'
import { uploadFile, deletePicture } from '@/api/imageHooks'
import { getAllQuestionsByQuizId, deleteQuestionByQuestionId } from '@/api/questionHooks'
import { getUserByUsername } from '@/api/userHooks'
import { useUserStore } from '@/stores/userStore'
import { type PopupMessage } from '@/types/PopupMessage'

const router = useRouter()
const quizId = parseInt(router.currentRoute.value.params.quiz_id as string)
const placeholderImage = '/icons/default_quiz/question.png'
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
const userData = ref(null)
const users = ref<any[]>([])
const authorId = ref(0)
const showModal = ref(false)
const userStore = useUserStore()
const questions = ref<any[]>([])
const hoveredIndex = ref<number | null>(null)
const originalPictureUrl = ref('')
const popupMessage = ref<PopupMessage>({ message: '', color: '' })
const isVisible = ref(false)

// Fetch quiz details by ID
const fetchQuizDetails = async () => {
  quiz.value = await getQuizByQuizId(quizId)
  if (quiz.value) {
    editedQuiz.value.title = quiz.value.title
    editedQuiz.value.description = quiz.value.description
    editedQuiz.value.quizPictureUrl = quiz.value.quizPictureUrl
    editedQuiz.value.categoryName = quiz.value.categoryName
    editedQuiz.value.tags = quiz.value.tags
    editedQuiz.value.randomizedOrder = quiz.value.randomizedOrder
    editedQuiz.value.public = quiz.value.public
  }
  if (quiz.value.quizPictureUrl) {
    originalPictureUrl.value = quiz.value.quizPictureUrl
  }
  authorId.value = quiz.value.authorId
}

const fetchData = async () => {
  if (quizId) {
    questions.value = (await getAllQuestionsByQuizId(quizId)) as any[]
    users.value = (await getUsersByQuizId(quizId)) as any[]
    const username = userStore.getUserName
    userData.value = await getUserByUsername(username || '')
    categories.value = await getCategories()
  }
}

// Fetch quiz details and categories on component mount
onMounted(() => {
  fetchQuizDetails()
  fetchData()
})

const tagArray = computed(() =>
  editedQuiz.value.tags.map((tag: { tagName: string }) => tag.tagName)
)

// Update quiz details
const updateQuiz = async () => {
  if (!checkQuestionCount() && editedQuiz.value.public === true) {
    showPopup('You need at least 5 questions to make your quiz public!', 'red')
    setTimeout(() => {
      window.location.reload()
    }, 2000)
    return
  }

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
  try {
    showPopup('Updating...', '')
    await updateQuizById(quizId, quizData)
    setTimeout(async () => {
      await redirectToPage(quizId, editedQuiz.value.title)
      showPopup('Updated', 'green')
      setTimeout(async () => {
        window.location.reload()
      }, 500)
    }, 1000)
  } catch {
    showPopup('Failed to update', 'red')
    setTimeout(async () => {
      window.location.reload()
    }, 1000)
  }
}

const redirectToPage = async (quiz_id: number, quiz_title: string) => {
  router.push(`/quiz/${quiz_id}-${quiz_title.toLowerCase().replace(/ /g, '-')}/edit`)
  setTimeout(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, 250)
}

const redirectToQuestionPage = async (quiz_id: number, quiz_title: string) => {
  router.push(`/quiz/${quiz_id}-${quiz_title.toLowerCase().replace(/ /g, '-')}/questions/add`)

  setTimeout(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, 250)
}

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
      window.alert('Invalid file type. Please select a PNG, JPG, or JPEG file.')
      target.value = ''
    } else if (fileSize > maxSizeKB) {
      window.alert('File size exceeds the maximum limit. Maximum 3 MB allowed.')
      target.value = ''
    } else {
      file.value = selectedFile
    }
  }
}

const uploadPicture = async (): Promise<void> => {
  if (file.value) {
    try {
      if (originalPictureUrl.value) {
        const modifiedPictureUrl = originalPictureUrl.value.replace(
          'https://s3.eu-north-1.amazonaws.com/quiz-project-fullstack/',
          'https://quiz-project-fullstack.s3.eu-north-1.amazonaws.com/'
        )

        const deleteSuccess = await deletePicture(modifiedPictureUrl)

        if (!deleteSuccess) {
          console.error('Failed to delete current profile picture.')
          return
        }
      }

      // Upload the new profile picture
      const imageUrl: string | null = await uploadFile(file.value)

      if (imageUrl) {
        const modifiedImageUrl = imageUrl.replace('https://quiz-project-fullstack.', 'https://')
        editedQuiz.value.quizPictureUrl = modifiedImageUrl
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

const showCollaborateModal = () => {
  showModal.value = true
}

const hideCollaborateModal = () => {
  showModal.value = false
}

const isAuthor = computed(() => {
  if (!userData.value) return false
  const userDataWithId = userData.value as { id: number }
  return userDataWithId && authorId.value === userDataWithId.id
})

const editQuestion = (index: number) => {
  const question = questions.value[index]
  const { quiz_id, quiz_title } = router.currentRoute.value.params
  if (quiz_id && quiz_title) {
    if (question && question.id) {
      router.push(`/quiz/${quiz_id}-${quiz_title}/questions/${question.id}/edit`)
    }
  }
}

const removeQuestion = async (index: number) => {
  const question = questions.value[index]
  const confirmDelete = confirm('Are you sure you want to delete this question?')
  if (confirmDelete) {
    try {
      await deleteQuestionByQuestionId((question as { id: number }).id)
      questions.value.splice(index, 1)
    } catch (error) {
      console.error('Error deleting question:', error)
    }
  }
}

const addQuestion = async () => {
  await redirectToQuestionPage(quizId, editedQuiz.value.title)
}

const checkQuestionCount = () => {
  return questions.value.length >= 5
}

const showPopup = (message: string, color: string) => {
  popupMessage.value = { message, color }
  isVisible.value = true
}

const redirectToHelp = () => {
  window.open('https://github.com/1Cezzo/idatt2105-project-backend/wiki/Import-format');
}
</script>

<style scoped>
#popup {
  z-index: 2;
}

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
  border-radius: 2px;
  background-color: black;
  border: 0px;
  cursor: pointer;
  margin: 5px;
  padding: 5px;
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
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 20px;
  padding: 20px;
}

.sidebar {
  border-right: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.edit-quiz-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.edit-questions {
  grid-column: 1 / span 1;
  align-items: center;
  justify-content: center;
}

.edit-quiz {
  grid-column: 2 / span 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#header1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.input-field {
  font-family: inherit;
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 0;
  box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.5em;
}

.button-container {
  margin-top: 10px;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 5px;
}

.additional-buttons {
  grid-column: 3;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.additional-buttons button {
  margin-bottom: 10px;
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
  width: 100%;
  padding-bottom: 20px;
}

.quiz-image {
  max-width: 100%;
  max-height: 200px;
  width: auto;
  height: auto;
  border-radius: 8px;
  border: 1px solid #333;
}

.collaborate-button {
  position: relative;
  align-self: flex-end;
  max-width: fit-content;
  font-size: 1rem;
  margin-top: 10px;
}

.left-panel {
  width: 30%;
  padding-right: 20px;
  margin-right: auto;
}

#header2 {
  font-size: 2rem;
  margin-bottom: 20px;
  margin-right: auto;
}

.question-item {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 10px;
}

.question {
  max-width: 150px;
  max-height: 200px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 5px;
}

.question:hover {
  box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  cursor: pointer;
}

.add-questio {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.question-info {
  display: flex;
  align-items: flex-start;
}

.image-container {
  flex-shrink: 0;
}

.text-container {
  margin-left: 0px;
  margin-top: -5px;
}

.question-image {
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid #ccc;
  max-height: 78px;
  cursor: pointer;
}

.remove-icon {
  position: absolute;
  top: 5px;
  right: 32px;
  width: 20px;
  height: 20px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}

.question:hover .remove-icon {
  opacity: 1;
}

.question {
  position: relative;
}

.add-question {
  cursor: pointer;
  width: fit-content;
  min-width: 116px;
  min-height: 78px;
  background-color: #ccc;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.question-image {
  min-width: 116px;
  max-width: 116px;
  min-height: 78;
  max-height: 78px;
  background-color: #ccc;
}

.icon {
  width: fit-content;
  color: white;
  margin: 0;
}

.question-title {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to two lines */
  -webkit-box-orient: vertical;
  white-space: normal; /* Ensures text wraps within the limited lines */
  padding: 5px;
}

/* Hide the title attribute and style the tooltip */
.question-title[title] {
  position: relative;
}

.question-title[title]:hover::after {
  content: attr(title);
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  z-index: 999;
  left: 100%;
  top: 0;
  white-space: normal;
}
.top-row-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
}
.title-desc-container {
  margin-left: 10px;
  width: 50%;
}
.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.quiz-is-present-container {
  width: 100%;
}

.tag-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
}
select {
  appearance: none;
  border: 0;
  outline: 0;
  font: inherit;
  width: 15rem;
  padding: 1rem 4rem 1rem 1rem;
  color: black;
  border-radius: 0.5em;
  cursor: pointer;
  transition: box-shadow 0.3s;

  &::-ms-expand {
    display: none;
  }
  option {
    color: inherit;
    background-color: var(--option-bg);
  }
}
select:hover {
  box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  font-size: 1em;
  font-weight: 700;
  display: inline-block;
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px 10px;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.inputfile:focus + label,
.inputfile + label:hover {
  background-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.inputfile + label {
  cursor: pointer; /* "hand" cursor */
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

@media (max-width: 1100px) {
  .container {
    display: flex;
    flex-direction: column;
    overflow-x: scroll;
    justify-content: center;
  }

  .top-row-container {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  .title-desc-container {
    margin: 0;
    margin-top: 10px;
  }

  .tag-div {
    width: 80%;
  }

  .sidebar {
    flex-direction: row;
    width: 100vw;
    overflow-x: scroll;
  }

  .question-title {
    display: none;
  }

  .question {
    width: 500px;
    margin-right: 20px;
  }

  .layout-container {
    width: 100%;
  }

  .additional-buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .additional-button {
    display: flex;
    margin: 0;
    margin-right: 10px;
    margin-bottom: 0;
  }

  #addTagButton {
    width: 100px;
  }
}
</style>
