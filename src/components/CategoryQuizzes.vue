<template>
  <div class="category-quizzes-container">
    <div class="header">
      <h1>{{ categoryName }}</h1>
      <p>Try out all the quizzes made by our bustling community</p>
      <div class="search-input-container">
        <input type="text"
          v-model="searchTerm"
          @keyup.enter="searchQuizzes"
          placeholder="Search Quiz Titles..."
          button="Search"
          />
      <div>
        <button @click="changeSort('creationDate')">Sort by Creation Date</button>
        <button @click="changeSort('lastModifiedDate')">Sort by Last Modified Date</button>
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
        :image="quiz.quizPictureUrl || '/defualt-quiz-image.jpg'"
        :title="quiz.title"
        :description="quiz.description"
        :authorName="authorName(quiz)"
        :tags="quiz.tags"
        :date="quiz.creationDate"
        :lastModifiedDate="quiz.lastModifiedDate"
        :clickable="true"
        :type="'quiz'"
        @clicked="goToQuiz(quiz.id)"
      />
    </div>
    <div class="pagination-controls">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">< Previous</button>
      <button @click="changePage(1)" :disabled="currentPage === 1">1</button>

      <span v-if="currentPage > 3" class="pagination-ellipsis">...</span>
      <button v-if="currentPage > 2" @click="changePage(currentPage - 1)">{{ currentPage - 1 }}</button>
      <button v-if="currentPage > 1 && currentPage < totalPages" class="current-page" :disabled="true">{{ currentPage }}</button>
      <button v-if="currentPage < totalPages - 1" @click="changePage(currentPage + 1)">{{ currentPage + 1 }}</button>
      <span v-if="currentPage < totalPages - 2" class="pagination-ellipsis">...</span>

      <button v-if="totalPages > 1" @click="changePage(totalPages)" :disabled="currentPage === totalPages">{{ totalPages }}</button>
      <button @click="changePage(Number(currentPage) + 1)" :disabled="currentPage >= totalPages">Next ></button>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CardItem from './CardItem.vue'
import type { QuizDto } from '@/types/QuizDto'
import { fetchQuizzesByCategory, fetchAllQuizzes } from '@/api/quizHooks'

const authorName = (quiz: QuizDto) => {
  return quiz.userDTOs.length > 0 ? quiz.userDTOs[0].username : 'Unknown'
}

// Use route and router for navigation and param retrieval
const route = useRoute();
const router = useRouter();

// Define reactive states
const quizzes = ref<QuizDto[]>([]); // Use QuizDto directly here
const searchTerm = ref('');
const categoryName = ref(route.params.category ? route.params.category.toString() : '');
const quizzesPerPage = 6;
const currentPage = ref(1);
const totalPages = ref(0);
const searchTags = ref<string[]>([]);

// Function to capitalize the category name from the route parameter
const capitalizeCategoryName = () => {
  const name = route.params.category ? route.params.category.toString() : 'All';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const filteredQuizzes = computed(() => {
  if (!searchTerm.value.trim()) {
    return quizzes.value; // Return all quizzes if search term is empty
  }
  // Filter quizzes by title based on search term
  return quizzes.value.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.value.trim().toLowerCase())
  );
});
const searchQuizzes = async () => {
  await fetchQuizzes(); 
};

const fetchQuizzes = async () => {
  // Always start from the first page for a new search
  currentPage.value = 1;
  let response;
  if (categoryName.value === 'All') {
    response = await fetchAllQuizzes(0, quizzesPerPage, searchTerm.value);
  } else {
    response = await fetchQuizzesByCategory(categoryName.value, 0, quizzesPerPage, searchTerm.value);
  }
  if (response) {
    quizzes.value = response.content;
    totalPages.value = Math.ceil(response.totalElements / quizzesPerPage);
  } else {
    quizzes.value = [];
    console.error('Failed to fetch quizzes');
  }
};

const currentTag = ref('')

const addTag = () => {
  if (currentTag.value && !searchTags.value.includes(currentTag.value)) {
    searchTags.value.push(currentTag.value)
    currentTag.value = ''
  }
}

const removeTag = (index: number) => {
  searchTags.value.splice(index, 1);
};

onMounted(() => {
  categoryName.value = capitalizeCategoryName();
  fetchQuizzes();
});

const changePage = async (newPage: number) => {
  currentPage.value = newPage
  if (categoryName.value === 'All') {
    const response = await fetchAllQuizzes(currentPage.value - 1, quizzesPerPage)
    if (response) {
      quizzes.value = response.content
      totalPages.value = response.totalPages
    } else {
      console.log('Error fetching quizzes')
    }
  } else {
    await fetchQuizzesByCategory(categoryName.value, currentPage.value - 1, quizzesPerPage)
  }
}

function goToQuiz(quizId: string | number) {
  router.push({ name: 'Quiz', params: { id: quizId } })
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



.input-tag, .add-tag-btn, .search-btn {
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
