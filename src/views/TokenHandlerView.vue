<template>
  <div class="background">
    <div class="spinner-container">
      <img src="/spinner.svg" alt="Loading..." />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTokens } from '@/api/authenticationHooks'

/**
 * When this component is mounted, it will extract the code parameter from the URL and use it to get an access token,
 * which it in turn uses to get the user's information.
 */
onMounted(() => {
  const route = useRoute()
  const router = useRouter()

  const code = route.query.code
  if (!code) {
    // If there is no code parameter, redirect to home page
    console.error('No code parameter found in URL')
    router.push('/')
    return
  }
  
  getTokens(code)
    .then(() => router.push('/'))
    .catch(() => {
      console.error('Failed to get tokens, returning to main menu')
      router.push('/')
    })
})
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
