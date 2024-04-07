<template>
  <div class="no-access-container">
    <div class="gif-embed">
      <img src="/no-entry.gif" alt="You do not have access to this page" class="gif-img" />
    </div>
    <h1>You do not have access to this page</h1>
    <p>Sorry, you do not have access to enter this page</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.no-access-container {
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
