<template>
    <div class="sign-container">
        <h1>Create an account</h1>
        <h2>Sign up with a email and password for this app</h2>
        <form @submit.prevent="submitForm">
            <input type="email" v-model="email" placeholder="Email" required class="input-field">
            <input type="password" v-model="password" placeholder="Password" required class="input-field">
            <button type="submit" class="submit-button">Sign up with email</button>
        </form>
        <p>By clicking continue, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const submitForm = () => {
  // Handle form submission/registration here
  console.log(email.value, password.value, 'registered');
};
</script>

<style scoped>
.input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
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