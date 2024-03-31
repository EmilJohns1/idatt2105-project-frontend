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
      :title="quiz.name"
      :description="quiz.description"
      :clickable="true"
      @clicked="goToQuiz(quiz.id)"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axiosConfig';
import CardItem from './CardItem.vue';

const route = useRoute();
const quizzes = ref([]);
const searchTerm = ref('');
const categoryName = ref(route.params.category);

onMounted(async () => {
  categoryName.value = categoryName.value.charAt(0).toUpperCase() + categoryName.value.slice(1);
  try {
    const response = await api.get('/quizzes/category', { categoryName: categoryName.value.toLowerCase() });
    quizzes.value = response.data;
  } catch (error) {
    console.error('Failed to fetch quizzes:', error);
  }
});

const getAllQuizzes = async () => {
  try {
    const response = await api.get('/quizzes');
    quizzes.value = response.data;
  } catch (error) {
    console.error('Failed to fetch all quizzes:', error);
  }
};

function goToQuiz(quizId) {
  router.push({ name: 'Quiz', params: { id: quizId } });
}
</script>

<style scoped>
.quizzes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
</style>