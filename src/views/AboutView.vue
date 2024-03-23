<template>
  <div class="sign-up-container">
    <h1>Create an account</h1>
    <h2>Enter your email and password to sign up for this website</h2>
    <form @submit.prevent="handleSubmit">
      <TextInputComonent>
      </TextInputComonent>
    </form>
  </div>
</template>

<script setup>

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
