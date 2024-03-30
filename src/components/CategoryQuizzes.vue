<template>
  <div class="category-quizzes-container">
    <div class="Header">
      <h1>{{ categoryName }}</h1>
      <p>Try out all of our quizzes</p>
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