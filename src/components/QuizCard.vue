<template>
  <Card class="quiz-card custom-background">
    <h3 class="card-title">{{ quiz.name }}</h3>
    <div class="separator"></div>
    <div class="image-container">
      <img :src="quiz.imageUrl" alt="Quiz Image" class="quiz-image" />
    </div>
  </Card>
</template>

<script>
import Card from '@/components/Card.vue' // Import the Card component

export default {
  props: {
    quiz: {
      type: Object,
      required: true
    }
  },
  components: {
    Card // Register the Card component
  }
}
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
    #f5f5dc,
    #ffffff
  ); /* Beige/almost white gradient */
}
</style>
