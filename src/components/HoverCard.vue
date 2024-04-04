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
    position: absolute;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    background-color: white;
    border-radius: 4px;
    padding: 10px;
    width: 200px;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.hover-card:hover .hover-card-content {
    opacity: 1;
    transform: translateY(-250%) translateX(-50%);
}
</style>