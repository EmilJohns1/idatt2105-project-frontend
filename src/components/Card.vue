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
  border: 2px solid #818181;
  border-radius: 8px;
  background-image: linear-gradient(to bottom right, #86bfe6, #4ea1f5);
  padding: 20px;
  margin-bottom: 20px;
}
</style>

