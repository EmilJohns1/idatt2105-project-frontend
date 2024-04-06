<template>
  <div class="login-container">
    <Card class="login-card">
      <h1 id="header">Log in</h1>
      <form @submit.prevent="submitLogin">
        <input type="email" v-model="email" placeholder="Email" required class="input-field" />
        <input
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="input-field"
        />
        <p v-if="loginError" class="error-message">{{ loginError }}</p>
        <!-- Error message -->
        <div class="button-container">
          <button type="submit" class="submit-button">Login</button>
          <div class="additional-buttons">
            <button type="button" @click="goToRegister" class="additional-button">Register</button>
            <button type="button" @click="openForgotPasswordModal" class="additional-button">
              Forgot Password
            </button>
          </div>
        </div>
      </form>
    </Card>
    <forgot-password-modal v-if="showForgotPasswordModal" @close="closeForgotPasswordModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import router from '@/router/index'
import ForgotPasswordModal from '@/components/ForgotPasswordModal.vue'
import Card from '@/components/Card.vue'
import { useLogin } from '@/api/userHooks'
import type { LoginRequest } from '@/types/LoginRequest' // Import LoginRequest type

const email = ref('')
const password = ref('')
const showForgotPasswordModal = ref(false)
const { loginUser, loginError } = useLogin() // Import loginError from useLogin

const submitLogin = async () => {
  const userData: LoginRequest = {
    username: email.value,
    password: password.value
  }
  const loginSuccess = await loginUser(userData)
  if (!loginSuccess) {
    // Set the error message and clear email and password fields
    loginError.value = 'Login failed, please check your credentials.'
    email.value = ''
    password.value = ''
  } else {
    sessionStorage.setItem('isLoggedIn', 'true')
    sessionStorage.setItem('user', userData.username)

    // Wait for router to be ready and then navigate to '/explore'
    await router.isReady()
    await router.push('/explore')

    // After navigation, reload the page
    window.location.reload()
  }
}

const goToRegister = () => {
  router.push('/signup')
}

const openForgotPasswordModal = () => {
  showForgotPasswordModal.value = true
}

const closeForgotPasswordModal = () => {
  showForgotPasswordModal.value = false
}
</script>

<style scoped>
.error-message {
  color: red;
  margin-bottom: 10px;
}

.login-container .login-card {
  /* Specific styling for the Card component within .login-container */
  padding: 40px 60px 60px 60px; /* Add 40px padding to the top and 60px padding to the rest */
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-top: 10%;
}

#header {
  font-size: 3rem;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.button-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 5px;
}

.additional-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  width: 100%;
}

.submit-button,
.additional-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: black;
  color: white;
  cursor: pointer;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.submit-button:hover,
.additional-button:hover {
  background-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.additional-button {
  background-color: black;
}
</style>
