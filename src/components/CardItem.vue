<template>
  <div
    :class="[
      'card-item',
      cardType,
      { clickable: clickable, 'quiz-type': type === 'quiz', 'category-type': type === 'category' }
    ]"
    @click="handleClick"
  >
    <div class="card-item-image">
      <img :src="image" :alt="title" />
    </div>
    <div class="card-item-content">
      <h3 class="card-item-title">{{ title }}</h3>
      <p v-if="description">{{ description }}</p>
      <div v-if="type === 'quiz'" class="card-item-footer">
        <span class="author-name">{{ authorName }}</span>
        <HoverCard>
          <template #trigger>
            <span class="tags-icon">🏷️</span>
          </template>
          <template #content>
            <div class="tags-list">
              <ul>
                <p>Tags:</p>
                <li v-for="tag in tags" :key="tag.id">{{ tag.tagName }}</li>
              </ul>
              <p>{{ latestDate }}</p>
            </div>
          </template>
        </HoverCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue'
import HoverCard from './HoverCard.vue'
import type { Tag } from '@/types/Tag'

type Props = {
  id: string | number
  title: string
  image: string
  description?: string
  creationDate?: string
  clickable: boolean
  cardType?: string
  authorName?: string
  tags?: Tag[]
  lastModifiedDate?: string
  type?: 'quiz' | 'category'
};

const hover = ref(false);
const props = defineProps<Props>();
const emits = defineEmits(['clicked']);
const latestDate = computed(() => {
  return props.creationDate && (!props.lastModifiedDate || new Date(props.creationDate) > new Date(props.lastModifiedDate))
    ? props.creationDate
    : props.lastModifiedDate;
});


const handleClick = () => {
  if (props.clickable) {
    emits('clicked', props.title)
  }
}
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

.card-item:hover {
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

.card-item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.tags-icon {
  cursor: cursor;
  font-size: 1.75em; 
}
.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.author-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tags-icon {
  margin-left: auto;
}

.tags-list {
  display: block;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  z-index: 10;
  width: max-content;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
