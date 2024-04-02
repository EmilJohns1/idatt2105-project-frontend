<template>
  <div :class="['card-item', cardType, { 'clickable': clickable }]" @click="handleClick">
        <div class="card-item-image">
            <img :src="image" :alt="title">
        </div>
        <div class="card-item-content">
            <h3 class="card-item-title">{{ title }}</h3>
            <p v-if="description">{{ description }}</p>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

type Props = {
  id: string | number,
  title: string,
  image: string,
  description?: string,
  creationDate?: string,
  clickable: boolean,
  cardType?: string
};

const props = defineProps<Props>();
const emits = defineEmits(['clicked']);

const handleClick = () => {
  if (props.clickable) {
    emits('clicked', props.title);
  }
};
</script>

<style>
.card-item {
  width: 100%;
  max-width: 400px; 
  margin: 0 auto; 
  border-radius: 8px; 
  overflow: hidden; 
  transition: box-shadow 0.3s ease-in-out;
  display: flex;
  flex-direction: column; 
  text-align: left; 
  background: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); 
}

.card-item:hover   {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); 
}

.card-item-image {
  width: 100%; 
  height: 200px; 
  overflow: hidden; 
}

.card-item-image img {
  width: 100%; 
  height: auto; 
  display: block;
}

.card-item-content {
  padding: 16px; 
}

.card-item-title {
  font-size: 1.5em;  
}


</style>