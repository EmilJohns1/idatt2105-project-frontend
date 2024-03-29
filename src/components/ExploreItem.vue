<template>
    <div class="explore-container">
        <h1>Explore</h1>
        <input type="text" v-model="searchTerm" placeholder="Search subjects..." class="search-input"/>
        <p>Choose your desired subject to start.</p>
        <div class="category-grid">
          <CategoryCard
              v-for="category in filteredCategories"
              :key="category.id"
              :image="category.picture_url"
              :title="category.name"
              @select="goToCategory"
            />
            <!--Add in description for categories in the future when it's implemented-->
        </div> 
    </div>
</template>

<script setup lang = ts>
import api from '../api';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CategoryCard from '../components/CategoryCardItem.vue';

const categories = ref([]);
const router = useRouter();
const searchTerm = ref('');

onMounted(async () => {
  try {
    const response = await api.get('/quizzes/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
});

const filteredCategories = computed(() => {
  if (searchTerm.value) {
    return categories.value.filter(category => 
      category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  } else {
    return categories.value;
  }
});

function goToCategory(subject) {
  router.push(`/explore/${subject.toLowerCase()}`);
}
</script>

<style>
.explore-container {
    padding: 40px; 
    margin-top: 60px;
    margin-bottom: 60px; 
}

.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
    gap: 40px; 
    justify-content: center; 
    align-items: start; 
}

</style>