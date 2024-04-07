<template>
  <div class="not-found-container">
    <div class="giphy-embed">
      <img src="/404.gif" alt="404" class="gif-img" />
    </div>
    <h1>Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding-bottom: 15%;
}

.gif-img {
  max-width: 100%;
  max-height: 100vh;
}
</style>
