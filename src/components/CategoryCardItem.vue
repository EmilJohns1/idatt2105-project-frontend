<template>
    <div class="category-card">
        <div class="image-container">
            <img :src="image" :alt="title" class="category-image" />
        </div>
        <h3 class="category-title">{{ title }}</h3>
        <p class="category-description">{{ description }}</p>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
    image: String,
    title: String,
    description: String
});
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
    align-items: center;
}

.category-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.category-image {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.category-title {
    font-size: 1.5em;
    margin: 0.5em;
}

.category-description {
    font-size: 1em;
    margin: 0.5em;
}

.category-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.image-container {
    width: 100%;
    overflow: hidden;
}
</style>