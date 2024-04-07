<template>
  <div>
    <button class="additional-button collaborate-button">
      Import questions
      <input type="file" @change="handleFileChange" class="file-input" />
    </button>
    <Popup
      v-if="popupMessage.message"
      :errorMessage="popupMessage.message"
      :fontColor="popupMessage.color"
      @popup-closed="clearPopup"
    />
  </div>
</template>

<script setup lang="ts">
import Popup from '@/components/Popup.vue'
import { defineProps, ref } from 'vue'
import { handleImport } from '@/utils/functions'
import type { PopupMessage } from '@/types/PopupMessage'

const props = defineProps<{
  quizId: number
}>()

const popupMessage = ref<PopupMessage>({ message: '', color: '' })

/**
 * Handle file change event triggered by the file input.
 * @param event - The file change event containing the uploaded file.
 */
const handleFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files![0]
  if (file) {
    const isSuccess = await handleImport(file, props.quizId)
    if (isSuccess) {
      handlePopupMessage('Questions imported successfully!', 'green')
      setTimeout(() => {
        clearPopup()
        window.location.reload()
      }, 1500)
    } else {
      handlePopupMessage(
        'Error importing questions. Press "Help" to see how the file should be formatted',
        'red'
      )
    }
  }
}

/**
 * Set the popup message and its color.
 * @param message - The message to display in the popup.
 * @param color - The color of the popup (e.g., 'green' for success, 'red' for error).
 */
const handlePopupMessage = (message: string, color: string) => {
  popupMessage.value = { message, color }
}

/**
 * Clear the popup message, resetting it to its initial state.
 */
const clearPopup = () => {
  popupMessage.value = { message: '', color: '' }
}
</script>

<style scoped>
.additional-button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: black;
  color: white;
  cursor: pointer;
  margin: 10px 0;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.additional-button:hover {
  background-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.collaborate-button {
  position: relative;
  align-self: flex-end;
  max-width: fit-content;
  font-size: 1rem;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
</style>
