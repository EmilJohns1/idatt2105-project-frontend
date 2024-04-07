<template>
  <div v-if="isVisible" class="popup-overlay" @click="hidePopup">
    <div class="popup-content">
      <p class="message" :style="{ color: fontColor }">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ComponentPopup',
  props: {
    errorMessage: String,
    fontColor: String
  },
  data() {
    return {
      isVisible: true
    }
  },
  methods: {
    hidePopup() {
      this.isVisible = false
      this.$emit('popup-closed')
    }
  }
}
</script>

<style scoped>
.popup-overlay {
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

.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid black;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.message {
  font-size: 2rem;
  font-weight: 500;
  font-family: inherit;
}
</style>
