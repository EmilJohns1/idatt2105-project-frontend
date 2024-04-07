<template>
  <div>
    <p>Loading...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useLogin } from '@/api/authenticationHooks'

onMounted(() => {
  useLogin()
})
</script>

<style scoped></style>
