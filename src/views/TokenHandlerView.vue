<template>
  <div class="background">
    <div class="spinner-container">
      <img src="/spinner.svg" alt="Loading..." />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useApiStore } from '@/stores/apiStore'
import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'
import { oauth2 } from '@/api/axiosConfig'

/**
 * When this component is mounted, it will extract the code parameter from the URL and use it to get an access token,
 * which it in turn uses to get the user's information.
 */
onMounted(() => {
  const apiStore = useApiStore()
  const userStore = useUserStore()
  const route = useRoute()
  const router = useRouter()

  const code = route.query.code
  if (!code) {
    // If there is no code parameter, redirect to home page
    router.push('/')
    return
  }
  const clientId = apiStore.clientId
  const backend = apiStore.getBackendUrl + '/oauth2/token'
  const redirectUri = apiStore.getBaseUrl + '/token'

  oauth2
    .post(
      '/oauth2/token',
      new URLSearchParams({
        //Gets an access token
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        client_id: clientId,
        code_verifier: apiStore.getCodeVerifier
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    .then((response) => {
      userStore.setAccessToken(response.data.access_token)
      oauth2
        .post('/userinfo', null, {
          //Gets the user's information
          headers: {
            Authorization: 'Bearer ' + response.data.access_token
          }
        })
        .then((response) => {
          userStore.setUserName(response.data.sub)
        })
        .catch((error) => {
          console.error(error)
        })
      router.push('/')
    })
    .catch((error) => {
      console.error(error)
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
