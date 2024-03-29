<template>
  <Card class="quiz-card custom-background">
    <h3 class="card-title">{{ quiz.title }}</h3>
    <div class="separator"></div>
    <div class="image-container">
      <img :src="quiz.quizPictureUrl" alt="Quiz Image" class="quiz-image" />
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { defineProps } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  quiz: {
    type: Object,
    required: true
  }
})

</script>

<style scoped>
.card {
  border: 1px solid #333; /* Darker border */
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  max-width: fit-content;
}

.card-title {
  font-size: 18px;
  margin-bottom: 10px;
  font-family: 'Luckiest Guy', cursive;
}

.separator {
  height: 1px;
  background-color: #333; /* Darker separator */
  margin-bottom: 10px;
}

.image-container {
  display: flex;
  justify-content: center;
}

.quiz-image {
  max-width: 200px; /* Maximum width for the image */
  width: 100%; /* Ensure the image fills its container */
  height: auto; /* Maintain aspect ratio */
  border-radius: 8px;
  border: 1px solid #333;
}

.custom-background {
  background-image: linear-gradient(
    to bottom right,
    #ffffff,
    #fafafa
  ); /* Beige/almost white gradient */
}
</style>
