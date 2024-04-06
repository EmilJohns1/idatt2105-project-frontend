<template>
  <div class="category-quizzes-container">
    <div class="header">
      <h1>{{ categoryName }}</h1>
      <p>Try out all the quizzes made by our bustling community</p>
      <div class="sort-select-container">
        <select v-model="selectedSort" @change="changeSort">
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
    <div class="tags-input-container">
      <div class="tags-input">
        <input
          type="text"
          v-model="currentTag"
          @keyup.enter="addTag"
          placeholder="Search Tags..."
          class="input-tag"
        />
        <button @click="addTag" class="add-tag-btn">Add tag</button>
      </div>
      <ul class="tags-list">
        <li v-for="(tag, index) in searchTags" :key="index" class="tag">
          {{ tag }}
          <button @click="removeTag(index)" class="remove-tag">x</button>
        </li>
      </ul>
    </div>
  </div>
  <div class="quizzes-grid">
    <CardItem
      v-for="quiz in filteredQuizzes"
      :key="quiz.id"
      :id="quiz.id"
      :image="quiz.quizPictureUrl || '/default.jpg'"
      :title="quiz.title"
      :description="quiz.description"
      :authorName="authorName(quiz)"
      :tags="quiz.tags"
      :date="quiz.creationDate"
      :lastModifiedDate="quiz.lastModifiedDate"
      :clickable="true"
      :type="'quiz'"
      @clicked="() => goToQuiz(quiz.id, quiz.title)"
    />
  </div>
  <div class="pagination-controls">
    <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">&lt; Previous</button>
    <button @click="changePage(1)" :disabled="currentPage === 1">1</button>

    <span v-if="currentPage > 3" class="pagination-ellipsis">...</span>
    <button v-if="currentPage > 2" @click="changePage(currentPage - 1)">
      {{ currentPage - 1 }}
    </button>
    <button
      v-if="currentPage > 1 && currentPage < totalPages"
      class="current-page"
      :disabled="true"
    >
      {{ currentPage }}
    </button>
    <button v-if="currentPage < totalPages - 1" @click="changePage(currentPage + 1)">
      {{ currentPage + 1 }}
    </button>
    <span v-if="currentPage < totalPages - 2" class="pagination-ellipsis">...</span>

    <button
      v-if="totalPages > 1"
      @click="changePage(totalPages)"
      :disabled="currentPage === totalPages"
    >
      {{ totalPages }}
    </button>
    <button @click="changePage(Number(currentPage) + 1)" :disabled="currentPage >= totalPages">
      Next &gt;
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardItem from './CardItem.vue'
import type { QuizDto } from '@/types/QuizDto'
import { fetchQuizzesByCategory, fetchAllQuizzes } from '@/api/quizHooks'
import { fetchQuizzesByTags } from '@/api/quizHooks'
import { fetchAllTags } from '@/api/quizHooks'

/**
 * Retrieves the author's name for a given quiz.
 * @param {QuizDto} quiz - The quiz object.
 * @returns {string} The username of the quiz's author or 'Unknown' if not available.
 */
const authorName = (quiz: QuizDto) => {
  return quiz.userDTOs.length > 0 ? quiz.userDTOs[0].username : 'Unknown'
}

// Reactive state declarations
const quizzes = ref<QuizDto[]>([])
const route = useRoute()
const router = useRouter()
//const searchTerm = ref(''); if we ever use it
const categoryName = ref(route.params.category ? route.params.category.toString() : '')
const quizzesPerPage = 6
const currentPage = ref(1)
const totalPages = ref(0)
const searchTags = ref<string[]>([])
const currentTag = ref('')
const selectedSort = ref('creationDate,desc') // Default sort option

// Sort options for quizzes
const sortOptions = [
  { value: 'creationDate,desc', text: 'Newest Creation Date' },
  { value: 'creationDate,asc', text: 'Oldest Creation Date' },
  //{ value: 'lastModifiedDate,desc', text: 'Newest Modified Date' },
  //{ value: 'lastModifiedDate,asc', text: 'Oldest Modified Date' },
  { value: 'title,asc', text: 'Title (A-Z)' },
  { value: 'title,desc', text: 'Title (Z-A)' }
  // Add more options here
]

const changeSort = async () => {
  await fetchQuizzes()
}

/**
 * Capitalizes the first letter of the category name for display.
 */
const capitalizeCategoryName = () => {
  const name = route.params.category ? route.params.category.toString() : 'All'
  return name.charAt(0).toUpperCase() + name.slice(1)
}

/**
 * Fetches quizzes based on the current category and page number.
 */
