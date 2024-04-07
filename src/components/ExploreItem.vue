<template>
  <div class="explore-container primary-padding">
    <h1>Explore</h1>
    <p>Choose your desired subject to start.</p>
    <input type="text" v-model="searchTerm" placeholder="Search subjects..." class="search-input" />
    <div class="grid-layout">
      <CardItem
        v-for="category in filteredCategories"
        class="categoryCard"
        :key="category.id"
        :id="category.id"
        :image="`/categoryimage/${category.name.toLowerCase()}.png`"
        :title="category.name"
        :clickable="true"
        @clicked="() => goToCategory(category.name)"
      />
      <!--Add in description for categories in the future when it's implemented-->
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCategories } from '@/api/quizHooks'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardItem from '../components/CardItem.vue'

const categories = ref<Category[]>([])
const router = useRouter()
const searchTerm = ref('')

interface Category {
  id: string | number
  name: string
}

onMounted(async () => {
  const fetchedCategories = await getCategories()
  if (fetchedCategories) {
    categories.value = fetchedCategories.map((name) => ({ id: name, name }));
    console.log('Categories fetched:', categories.value);
  } else {
    console.error('Could not fetch categories')
  }
})

/**
 * Filter categories in the search term.
 */
const filteredCategories = computed(() => {
  const results = []
  if (!searchTerm.value || searchTerm.value.toLowerCase().startsWith('a')) {
    results.push({ id: 'all', name: 'All' })
  }
  // Filter categories based on the search term.
  results.push(
    ...categories.value.filter((category: Category) =>
      category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  )
  return results
})

/**
 * Routes to the category.
 */
function goToCategory(categoryName: string) {
  if (categoryName === 'all') {
    router.push({ name: 'Category', params: { category: 'all' } })
  } else {
    const lowerCaseCategoryName = categoryName.toLowerCase()
    router.push({
      name: 'Category',
      params: { category: lowerCaseCategoryName }
    })
  }
}
</script>

<style scoped>

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