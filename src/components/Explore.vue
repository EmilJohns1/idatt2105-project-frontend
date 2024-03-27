<template>
    <div class="explore-container">
        <h1>Explore</h1>
        <input type="text" v-model="searchTerm" placeholder="Search subjects..." class="search-input"/>
        <p>Choose your desired subject to start.</p>
        <div class="category-grid">
            <CategoryCard
                v-for="category in filteredCategories"
                :key="category.title"
                :image="category.image"
                :title="category.title"
                :description="category.description"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CategoryCard from '../components/CategoryCardItem.vue';

const categories = ref([
    { image: "/categoryimage/all.png", title: "All", description: "This contains all quizzes" },
    { image: "/categoryimage/biology.png", title: "Biology", description: "This contains all Biology quizzes" },
    { image: "/categoryimage/chemistry.png", title: "Chemistry", description: "This contains all chemistry quizzes"},
    { image: "/categoryimage/english.png", title: "English", description: "This contains all English quizzes."},
    { image: "/categoryimage/maths.png", title: "Maths", description: "This contains all Maths quizzes."},
    { image: "/categoryimage/physics.png", title: "Physics", description: "This contains all Physics quizzes."}
    
]);

const searchTerm = ref('');

const filteredCategories = computed(() => {
  if (searchTerm.value) {
    return categories.value.filter(category => 
      category.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    );
  } else {
    return categories.value;
  }
});
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