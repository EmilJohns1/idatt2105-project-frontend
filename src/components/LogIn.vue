<template>
    <div class="log-in-container">
        <h1>Log in</h1>
        <h2>Enter your email and password to log in to this app</h2>

    </div>
</template>

<template>
    <div class="login-container">
      <h1>Log in</h1>
      <form @submit.prevent="submitLogin">
        <input type="email" v-model="email" placeholder="Email" required>
        <input type="password" v-model="password" placeholder="Password" required>
        <button type="submit">Login</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const email = ref('');
  const password = ref('');
  
  const submitLogin = () => {
    // Handle the login submission here
    console.log(email.value, password.value, 'logged in');
  };
  </script>