<template>
    <div class="explore-container">
        <h1>Explore</h1>
        <p>Choose your desired subject to start.</p>
        <input type="text" v-model="searchTerm" placeholder="Search subjects..." class="search-input"/>
        <div class="category-grid">
          
          <CardItem
            v-for="category in filteredCategories"
            key="category.id"
            id="category.id"
            :image="`/categoryimage/${category.name.toLowerCase()}.png`"
            :title="category.name"
            :clickable="true"
            @clicked="() => goToCategory(category.name)" 
          />
            <!--Add in description for categories in the future when it's implemented-->
        </div> 
    </div>
</template>

<script setup lang = ts>

import { api } from '@/api/axiosConfig';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardItem from '../components/CardItem.vue';

const categories = ref<Category[]>([]);
const router = useRouter();
const searchTerm = ref('');

interface Category {
  id: string | number; 
  name: string; 
}
onMounted(async () => {
  try {
    const response = await api.get('/quizzes/categories');
    // No need to include 'All' category here, as we will add it in the computed property
    categories.value = response.data;
    console.log('Categories:', categories.value);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
});

const filteredCategories = computed(() => {
  // Always include 'All' category at the beginning
  const categoriesToShow: Category[] = [{ id: 'all', name: 'All' }];

  if (searchTerm.value) {
    // Filter categories without affecting the 'All' category
    const searchResults: Category[] = categories.value.filter((category: Category) =>
      category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
    categoriesToShow.push(...searchResults);
  } else {
    // If no search term, show all categories after 'All'
    categoriesToShow.push(...categories.value);
  }

  return categoriesToShow;
});

function goToCategory(categoryName: string) {
  if (categoryName === 'all') {
    console.log('Navigating to All quizzes');
    router.push({ name: 'Category', params: { category: 'all' } });
  } else {
    const lowerCaseCategoryName = categoryName.toLowerCase();
    console.log('Navigating to ', categoryName);
    router.push({
      name: 'Category', params: { category: lowerCaseCategoryName } 
    });
  }
}
</script>

<style>
.explore-container {
    padding: 40px;  
}

.search-input {
    margin-bottom: 20px;
    width: 100%;
    padding: 10px;
    font-size: 1rem; 
    border: 2px solid #000; 
    border-radius: 4px; 
}

.category-grid {
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
    gap: 40px;
    justify-content: center; 
    align-items: start; 
}
</style>
