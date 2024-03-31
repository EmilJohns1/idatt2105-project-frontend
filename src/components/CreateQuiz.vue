<template>
  <div class="container">
    <h1 id="header">Create new quiz</h1>
    <form @submit.prevent="submitForm">
      <h2>Title</h2>
      <input v-model="title" type="text" required class="input-field" />
      <h2>Description</h2>
      <textarea v-model="description" type="text" class="input-field description"></textarea>
      <h2>Display image</h2>
      <img :src="imageUrl || placeholderImage" id="image" /><br />
      <input accept="image/*" type="file" @change="previewImage" /><br />
      <h3>Category</h3>
      <select v-model="category">
        <option disabled value="">Select a category</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
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
      <div class="button-container">
        <button type="submit" class="submit-button">Create quiz</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '@/router'
import { useRegistration, getCategories, addUserToQuiz, addTagsToQuiz } from '@/api/quizHooks'
import type { QuizRequest } from '@/types/QuizRequest'
import type { Tag } from '@/types/Tag'
import { getUserByUsername } from '@/api/userHooks'
import { useUserStore } from '@/stores/userStore'

const imageUrl = ref('')
const placeholderImage = 'public/placeholder-image.jpg'
const title = ref('')
const description = ref('')
const category = ref('')
const tagArray = ref<string[]>([])

const { registerQuiz, clearError } = useRegistration()
const registrationError = ref('')

const categories = ref<string[] | null>(null)

//fetch categories
const fetchCategories = async () => {
  categories.value = await getCategories()
}

onMounted(fetchCategories)

const submitForm = async () => {
  clearError()

  //registering quiz
  const quizData: QuizRequest = {
    title: title.value,
    description: description.value,
    quizPictureUrl: imageUrl.value,
    categoryName: category.value
  }
  console.log(quizData)
  const quizId = await registerQuiz(quizData)
  if (quizId == null) {
    registrationError.value = 'Registration failed.'
  } else {
    redirect(quizId, quizData.title)
  }

  if (tagArray.value && quizId) {
    let tagsData: Tag[] = []
    for (let i = tagArray.value.length - 1; i >= 0; i--) {
      const tag: Tag = { tagName: tagArray.value[i] }
      tagsData.push(tag)
    }
    console.log(tagsData)
    addTagsToQuiz(tagsData, quizId)
  }

  const userStore = useUserStore()
  const username = userStore.getUserName
  if (username && quizId) {
    try {
      const userData = await getUserByUsername(username)
      if (userData) {
        const userId = userData.id
        addUserToQuiz(quizId, userId)
      }
    } catch {
      console.log('Failed to add user to quiz')
    }
  }
}

const redirect = (quiz_id: number, quiz_title: string) => {
  router.push('/quiz/{' + quiz_id + '}-{' + quiz_title + '}/edit')
  setTimeout(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, 250)
}

const addTagElement = () => {
  const tag = document.createElement('li')
  const tagContent = input.value!.value.trim()

  if (tagContent !== '') {
    console.log(tagArray.value.length)
    tagArray.value.push(tagContent)
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
  margin-top: 40px;
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
}
</style>
