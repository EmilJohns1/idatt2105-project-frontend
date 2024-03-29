<template>
    <div class="category-card" @click="handleClick">
        <div class="category-card-image" :style="backgroundImageStyle"></div>
        <h3 class="category-card-title">{{ title }}</h3>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    image: String,
    title: String,
    description: String
});


const handleClick = () => {
  emits('select', props.title);
};

const backgroundImageStyle = computed(() => ({
    backgroundImage: `url(${props.image})`
}));
</script>

<style>
.category-card {
    width: 100%;
    max-width: 400px;
    margin: 0;
    border-radius: 1px;
    overflow: hidden;
    transition: box-shadow 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    text-align: left;
    background: white; 
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

.category-card:hover {
    transform: translateY(-5px); 
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.category-image {
    background-size: cover;
    background-position: center;
    width: 100%;
    height: auto;
    object-fit: cover;
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.category-title {
    font-size: 1.5em;    
}

.category-description {
    font-size: 1em;
}

.image-container {
    width: 100%;
    overflow: hidden;
}
.category-card-link {
    display: block;
    text-decoration: none;
}
</style>