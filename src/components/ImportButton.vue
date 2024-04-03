<template>
  <div>
    <button class="additional-button collaborate-button">
      Import questions
      <input type="file" @change="handleImport($event, quizId)" class="file-input" />
    </button>
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
import {
  addQuestionToQuiz,
  addAlternativeToQuestion,
  updateTrueOrFalseQuestion,
  updateQuestionAlternatives
} from '@/api/questionHooks'

const props = defineProps<{
  quizId: number
}>()

const popupErrorMessage = ref('')
const popupFontColor = ref('')

async function handleImport(event: Event, quizId: number) {
  const file = (event.target as HTMLInputElement).files![0]
  const reader = new FileReader()

  reader.onload = async (event) => {
    const text = event.target?.result as string
    const questions = parseFile(text)

    for (const question of questions) {
      if (question.type === 'true or false') {
        question.type = 'true_or_false'
      } else if (question.type === 'multiple choice') {
        question.type = 'multiple_choice'
      }
      const questionData = {
        questionText: question.title,
        points: question.maxPoints,
        type: question.type,
        quizId: quizId,
        mediaUrl: ''
      }

      try {
        const newQuestion = await addQuestionToQuiz(questionData)
        if (question.type === 'true_or_false') {
          await updateTrueOrFalseQuestion(newQuestion.id, question.answer || false)
        } else if (question.type === 'multiple_choice') {
          for (const alternative of question.alternatives ?? []) {
            await addAlternativeToQuestion({
              questionId: newQuestion.id,
              alternativeText: alternative.text,
              correct: alternative.isCorrect
            })
          }
        }
      } catch (error) {
        await setPopupMessage(
          `Error adding questions. \n Press 'Help' to see how the format should look like`,
          'red'
        )
        setTimeout(async () => {
          window.location.reload()
          return
        }, 2000)
      }
    }
    await setPopupMessage('Questions imported!', 'green')
    setTimeout(async () => {
      window.location.reload()
    }, 2000)
  }

  reader.readAsText(file)
}

function setPopupMessage(message: string, color: string) {
  popupErrorMessage.value = message
  popupFontColor.value = color
}

function clearPopup() {
  popupErrorMessage.value = ''
  popupFontColor.value = ''
}

interface Question {
  title: string
  maxPoints: number
  type: string
  answer?: boolean
  alternatives?: Alternative[]
}

interface Alternative {
  text: string
  isCorrect: boolean
}

function parseFile(text: string): Question[] {
  try {
    const lines = text.split('\n')
    const questions: Question[] = []
    let currentQuestion: Question | null = null

    for (const line of lines) {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('Question title: ')) {
        if (currentQuestion) {
          questions.push(currentQuestion)
        }
        currentQuestion = {
          title: trimmedLine.substring('Question title: '.length).trim(),
          maxPoints: 0,
          type: ''
        }
      } else if (currentQuestion) {
        if (trimmedLine.startsWith('Max points: ')) {
          currentQuestion.maxPoints = parseInt(
            trimmedLine.substring('Max points: '.length).trim(),
            10
          )
        } else if (trimmedLine.startsWith('Question type: ')) {
          currentQuestion.type = trimmedLine.substring('Question type: '.length).trim()
        } else if (trimmedLine.startsWith('Answer: ')) {
          if (currentQuestion.type === 'true or false') {
            currentQuestion.answer = trimmedLine.substring('Answer: '.length).trim() === 'true'
          }
        } else if (trimmedLine.startsWith('Alternatives:')) {
          currentQuestion.alternatives = []
        } else if (currentQuestion.type === 'multiple choice' && trimmedLine.startsWith('-')) {
          const isCorrect = trimmedLine.includes('(correct)')
          const text = trimmedLine.replace(/-/, '').replace('(correct)', '').trim()
          if (!currentQuestion.alternatives) {
            currentQuestion.alternatives = []
          }
          currentQuestion.alternatives.push({ text, isCorrect })
        }
      }
    }

    if (currentQuestion) {
      questions.push(currentQuestion)
    }

    return questions
  } catch (error) {
    throw new Error('Error parsing file. Please ensure the file is in the correct format.')
  }
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
