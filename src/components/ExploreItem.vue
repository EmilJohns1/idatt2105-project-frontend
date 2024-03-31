<template>
    <div class="explore-container">
        <h1>Explore</h1>
        <p>Choose your desired subject to start.</p>
        <input type="text" v-model="searchTerm" placeholder="Search subjects..." class="search-input"/>
      
        <div class="category-grid">
          <CardItem
            v-for="category in filteredCategories"
            :key="category.id"
            :id="category.id"
            :image="'/categoryimage/' + category.name.toLowerCase() + '.png'"
            :title="category.name"
            :clickable="true"
            @clicked="goToCategory" 
          />
            <!--Add in description for categories in the future when it's implemented-->
        </div> 
    </div>
</template>

<script setup lang = ts>

import api from '@/api/axiosConfig';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CardItem from '../components/CardItem.vue';

const categories = ref([]);
const router = useRouter();
const searchTerm = ref('');

onMounted(async () => {
  try {
    const response = await api.get('/quizzes/categories');
    categories.value = response.data;
    console.log('Categories:', categories.value)
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

function getImageUrl(categoryName) {
  return '/categoryimage/' + categoryName.toLowerCase() + '.png';
}

function goToCategory(categoryName) {
  console.log('Navigating to the category page of:', categoryName);
  router.push({ name: 'Category', params: { category: categoryName } });
}
</script>

<style>
.explore-container {
    padding: 40px;  
}

.search-input {
    margin-bottom: 20px; /* Add some space below the search box */
    width: 100%; /* Full width of its container */
    padding: 10px; /* Padding inside the search box */
    font-size: 1rem; /* Font size for the text inside the search box */
    border: 2px solid #000; /* Border for the search box */
    border-radius: 4px; /* Slightly rounded corners for the search box */
}

.category-grid {
    margin-top: 50px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); 
    gap: 40px; /* Adjust the space between the grid items */
    justify-content: center; 
    align-items: start; 
}
</style>