<template>
  <div class="login-container">
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

    <forgot-password-modal v-if="showForgotPasswordModal" @close="closeForgotPasswordModal" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import router from '@/router/index.ts'
import ForgotPasswordModal from '@/components/ForgotPasswordModal.vue'

const email = ref('')
const password = ref('')
const showForgotPasswordModal = ref(false)

const submitLogin = () => {
  console.log(email.value, password.value, 'logged in')
  // Here you can add your login logic
}

const goToRegister = () => {
  router.push('/signup')
}

const goToForgotPassword = () => {
  // Implement navigation to the forgot password page
  console.log('Navigate to Forgot Password')
}

const openForgotPasswordModal = () => {
  showForgotPasswordModal.value = true
}

const closeForgotPasswordModal = () => {
  showForgotPasswordModal.value = false
}
</script>

<style scoped>
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
