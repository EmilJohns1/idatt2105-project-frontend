<template>
    <div class="category-card">
        <router-link :to="'/explore/${title.toLowerCase()}'" class="category-card-link">
            <div class="image-container">
                <img :src="image" :alt="title" class="category-image" />
            </div>
            <h3 class="category-title">{{ title }}</h3>
            <p class="category-description">{{ description }}</p>
        </router-link>
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