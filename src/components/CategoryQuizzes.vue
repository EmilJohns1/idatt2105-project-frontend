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
      :image="quiz.pictureUrl || '/defualt-quiz-image.png'"
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
const categories = ref([]);

onMounted(async () => {
  try {
    // Fetch categories to get the ID for the category name
    const categoriesResponse = await api.get('/quizzes/categories');
    categories.value = categoriesResponse.data;
    console.log('Categories:', categories.value);

    // Now find the category ID
    const category = categories.value.find(c => c.name.toLowerCase() === route.params.category.toLowerCase());
    if (!category) {
      console.error('Category not found');
      return;
    }
    const category_id = category.id;

    // Fetch quizzes with the category ID
    const quizzesResponse = await api.get('/quizzes/category', { params: { category_id: category_id } });
    quizzes.value = quizzesResponse.data;
  } catch (error) {
    console.error('Failed to fetch categories or quizzes:', error);
  }
});

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