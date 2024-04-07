<template>
  <div class="sign-container">
    <Card class="sign-card">
      <h1 id="header-1">Create an account</h1>
      <h2 id="header-2">Sign up with an email and password for this app</h2>
      <form @submit.prevent="submitForm">
        <input
          @click="clearErrorMessage"
          type="email"
          v-model="email"
          placeholder="Email"
          required
          class="input-field"
        />
        <input
          @click="clearErrorMessage"
          type="password"
          v-model="password"
          placeholder="Password"
          required
          class="input-field"
        />
        <button type="submit" class="submit-button">Sign up with email</button>
      </form>
      <p id="registration-error" v-if="registrationError">{{ registrationError }}</p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRegistration } from '@/api/userHooks'
import type { LoginRequest } from '@/types/LoginRequest'
import router from '@/router/index'
import Card from '@/components/Card.vue'

const email = ref('')
const password = ref('')
const { registerUser, clearError } = useRegistration()
const registrationError = ref('')

/**
 * Submit Form and gives appropriate feedback.
 */
const submitForm = async () => {
  clearError()
  const userData: LoginRequest = {
    username: email.value,
    password: password.value
  }
  const response = await registerUser(userData)
  if (response === null) {
    registrationError.value = 'Connection to server failed, please try again.'
    email.value = ''
    password.value = ''
  } else if (response.status === 200) {
    redirect()
  } else if (response.status === 409) {
    registrationError.value = 'Registration failed, a user with this email already exists.'
    email.value = ''
    password.value = ''
  } else {
    registrationError.value = 'Registration failed, please try again.'
    email.value = ''
    password.value = ''
  }
}

/**
 * Redirect to login page.
 */
const redirect = () => {
  router.push('/login')
  setTimeout(() => {
    window.alert('User created!')
    // Wait for a tick to allow the redirect to complete
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, 250)
}

const clearErrorMessage = () => {
  registrationError.value = ''
}
</script>

<style scoped>
#header-1 {
  font-size: 2.5rem;
}

#header-2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

#registration-error {
  color: red;
}

.sign-card {
  padding: 40px 60px 60px 60px;
}

.sign-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 10%;
}
.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
}
.submit-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background-color: black;
  color: white;
  margin-bottom: 10px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>
