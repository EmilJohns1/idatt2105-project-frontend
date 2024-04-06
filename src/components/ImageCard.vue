<template>
  <Card class="quiz-card custom-background">
    <h3 class="card-title">{{ isQuiz ? item.title : item.questionText }}</h3>
    <div class="separator"></div>
    <div class="image-container">
      <img :src="getImageUrl" alt="Image" class="item-image" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { defineProps, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

// Determine if the item is a quiz or a question
const isQuiz = computed(() => {
  return 'title' in props.item && 'quizPictureUrl' in props.item
})

const getImageUrl = computed(() => {
  if (isQuiz.value) {
    return props.item.quizPictureUrl || '/icons/default_quiz/question.png'
  } else {
    return props.item.mediaUrl || '/icons/default_quiz/question.png'
  }
})
</script>

<style scoped>
.card {
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  max-width: fit-content;
}

.card:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.card-title {
  font-size: 18px;
  margin-bottom: 10px;
  font-family: 'Luckiest Guy', cursive;
}

.separator {
  height: 1px;
  background-color: #333;
  margin-bottom: 10px;
}

.image-container {
  display: flex;
  justify-content: center;
}

.item-image {
  max-width: 200px;
  width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid #333;
}

.custom-background {
  background-image: linear-gradient(to bottom right, #ffffff, #ffffff);
}

@media (max-width: 750px) {
  .card-title{
    white-space: nowrap  ;      /* Prevents text wrapping */
    overflow: hidden;          /* Hides the overflowing content */
    text-overflow: ellipsis;
  }
  .item-image{
    max-width: 130px;
    max-height: 100px ;
  }
}
</style>
