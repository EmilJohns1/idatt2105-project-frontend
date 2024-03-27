<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Card',
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 20px;
}
</style>
