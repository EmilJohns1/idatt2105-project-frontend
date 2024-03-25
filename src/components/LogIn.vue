<template>
    <div class="login-container">
      <h1>Log in</h1>
      <form @submit.prevent="submitLogin">
        <input type="email" v-model="email" placeholder="Email" required class="input-field">
        <input type="password" v-model="password" placeholder="Password" required class="input-field">
        <button type="submit" class="submit-button">Login</button>
      </form>
    </div>
  </template>
  
<script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  
  const submitLogin = () => {
    console.log(email.value, password.value, 'logged in');
  };
</script>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
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
    border-radius: 4px;
    background-color: black;
    color: white;
    margin-bottom: 10px;
    cursor: pointer;
}
</style>