<template>
  <div class="modal">
    <div class="modal-content">
      <h2 id="header">Forgot Password</h2>
      <form @submit.prevent="submit">
        <input
          type="email"
          v-model="email"
          @input="clearErrorMessage"
          placeholder="Enter your email"
          required
          class="input-field"
        />
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="button-container">
          <button type="submit" class="submit-button">Submit</button>
          <button type="button" @click="emit('close')" class="close-button">Close</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const email = ref('')
const errorMessage = ref('')
const submissionSuccess = ref(false)

const submit = async () => {
  try {
    // Simulate successful submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    alert('An email has been sent to your email address. Please check your inbox.')
    submissionSuccess.value = true
  } catch (error) {
    console.error(error)
    errorMessage.value = 'An error occurred. Please try again later.'
  }
}

const clearErrorMessage = () => {
  errorMessage.value = ''
}

watch(submissionSuccess, (newValue) => {
  if (newValue) {
    emit('close')
  }
})
</script>

<style scoped>
#header {
  text-align: center;
  margin-bottom: 15px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 20vw;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.submit-button,
.close-button {
  flex: 1;
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
.close-button:hover {
  background-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
</style>
