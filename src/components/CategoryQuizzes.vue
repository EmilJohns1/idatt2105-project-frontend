<template>
  <div class="subject-container">
    <h1>{{ categoryTitle }} Quizzes</h1>
    <div class="quiz-grid">

      <!-- Loop through quizzes and display them here -->
      <div class="quiz-card">
        <h2>Quiz Title</h2>
        <p>Quiz Description</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/api/axiosConfig';

const quizzes = ref([]);
const route = useRoute();

onMounted(async () => {
  const categoryId = route.params.category;
  try {
    const response = await api.get(`/quizzes/byCategory/${categoryId}`);
    quizzes.value = response.data;
  } catch (error) {
    console.error('Failed to fetch quizzes:', error);
  }
});
</script>