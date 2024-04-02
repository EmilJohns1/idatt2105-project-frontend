<template>
  <div class="category-quizzes-container">
    <div class="header">
      <h1>{{ categoryName }}</h1>
      <p>Try out all the quizzes made by our bustling community</p>
      <input type="text" v-model="searchTerm" placeholder="Search keywords..." />
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

interface Quiz {
  id: string | number; 
  title: string; 
  description: string; 
  pictureUrl: string;
  creationDate: string;
  tags: Tag[];
}

interface Tag {
  id: number;
  tagName: string;
}

async function fetchQuizzesByTag(tag: string) {
  try {
    const response = await api.get(`/api/quizzes/tag?tag=${encodeURIComponent(tag)}`);
    quizzes.value = response.data;
    console.log('Quizzes by tag:', quizzes.value);
  } catch (error) {
    console.error('Failed to fetch quizzes by tag:', error);
  }
}

onMounted(async () => {
  // Just ensure route.params.category is treated as a string so no errors
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
</style>