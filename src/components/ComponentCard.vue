<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ComponentCard'
}
</script>

<style scoped>
.card {
  border: 2px solid #818181;
  border-radius: 8px;
  background-image: linear-gradient(to bottom right, #ffffff, #ffffff);
  padding: 20px;
  margin-bottom: 20px;
}
</style>
