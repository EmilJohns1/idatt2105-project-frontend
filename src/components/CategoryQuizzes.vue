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
      :key="quiz.id"
      :id="quiz.id"
      :image="quiz.pictureUrl || '/defualt-quiz-image.jpg'"
      :title="quiz.title"
      :description="quiz.description"
      :clickable="true"
      @clicked="goToQuiz(quiz.id)"
      />
    </div>
  </div>
</template>

<script setup lang = ts>
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axiosConfig';
import CardItem from './CardItem.vue';

const route = useRoute();
const quizzes = ref([]);
const searchTerm = ref('');
const categoryName = ref(route.params.category);

onMounted(async () => {
  categoryName.value = route.params.category
    ? route.params.category.charAt(0).toUpperCase() + route.params.category.slice(1)
    : 'All';

  // Form the fetch URL
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
  if (!searchTerm.value) {
    return quizzes.value;
  }
  return quizzes.value.filter(quiz =>
    quiz.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

function goToQuiz(quizId) {
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