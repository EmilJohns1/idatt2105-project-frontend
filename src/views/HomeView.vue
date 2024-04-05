<template>
  <div class="container">
    <div class="discover">
      <h1>Discover</h1>
      <div class="category-cards" ref="cardsContainer">
        <TransitionGroup name="list">
          <CardItem
            class="category-card"
            v-for="category in categories"
            :key="category.id"
            :id="category.id"
            :image="`/categoryimage/${category.name.toLowerCase()}.png`"
            :title="category.name"
            :clickable="true"
            @clicked="() => goToCategory(category.name)"
          />
        </TransitionGroup>
      </div>
      <div class="arrows">
        <div class="arrow left-arrow" @click="scrollLeft()"></div>
        <div class="arrow right-arrow" @click="scrollRight()"></div>
      </div>
    </div>
    <div class="login">
      <h1>Or Create?</h1>
      <div class="buttons">
        <RouterLink to="/signup" class="signup-button purpleButton button">Sign up</RouterLink>
        <RouterLink to="/login" class="blackButton button">Log in</RouterLink>
      </div>
    </div>
    <div class="aligner"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CardItem from '@/components/CardItem.vue'
import { api } from '@/api/axiosConfig'
import type { Category } from '@/types/Category'

const router = useRouter()

const categories = ref<Category[]>([])
const cardsContainer = ref()

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

onMounted(async () => {
  try {
    const response = await api.get('/quizzes/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
})

function scrollLeft() {
  cardsContainer.value.scrollBy({
    left: -300,
    behavior: 'smooth'
  })
}

function scrollRight() {
  cardsContainer.value.scrollBy({
    left: 300,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.discover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.category-card {
  scroll-snap-align: center;
  min-width: 400px;
  margin: 0 15px;
}

.category-card:hover {
  cursor: pointer;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

.arrows {
  display: flex;
  flex-direction: row;
}

.arrow {
  width: 50px;
  height: 50px;
  border: 25px solid;
  border-color: rgba(0, 0, 0, 0.1) transparent transparent rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
}

.arrow:hover {
  cursor: pointer;
}

.arrow:active {
  border-color: rgba(0, 0, 0, 0.5) transparent transparent rgba(0, 0, 0, 0.5);
}

.left-arrow {
  transform: rotate(-45deg);
}

.right-arrow {
  transform: rotate(135deg);
}

.category-cards {
  display: flex;
  flex-direction: row;
  align-items: center;
  overscroll-behavior: contain;
  overflow: auto;
  width: 100vw;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  -webkit-mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 10%,
    rgba(0, 0, 0, 1) 90%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-image: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 10%,
    rgba(0, 0, 0, 1) 90%,
    rgba(0, 0, 0, 0) 100%
  );
}
.category-cards::-webkit-scrollbar {
  display: none; /* For Chrome, Safari, and Opera */
}

.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
  width: 100%;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
}

.button {
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: 40%;
  border-radius: 20px;
  margin: 5px;
  height: 40px;
}

.signup-button {
  width: 90%;
  font-size: 2.5em;
  height: 65px;
}

@media (max-width: 750px) {
  .buttons {
    width: 80%;
  }

  #logo {
    display: none;
  }
  .button {
    font-size: 1.5em;
    display: flex;
    margin: 10px;
  }
}
</style>
