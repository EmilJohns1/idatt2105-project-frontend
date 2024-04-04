<template>
  <div class="category-quizzes-container">
    <div class="header">
      <h1>{{ categoryName }}</h1>
      <p>Try out all the quizzes made by our bustling community</p>
      <div class="tags-input-container">
        <div class="tags-input">
          <input type="text"
             v-model="currentTag"
             @keyup.enter="addTag"
             placeholder="Search Tags..."
             class="input-tag" />
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
      <button @click="changePage(currentPage - 1)" :disabled="currentPage <= 1">Previous</button>
      
      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button @click="changePage(Number(currentPage) + 1)" :disabled="currentPage >= totalPages">Next</button>
    </div>
  </div>
</template>

<script setup lang = ts>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/api/axiosConfig';
import CardItem from './CardItem.vue';

const authorName = (quiz: Quiz) => {
  return quiz.userDTOs.length > 0 ? quiz.userDTOs[0].username : 'Unknown';
};

const route = useRoute();
const router = useRouter();
const quizzes = ref<Quiz[]>([]);
const searchTerm = ref('');
const categoryName = ref((route.params.category as string).charAt(0).toUpperCase() + (route.params.category as string).slice(1));

// Defining the Quiz interface with the fields returned by our API
interface Quiz {
  id: number;
  title: string;
  description: string;
  quizPictureUrl?: string;
  categoryName: string;
  creationDate: string;
  lastModifiedDate?: string;
  userDTOs: User[];
  tags: Tag[];
  randomizedOrder: boolean;
  authorId: number;
  public: boolean;
}

interface User {
  id: number;
  username: string;
  quizzes: string[];
  profilePictureUrl: string;
}

interface Tag {
  id: number;
  tagName: string;
}

const filteredQuizzes = computed(() => quizzes.value);

const quizzesPerPage = (6);
const currentPage = ref(1);
const totalPages = ref(0);

const currentTag = ref('');
const searchTags = ref<string[]>([]);

const addTag = () => {
  if (currentTag.value && !searchTags.value.includes(currentTag.value)) {
    searchTags.value.push(currentTag.value);
    currentTag.value = '';
  }
};

const removeTag = (index: number) => {
  searchTags.value.splice(index, 1);
};

async function fetchQuizzesByCategory(category: string) {
  const fetchUrl = `/quizzes/category?category=${encodeURIComponent(category)}&page=${currentPage.value - 1}&size=${quizzesPerPage}`;
  try {
    const response = await api.get(fetchUrl);
    console.log('Quizzes by category:', response.data.content);
    quizzes.value = response.data.content; 
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error(`Failed to fetch quizzes by category: ${category}`, error);
  }
}

async function fetchAllQuizzes() {
  const fetchUrl = `/quizzes?page=${currentPage.value - 1}&size=${quizzesPerPage}`;
  try {
    const response = await api.get(fetchUrl);
    console.log('All quizzes:', response.data.content);
    quizzes.value = response.data.content;
    totalPages.value = response.data.totalPages;
  } catch (error) {
    console.error('Failed to fetch all quizzes:', error);
  }
}

onMounted(async () => {
  const categoryParam = Array.isArray(route.params.category) 
    ? route.params.category[0] 
    : route.params.category;
  categoryName.value = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);
  
  if (categoryName.value === 'All') {
    await fetchAllQuizzes();
  } else {
    await fetchQuizzesByCategory(categoryName.value);
  }
});

const changePage = async (newPage: number) => {
  currentPage.value = newPage;
  if (categoryName.value === 'All') {
    await fetchAllQuizzes();
  } else {
    await fetchQuizzesByCategory(categoryName.value);
  }
};

function goToQuiz(quizId: string | number) { 
  router.push({ name: 'Quiz', params: { id: quizId } });
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
  background-color: #EEEEEE;
  border: 1px solid #CCCCCC;
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
</style>