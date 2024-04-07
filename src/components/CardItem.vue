<template>
  <div
    :class="[
      'card-item',
      cardType,
      { clickable: clickable, 'quiz-type': type === 'quiz', 'category-type': type === 'category' }
    ]"
    @click="handleClick"
    :title="title"
    >
    <div class="card-item-image">
      <img :src="image" :alt="title" />
    </div>
    <div class="card-item-content">
      <h3 class="card-item-title">{{ title }}</h3>
      <p v-if="description" class="card-item-description">{{ description }}</p>
      <div v-if="type === 'quiz'" class="card-item-footer">
        <span class="author-name">{{ authorName }}</span>
        <HoverCard>
          <template #trigger>
            <span class="tags-icon">🏷️</span>
          </template>
          <template #content>
            <div class="hover-tags-list">
              <ul>
                <p>Tags:</p>
                <li v-for="tag in tags" :key="tag.id" class="tag-item">{{ tag.tagName }}</li>
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
import { defineProps, defineEmits, computed } from 'vue'
import HoverCard from './HoverCard.vue'
import type { Tag } from '@/types/Tag'

// Define the props with the appropriate types
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
}

const props = defineProps<Props>()
const emits = defineEmits(['clicked'])

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return ''

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }

  return date.toLocaleDateString(undefined, options)
}

const latestDate = computed(() => {
  const creationDateObj = props.creationDate ? new Date(props.creationDate) : null
  const lastModifiedDateObj = props.lastModifiedDate ? new Date(props.lastModifiedDate) : null

  if (!creationDateObj && !lastModifiedDateObj) return 'No valid date'
  if (!creationDateObj) return formatDate(props.lastModifiedDate)
  if (!lastModifiedDateObj) return formatDate(props.creationDate)

  const latest = creationDateObj > lastModifiedDateObj ? creationDateObj : lastModifiedDateObj
  return formatDate(latest.toISOString())
})

/**
 * Handle click event.
 */
const handleClick = () => {
  if (props.clickable) {
    emits('clicked', props.id)
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
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-item:hover {
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  cursor: pointer;
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

.card-item-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.card-item-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; 
  overflow: hidden;
  text-overflow: ellipsis;
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

.hover-tags-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.hover-tags-list li {
  align-items: center;
  background-color: #f2f2f2;
  color: #333;
  border-radius: 20px;
  padding: 5px 10px;
  margin: 2px;
  border: 1px solid #ccc;
  font-size: 14px;
}
</style>