const fetchQuizzes = async () => {
  if (searchTags.value.length > 0) {
    await searchQuizzesByTags()
  } else {
    let response
    if (categoryName.value === 'All') {
      response = await fetchAllQuizzes(currentPage.value - 1, quizzesPerPage, selectedSort.value)
    } else {
      response = await fetchQuizzesByCategory(
        categoryName.value,
        currentPage.value - 1,
        quizzesPerPage,
        selectedSort.value
      )
    }

    if (response) {
      quizzes.value = response.content
      totalPages.value = Math.ceil(response.totalElements / quizzesPerPage)
    } else {
      console.error('Failed to fetch quizzes')
      quizzes.value = []
      totalPages.value = 0
    }
  }
}

/**
 * Fetches quizzes based on the current category and page number.
 */
const searchQuizzesByTags = async () => {
  if (searchTags.value.length > 0) {
    const response = await fetchQuizzesByTags(
      searchTags.value,
      currentPage.value - 1,
      quizzesPerPage,
      selectedSort.value
    )
    if (response && response.content) {
      let filteredContent = response.content

      // Filter by that category except for all, 'All' is special
      if (categoryName.value !== 'All') {
        filteredContent = filteredContent.filter((quiz) => quiz.categoryName === categoryName.value)
      }

      quizzes.value = filteredContent
      totalPages.value = Math.ceil(filteredContent.length / quizzesPerPage)
    } else {
      quizzes.value = []
      totalPages.value = 0
      console.error('Failed to fetch quizzes by tags')
    }
  } else {
    // If no tags are specified, fetch quizzes as per the category selected
    if (categoryName.value !== 'All') {
      await fetchQuizzes()
    }
  }
}

/**
 * Watches for changes in the search tags and current page number.
 */
watch([searchTags, currentPage], async () => {
  if (searchTags.value.length > 0) {
    await searchQuizzesByTags()
  }
})

/**
 * Adds a tag to the searchTags array and triggers a search.
 */
const addTag = () => {
  if (currentTag.value && !searchTags.value.includes(currentTag.value)) {
    searchTags.value.push(currentTag.value)
    currentTag.value = ''
    searchQuizzesByTags()
  }
}

/**
 * Removes a tag from the searchTags array and triggers the search to update.
 * @param {number} index - The index of the tag to remove.
 */
const removeTag = (index: number) => {
  searchTags.value.splice(index, 1)
  if (searchTags.value.length > 0) {
    searchQuizzesByTags()
  } else {
    fetchQuizzes()
  }
}

/**
 * Fetches quizzes on component mount based on category or tags.
 */
onMounted(() => {
  categoryName.value = capitalizeCategoryName()
  fetchQuizzes()
})

/**
 * Changes the current page of quizzes.
 * @param newPage - The new page number to navigate to.
 */
const changePage = async (newPage: number) => {
  currentPage.value = newPage
  await fetchQuizzes()
}

/**
 * Navigates to the quizzes page.
 * @param {number} quizId - The ID of the quiz to navigate to.
 * @param {string} quizTitle - The title of the quiz to navigate to.
 */
function goToQuiz(quizId: number, quizTitle: string) {
  const formattedTitle = encodeURIComponent(quizTitle.replace(/\s+/g, '-'))
  router.push(`/quiz/${quizId}-${formattedTitle}`)
}

const filteredQuizzes = computed(() => quizzes.value)

const searchQuizzes = async () => {
  // Future me, implement functionality to search quizzes by title?
  quizzes.value = [] // Clear current quizzes to ensure a fresh search
  currentPage.value = 1 // Start from the first page
  await fetchQuizzes()
}
</script>

<style scoped>
.category-quizzes-container {
  padding: 40px;
}
.quizzes-grid {
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  justify-content: center;
  align-items: start;
}

.tags-input-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
}

.tags-input {
  display: flex;
  border: 2px solid black;
  padding: 5px;
}

.input-tag {
  border: none;
  outline: none;
  flex-grow: 1;
}

.add-tag-btn {
  background-color: black;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.tags-list {
  display: flex;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tag {
  background-color: #eeeeee;
  border: 1px solid #cccccc;
  border-radius: 10px;
  padding: 5px 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  font-size: 0.8rem;
}

.remove-tag {
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.input-tag,
.add-tag-btn,
.search-btn {
  height: 40px;
}

.add-tag-btn:hover {
  background-color: black;
  color: white;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.pagination-controls button {
  border: 1px solid #cccccc;
  border-radius: 5px;
  background-color: white;
  padding: 8px 16px;
  margin: 0 5px;
  cursor: pointer;
  user-select: none;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.pagination-controls button.current-page,
.pagination-controls button:disabled {
  background-color: black;
  color: white;
  pointer-events: none;
}

.pagination-controls span {
  user-select: none;
}

.pagination-controls .pagination-ellipsis {
  text-align: center;
  padding: 8px 16px;
  margin: 0 5px;
  display: inline-block;
  min-width: 36px;
}

.pagination-controls .pagination-ellipsis {
  cursor: default;
}
</style>
@/types/QuizDTO
