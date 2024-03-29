<template>
  <div class="subject-container">
    <h1>{{ subjectTitle }} Quizzes</h1>
    <div class="quiz-grid">

      <!-- Loop through quizzes and display them here -->
      <div class="quiz-card">
        <h2>Quiz Title</h2>
        <p>Quiz Description</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const subjectTitle = computed(() => route.params.subject);

// Create function to fetch quizzes and build those objects here
</script>