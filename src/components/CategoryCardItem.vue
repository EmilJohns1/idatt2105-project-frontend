<template>
    <div class="category-card" @click="handleClick">
      <div class="category-card-image">
        <img :src="image" alt="Category image">
      </div>
      <div class="category-card-content">
        <h3 class="category-card-title">{{ title }}</h3>
      </div>
    </div>
  </template>
  
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

type Props = {
    id: Number;
    title: String;
    image: String;
}

const props = defineProps<Props>();
const emits = defineEmits(['clicked']);

const handleClick = () => {
    console.log('Category card clicked:', props.id);
    emits('clicked', props.id);
};
</script>
<style>
.category-card {
  width: 100%;
  max-width: 400px; /* Maximum width of the card */
  margin: 0 auto; /* Centering the card if the container is wider */
  border-radius: 8px; /* Rounded corners */
  overflow: hidden; /* Ensures content does not spill outside the border */
  transition: box-shadow 0.3s ease-in-out; /* Smooth transition for shadow */
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  text-align: left; /* Text aligned to the left */
  background: white; /* White background for the card */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Shadow for depth */
}

.category-card:hover {
  transform: translateY(-5px); /* Raises the card on hover */
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* Stronger shadow on hover */
}

.category-card-image {
  width: 100%; /* The container's width */
  height: 200px; /* The container's height, adjust as needed */
  overflow: hidden; /* Hide the overflow to maintain clean edges */
}

.category-card-image img {
  width: 100%; /* Scale the width to fit the container */
  height: auto; /* Scale the height to maintain aspect ratio */
  display: block;
}

.category-card-content {
  padding: 16px; 
}

.category-card-title {
  font-size: 1.5em;  
}

</style>