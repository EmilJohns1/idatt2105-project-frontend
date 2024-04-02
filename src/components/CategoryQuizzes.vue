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
      <button @click="searchByTags" class="search-btn">Search</button>
    </div>
    <div class="quizzes-grid">
      <CardItem
      v-for="quiz in filteredQuizzes"
      key="quiz.id"
      id="quiz.id"
      :image="quiz.pictureUrl || '/defualt-quiz-image.jpg'"
      :title="quiz.title"
      :description="quiz.description"
      :date="quiz.creationDate"
      :clickable="true"
      @clicked="goToQuiz(quiz.id)"
      />
    </div>
  </div>
</template>

<script setup lang = ts>
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '@/api/axiosConfig';
import CardItem from './CardItem.vue';

const route = useRoute();
const router = useRouter();
const quizzes = ref<Quiz[]>([]);
const searchTerm = ref('');
const categoryName = ref(route.params.category);

// Defining the Quiz interface with the fields returned by our API
interface Quiz {
  id: number;
  title: string;
  description: string;
  pictureUrl: string;
  categoryName: string;
  creationDate: string;
  lastModifiedDate: string;
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

async function searchByTags() {
  if (searchTags.value.length === 0) {
    await fetchAllQuizzes();
  } else {
    const tagsString = searchTags.value.join(',');
    await fetchQuizzesByTag(tagsString);
  }
};

async function fetchQuizzesByTag(tags: string) {
  try {
    const response = await api.get(`/api/quizzes/tag?tags=${encodeURIComponent(tags)}`);
    quizzes.value = response.data;
  } catch (error) {
    console.error('Failed to fetch quizzes by tags:', error);
  }
};

async function fetchAllQuizzes() {
  try {
    const response = await api.get('/quizzes');
    quizzes.value = response.data;
  } catch (error) {
    console.error('Failed to fetch all quizzes:', error);
  }
}

onMounted(async () => {
  const categoryParam = Array.isArray(route.params.category) 
    ? route.params.category[0] 
    : route.params.category;

  categoryName.value = categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    : 'All';

  const fetchUrl = categoryName.value === 'All' 
    ? '/quizzes' // Fetch all quizzes
    : `/quizzes/category?category=${encodeURIComponent(categoryName.value)}`; // Fetch quizzes by category

  try {
    const response = await api.get(fetchUrl);
    quizzes.value = response.data;
    console.log('Quizzes:', quizzes.value);
  } catch (error) {
    console.error('Failed to fetch quizzes:', error);
  }
});


const filteredQuizzes = computed(() => {
  return searchTerm.value
    ? quizzes.value.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.value.toLowerCase())
      )
    : quizzes.value;
});

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

.search-btn {
  border: 2px solid black;
  background: none;
  padding: 5px 20px;
  cursor: pointer;
}

.input-tag, .add-tag-btn, .search-btn {
  height: 40px;
}

.add-tag-btn:hover, .search-btn:hover {
  background-color: black;
  color: white;
}
</style>