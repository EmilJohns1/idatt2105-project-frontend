<template>
  <div class="container">
    <div v-if="loading" class="loading-message">Creating quiz...</div>
    <div v-else class="quiz-present-container">
      <h1 id="header">Create new quiz</h1>
      <h3>Choose Template:</h3>
      <select v-model="selectedTemplate" @change="applyTemplate">
        <option disabled value="">Select a template</option>
        <option v-for="template in templates" :key="template.name" :value="template">
          {{ template.name }}
        </option>
      </select>
      <form @submit.prevent="submitForm">
        <h3>Category:</h3>
        <select v-model="category" required>
          <option disabled value="">Select a category</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        
        <div class="top-row-container">
          <div class="image-container">
            <h2>Display image</h2>
            <img :src="imageUrl || placeholderImage" id="image" class="quiz-image" /><br />
            <input accept="image/*" name="file" type="file" id="file" class="inputfile" @change="previewImage"/>
            <label for="file">Choose a file</label>
          </div>

          <div class="title-desc-container">
            <h2>Title</h2>
            <input v-model="title" type="text" required class="input-field" spellcheck="false" maxLength="100"/>
            <h2>Description</h2>
            <textarea v-model="description" type="text" class="input-field description" spellcheck="false" maxLength="255"></textarea>
          </div>
        </div>

        <div class="tag-div">
          <h3>Add tags</h3>
          <div class="tags-input">
            <ul id="tags"></ul>
            <input type="text" id="input-tag" placeholder="Enter tag (e.g. difficult)" />
            <button
              type="button"
              @click="addTagElement"
              :disabled="tagArray.length > 2"
              id="addTagButton"
            >
              Create tag
            </button>
          </div>
        </div>
        
        <h3>Randomize Questions:</h3> 
        <label class="switch">
          <input type="checkbox" v-model="isRandomized" />
          <span class="slider round"></span>
        </label>
          <div class="button-container">
            <button type="submit" class="submit-button">Create quiz</button>
          </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue'
import router from '@/router'
import { useRegistration, getCategories, addUserToQuiz, addTagsToQuiz } from '@/api/quizHooks'
import type { QuizRequest } from '@/types/QuizRequest'
import type { Tag } from '@/types/Tag'
import { getUserByUsername } from '@/api/userHooks'
import { useUserStore } from '@/stores/userStore'
import { templates } from '@/utils/templates'
import { handleImport } from '@/utils/functions'

const imageUrl = ref('')
const placeholderImage = '/default.jpg'
const title = ref('')
const description = ref('')
const category = ref("Hello")
const tagArray = ref<string[]>([])
const isPublic = ref(false)
const isRandomized = ref(false)
const fileName = ref('')
const userStore = useUserStore()

const { registerQuiz, clearError } = useRegistration()
const registrationError = ref('')

const categories = ref<string[] | null>(null)

const loading = ref(false)
const selectedTemplate: Ref<any> = ref(null)

const fetchCategories = async () => {
  categories.value = await getCategories()
}

onMounted(fetchCategories)

const submitForm = async () => {
  clearError()

  loading.value = true

  const quizData: QuizRequest = {
    title: title.value,
    description: description.value,
    quizPictureUrl: imageUrl.value,
    categoryName: category.value,
    randomizedOrder: isRandomized.value,
    public: isPublic.value
  }

  try {
    const quizId = await registerQuiz(quizData)
    if (!quizId) {
      registrationError.value = 'Registration failed.'
      return
    }

    const tagsData: Tag[] = tagArray.value.map((tag) => ({ tagName: tag }))
    await addTagsToQuiz(tagsData, quizId)

    const username = userStore.getUserName
    if (username) {
      const userData = await getUserByUsername(username)
      if (userData) {
        await addUserToQuiz(quizId, userData.id)
      }
    }
    if (fileName.value !== '') {
      try {
        const response = await fetch(`/templates/${fileName.value}`)
        const text = await response.text()

        const file = new File([text], fileName.value)
        await handleImport(file, quizId)
      } catch (error) {
        console.error('Error fetching template file:', error)
      }
    }
    setTimeout(() => {
      loading.value = false
      redirect(quizId, quizData.title) // Redirect after all asynchronous operations are completed
    }, 1000)
  } catch (error) {
    console.error('Error submitting form:', error)
    loading.value = false
    registrationError.value = 'Failed to create quiz.'
  }
}

const redirect = async (quiz_id: number, quiz_title: string) => {
  await router.push(`/quiz/${quiz_id}-${quiz_title.toLowerCase().replace(/ /g, '-')}/edit`)
  setTimeout(() => {
    window.location.reload()
  }, 250)
}

const addTagElement = () => {
  const tagContent = input.value!.value.trim()

  if (tagContent !== '') {
    tagArray.value.push(tagContent)

    const tag = document.createElement('li')
    tag.innerText = tagContent
    tag.innerHTML += '<button class="delete-button">X</button>'
    tags.value?.appendChild(tag)

    input.value!.value = ''
  }
}

const previewImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  } else {
    imageUrl.value = ''
  }
}

const tags = ref<HTMLElement | null>(null)
const input = ref<HTMLInputElement | null>(null)

onMounted(() => {
  tags.value = document.getElementById('tags')
  input.value = document.getElementById('input-tag') as HTMLInputElement

  if (!tags.value || !input.value) {
    throw new Error('Could not find tags or input elements in the DOM')
  }

  tags.value.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.classList.contains('delete-button')) {
      const parent = target.parentNode as HTMLElement
      const tagContent = parent.textContent?.trim().replace('X', '')

      if (tagContent) {
        const index = tagArray.value.findIndex((tag) => tag === tagContent)

        if (index !== -1) {
          tagArray.value.splice(index, 1)
        }
      }
      parent.removeChild(target)
      parent.remove()
    }
  })
})

const applyTemplate = async () => {
  if (selectedTemplate.value) {
    const template = selectedTemplate.value
    title.value = template.title
    description.value = template.description
    imageUrl.value = template.imageUrl
    category.value = template.category
    isPublic.value = template.isPublic
    isRandomized.value = template.isRandomized

    tags.value!.innerHTML = ''
    tagArray.value = []

    if (template.tags) {
      for (const tag of template.tags) {
        input.value!.value = tag

        addTagElement()
      }
    }

    if (template.name === 'None') {
      fileName.value = ''
    } else {
      fileName.value = template.name.toLowerCase().replace(/ /g, '-') + '.txt'
    }
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
}
#image {
  width: 320px;
  height: 200px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

.quiz-present-container {
  width: 100%;
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

select {
  appearance: none;
  border: 0;
  outline: 0;
  font: inherit;
  width: 15rem;
  height: 2rem;
  padding: 0 1em 0 0.5em;
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
.tag-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40%;
}
.quiz-present-container {
  width: 100%;
}
</style>
