<template>
    <button :type="type" class="button" @click="$emit('click')">
        <slot></slot>
    </button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'button'
    }
})
</script>

<style>
.button {
    width: 100%;
    cursor: pointer;
}
</style>