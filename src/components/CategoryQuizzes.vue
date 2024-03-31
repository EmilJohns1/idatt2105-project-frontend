<template>
  <div class="category-quizzes-container">
    <div class="category-header">
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
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axiosConfig';

const route = useRoute();
const quizzes = ref([]);
const categoryName = ref('');

onMounted(async () => {
  const category = route.params.category;
  categoryName.value = category.charAt(0).toUpperCase() + category.slice(1);
  try {
    const response = await api.get(`/api/quizzes/category`, { params: { category } });
    quizzes.value = response.data;
  } catch (error) {
    console.error('Failed to fetch quizzes:', error);
  }
});
</script>