<template>
  <div>
    <button class="additional-button" @click="exportQuestions">Export questions</button>
    <Popup
      v-if="popupErrorMessage"
      :errorMessage="popupErrorMessage"
      :fontColor="popupFontColor"
      @popup-closed="clearPopup"
    />
  </div>
</template>

<script setup lang="ts">
import Popup from '@/components/Popup.vue'
import { defineProps, ref } from 'vue'
import { getAllQuestionsByQuizId } from '@/api/questionHooks'

const props = defineProps<{
  quizId: number
}>()

const popupErrorMessage = ref('')
const popupFontColor = ref('')

async function exportQuestions() {
  try {
    const questions = await getAllQuestionsByQuizId(props.quizId)
    let content = ''

    for (const question of questions) {
      content += `Question title: ${question.questionText}\n`
      content += `Max points: ${question.points}\n`

      if (question.alternatives) {
        content += `Question type: multiple choice\n`
        content += `Alternatives:\n`
        for (const alternative of question.alternatives) {
          content += `-${alternative.alternativeText}`
          if (alternative.correct) {
            content += ' (correct)'
          }
          content += '\n'
        }
      } else {
        content += `Question type: true or false\n`
        content += `Answer: ${question.correctAnswer}\n`
      }

      content += '\n'
    }

    // Create a Blob with the content
    const blob = new Blob([content], { type: 'text/plain' })

    // Create a link element
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'quiz_questions.txt'

    link.click()

    setPopupMessage('Questions exported successfully.', 'green')
  } catch (error) {
    setPopupMessage('Failed to export questions.', 'red')
  }
}

function setPopupMessage(message: string, color: string) {
  popupErrorMessage.value = message
  popupFontColor.value = color
}

function clearPopup() {
  popupErrorMessage.value = ''
  popupFontColor.value = ''
}
</script>

<style scoped>
.additional-button {
  font-size: 1rem;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: black;
  color: white;
  cursor: pointer;
  margin-top: 10px;
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
}
</style>
