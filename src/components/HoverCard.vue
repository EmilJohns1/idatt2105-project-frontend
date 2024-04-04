<template>
    <div class="hover-card" @mouseenter="showContent = true" @mouseleave="showContent = false">
        <slot name="trigger"></slot>
        <div v-if="showContent" class="hover-card-content">
        <slot name="content"></slot>
        </div>
    </div>
</template>
  
<script setup>
import { ref } from 'vue';

const showContent = ref(false);
</script>
  
<style scoped>
.hover-card-content {
    width: 100%;
    z-index: 10;
 }
</style>
  