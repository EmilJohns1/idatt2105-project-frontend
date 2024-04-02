<template>
  <Card class="forgot-password-card">
    <div class="password-reset-page">
      <h2 id="header">Password Reset</h2>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="form-group">
          <label for="password">New Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      <Popup
        :errorMessage="popupMessage"
        :fontColor="popupFontColor"
        v-if="popupMessage"
        @popup-closed="popupMessage = ''"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import Popup from '@/components/Popup.vue'
import router from '@/router/index'
import { ref } from 'vue'
import { findTokenByEmail, resetPassword, deleteByEmail } from '@/api/resetPasswordHooks'
import type { LoginRequest } from '@/types/LoginRequest'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const popupMessage = ref('')
const popupFontColor = ref('')

const submit = async () => {
  if (password.value !== confirmPassword.value) {
    popupMessage.value = 'Passwords do not match.'
    popupFontColor.value = 'red'
    return
  }

  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token') // Access token from query string

  try {
    const tokenInfo = await findTokenByEmail(email.value)

    if (!tokenInfo || tokenInfo.token !== token) {
      popupMessage.value = 'Invalid email or token.'
      popupFontColor.value = 'red'
      return
    }

    // Check if the token has expired
    const expirationDateTime = new Date(tokenInfo.expirationDateTime)
    if (expirationDateTime <= new Date()) {
      popupMessage.value = 'The token has expired.'
      popupFontColor.value = 'red'
      return
    }

    // Call the resetPassword API method to reset the password
    const resetRequest: LoginRequest = { username: email.value, password: password.value }
    await resetPassword(resetRequest)
    popupMessage.value = 'Password reset successfully.'
    popupFontColor.value = 'green'
    deleteByEmail(email.value)
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    console.error('Error resetting password:', error)
    popupMessage.value = 'Failed to reset password. Please try again.'
    popupFontColor.value = 'red'
  }
}
</script>

<style scoped>
#header {
  font-size: 2rem;
  margin-bottom: 20px;
}

.forgot-password-card {
  width: fit-content;
  margin: 10vh auto;
  padding: 60px;
}

.password-reset-page {
  max-width: 400px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
}

input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
