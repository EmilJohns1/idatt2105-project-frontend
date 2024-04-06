<template>
  <div class="content">
    <button class="returnButton" @click="returnToQuiz">Return to quiz</button>
    <h2 class="header1">{{ editMode ? 'Edit Question' : 'Add Question' }}</h2>
    <h2 class="mainHeader">Question Text</h2>
    <label class="overlay" for="toggle-menu"></label>
    <input type="text" class="choiceInput" v-model="question" /><br />

    <h2 class="header">Image or Video</h2>
    <img :src="imageUrl || placeholderImage" id="image" /><br />
    <input accept="image/*" type="file" @change="onFileChange" /><br />

    <div class="max-points-slider">
      <label for="maxPoints">Max Points</label>
      <input type="range" id="maxPoints" min="1" max="5" v-model="maxPoints" />
      <span>{{ maxPoints }}</span>
    </div>

    <div class="qType header">
      Question type
      <select
        name="QuestionType"
        id="QuestionType"
        v-model="selectedQuestionType"
        @change="handleQuestionTypeChange"
      >
        <option value="mc">Multiple Choice</option>
        <option value="tof">True or False</option>
      </select>
    </div>

    <div class="choice" v-if="selectedQuestionType === 'mc'">
      <div v-for="(alternativeObj, index) in alternatives" :key="index">
        Alt {{ index + 1 }}:
        <input type="text" class="choiceInput" v-model="alternativeObj.text" />
        <label class="container">
          <input type="checkbox" v-model="alternativeObj.checked" />
          <span class="checkmark"></span> </label
        ><br />
      </div>
      <button class="addRemoveButton" @click="addAlternative" v-show="alternatives.length < 4">
        Add Alternative
      </button>
      <button class="addRemoveButton" @click="removeAlternative" v-show="alternatives.length > 2">
        Remove Alternative</button
      ><br />
    </div>

    <div class="choice" id="tof" v-if="selectedQuestionType === 'tof'">
      Answer:<br />
      True&nbsp;<label class="container"
        ><input type="radio" name="tof" value="true" v-model="selectedTofOption" /><span
          class="checkmark"
        ></span></label
      ><br />
      False
      <label class="container"
        ><input type="radio" name="tof" value="false" v-model="selectedTofOption" /><span
          class="checkmark"
        ></span></label
      ><br />
    </div>

    <button class="submitButton" @click="editMode ? saveChanges() : addToQuiz()">
      {{ editMode ? 'Confirm' : 'Add Question to quiz' }}
    </button>
    <Popup
      v-if="popupVisible"
      :error-message="popupMessage"
      :font-color="popupFontColor"
      @popup-closed="popupVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  addQuestionToQuiz,
  addAlternativeToQuestion,
  updateTrueOrFalseQuestion,
  getQuestionByQuestionId,
  updateQuestionById,
  updateQuestionAlternatives,
  deleteAlternativeByAlternativeId,
  deleteQuestionByQuestionId
} from '@/api/questionHooks'
import { uploadFile, deletePicture } from '@/api/imageHooks'
import Popup from '@/components/Popup.vue'

interface Alternative {
  text: string
  checked: boolean
  id?: number
}

const router = useRouter()

const editMode = ref(false)
const question = ref('')
const imageUrl = ref<string | null>(null)
const placeholderImage = '/icons/default_quiz/question.png'
const selectedQuestionType = ref('')
const maxPoints = ref('1')
const selectedTofOption = ref()
const alternatives = ref<Alternative[]>([
  { text: '', checked: false },
  { text: '', checked: false }
])
const originalQuestionType = ref('')
const file = ref<File | null>(null)
const questionData = ref<any>(null)
const originalPictureUrl = ref('')

const previewImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  }
}

const onFileChange = (event: Event) => {
  validateImageSize(event)
  previewImage(event)
}

const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}

const validateImageSize = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]

  if (selectedFile) {
    const fileSize = selectedFile.size / 1024 // Convert to KB
    const maxSizeKB = 1024 * 3 // Max size in KB (3 MB)

    if (!validateImageFile(selectedFile)) {
      // Show an alert if file type is not valid
      window.alert('Invalid file type. Please select a PNG, JPG, or JPEG file.')
      // Reset the file input to clear the selected file
      target.value = ''
    } else if (fileSize > maxSizeKB) {
      // Show an alert if file size exceeds the maximum limit
      window.alert('File size exceeds the maximum limit. Maximum 3 MB allowed.')
      // Reset the file input to clear the selected file
      target.value = ''
    } else {
      // Update the file variable with the selected file
      file.value = selectedFile
    }
  }
}

const uploadPicture = async (): Promise<void> => {
  if (file.value) {
    try {
      console.log(originalPictureUrl.value)
      //Delete the current profile picture from the storage
      if (originalPictureUrl.value) {
        console.log('Deleting current picture:', originalPictureUrl.value)
        const deleteSuccess = await deletePicture(originalPictureUrl.value)

        if (!deleteSuccess) {
          console.error('Failed to delete current profile picture.')
          return
        }
      }

      // Upload the new profile picture
      imageUrl.value = await uploadFile(file.value)
      console.log('Uploaded picture:', imageUrl)

      if (imageUrl.value) {
        const modifiedImageUrl = imageUrl.value.replace(
          'https://s3.eu-north-1.amazonaws.com/quiz-project-fullstack/',
          'https://quiz-project-fullstack.s3.eu-north-1.amazonaws.com/'
        )
        imageUrl.value = modifiedImageUrl
        console.log('Picture updated successfully.')
      } else {
        console.error('Failed to update profile picture.')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
    }
  } else {
    console.warn('No file selected.')
  }
}

const handleQuestionTypeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedQuestionType.value = target.value
}

const returnToQuiz = () => {
  const params = router.currentRoute.value.params
  const quiz_id = params.quiz_id
  const quiz_title = params.quiz_title as string
  const newUrl = `/quiz/${quiz_id}-${quiz_title.toLowerCase().replace(/ /g, '-')}/edit`
  router.push(newUrl)
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 0)
}

const getQuestionType = () => {
  if (selectedQuestionType.value === 'mc') {
    return 'multiple_choice'
  } else if (selectedQuestionType.value === 'tof') {
    return 'true_or_false'
  }
}

const checkIfValidInputs = () => {
  if (question.value === '') {
    popup('Please enter a question', 'red')
    return false
  }

  if (selectedQuestionType.value === 'mc') {
    let hasCorrectAlternative = false

    for (const alternative of alternatives.value) {
      if (alternative.text === '') {
        popup('Please enter all alternatives', 'red')
        return false
      }

      if (alternative.checked) {
        hasCorrectAlternative = true
      }
    }

    if (!hasCorrectAlternative) {
      popup('Please select at least one correct alternative', 'red')
      return false
    }
  } else {
    const tofInput = document.querySelector('input[name="tof"]:checked')
    if (!tofInput) {
      popup('Please select an answer', 'red')
      return false
    }
  }

  if (maxPoints.value === '') {
    popup('Please enter max points', 'red')
    return false
  }

  return true
}

const addToQuiz = async () => {
  if (!checkIfValidInputs()) {
    return
  }

  const params = router.currentRoute.value.params
  const quizId = params.quiz_id

  await uploadPicture()

  try {
    const questionData = {
      questionText: question.value,
      mediaUrl: imageUrl.value,
      points: Number(maxPoints.value),
      type: getQuestionType(),
      quizId: quizId
    }

    console.log(questionData)
    const addedQuestion = await addQuestionToQuiz(questionData)

    if (selectedQuestionType.value === 'mc') {
      for (const alternative of alternatives.value) {
        await addAlternativeToQuestion({
          questionId: addedQuestion.id,
          alternativeText: alternative.text,
          correct: alternative.checked
        })
      }
      console.log('Alternatives added successfully!')
      console.log(addedQuestion)
    } else if (selectedQuestionType.value === 'tof') {
      const tofInput = document.querySelector('input[name="tof"]:checked')
      const isCorrect = (tofInput as HTMLInputElement)?.value === 'true'
      console.log(isCorrect)
      await updateTrueOrFalseQuestion(addedQuestion.id, isCorrect)
    }

    console.log('Question added successfully!')

    if (editMode.value) {
      popup('Question updated!', 'green')
    } else {
      popup('Question added to quiz!', 'green')
    }

    setTimeout(() => {
      returnToQuiz()
    }, 1000)
  } catch (error) {
    console.error('Error adding question to quiz:', error)
  }
}

const addAlternative = () => {
  if (alternatives.value.length < 4) {
    alternatives.value.push({ text: '', checked: false })
  }
}

const removeAlternative = () => {
  if (alternatives.value.length > 2) {
    alternatives.value.pop()
  }
}

const popup = (message: string, fontColor: string) => {
  popupVisible.value = true
  popupMessage.value = message
  popupFontColor.value = fontColor
}

const popupVisible = ref(false)
const popupMessage = ref('')
const popupFontColor = ref('')

const saveChanges = async () => {
  if (!checkIfValidInputs()) {
    return
  }

  const params = router.currentRoute.value.params
  const quizId = params.quiz_id
  const questionId = params.question_id

  try {
    const questionData = {
      questionText: question.value,
      mediaUrl: '',
      points: Number(maxPoints.value),
      type: getQuestionType(),
      quizId: quizId,
      questionId: questionId
    }

    if (originalQuestionType.value !== questionData.type) {
      if (originalQuestionType.value === 'mc') {
        const originalQuiz = await getQuestionByQuestionId(Number(questionId))
        for (const alternative of originalQuiz.alternatives) {
          await deleteAlternativeByAlternativeId(alternative.id)
        }
        await deleteQuestionByQuestionId(Number(questionId))
        addToQuiz()
        return
      } else if (originalQuestionType.value === 'tof') {
        await deleteQuestionByQuestionId(Number(questionId))
        addToQuiz()
        return
      }
    }

    await uploadPicture()
    questionData.mediaUrl = imageUrl.value ?? ''

    const updatedQuestion = await updateQuestionById(questionData)

    const formattedAlternatives = alternatives.value.map((alternative, index) => {
      return {
        alternativeText: alternative.text,
        correct: alternative.checked,
        id: alternative.id // Use the ID of the alternative
      }
    })

    if (selectedQuestionType.value === 'mc') {
      await updateQuestionAlternatives(updatedQuestion.id, formattedAlternatives)
      console.log('Alternatives updated successfully!')
    } else if (selectedQuestionType.value === 'tof') {
      const isCorrect = selectedTofOption.value === 'true'
      await updateTrueOrFalseQuestion(updatedQuestion.id, isCorrect)
    }

    console.log('Question updated successfully!')

    popup('Question updated!', 'green')

    setTimeout(() => {
      returnToQuiz()
    }, 1000)
  } catch (error) {
    console.error('Error adding/updating question:', error)
  }
}

onMounted(async () => {
  const params = router.currentRoute.value.params
  if (params.question_id) {
    editMode.value = true
    try {
      questionData.value = await getQuestionByQuestionId(Number(params.question_id))
      console.log(questionData)
      question.value = questionData.value.questionText
      imageUrl.value = questionData.value.mediaUrl
      originalPictureUrl.value = questionData.value.mediaUrl
      console.log('Original picture URL:', originalPictureUrl.value)
      maxPoints.value = String(questionData.value.points)

      console.log('Original question type:', originalQuestionType)

      if (questionData.value.alternatives) {
        selectedQuestionType.value = 'mc'
        originalQuestionType.value = 'mc'
        alternatives.value = questionData.value.alternatives.map((alternative: any) => ({
          text: alternative.alternativeText,
          checked: alternative.correct
        }))
      } else {
        selectedQuestionType.value = 'tof'
        originalQuestionType.value = 'tof'
        const isTrue = questionData.value.correctAnswer
        selectedTofOption.value = isTrue
        alternatives.value = [
          { text: 'True', checked: isTrue },
          { text: 'False', checked: !isTrue }
        ]
      }
      console.log(originalQuestionType.value)
    } catch (error) {
      console.error('Error fetching question data:', error)
    }
  }
})
</script>

<style scoped>
/* content */
.choiceInput {
  width: 50%;
}
.choice {
  text-align: left;
  width: 100%;
  margin-top: 100px;
  margin-left: 21%;
  font-size: 20px;
}
.header {
  margin-top: 40px;
  font-size: 20px;
}
#image {
  width: 500px;
  height: 300px;
  border-radius: 8px;
  border: 1px solid #333;
}

.content {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  padding: 1px 16px;
  overflow-x: hidden;
  padding-bottom: 10%;
}
.qType {
  clear: both;
  float: left;
  margin-left: 20%;
  margin-top: 40px;
}

/* options */
#maxPoints {
  font-size: 20px;
  display: inline-block;
  width: fit-content;
}
#maxPointsInput {
  width: 60px;
}

.max-points-slider {
  margin-top: 20px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  justify-content: center;
}

.container {
  display: inline-block;
  position: relative;
  cursor: pointer;
}

.container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}
.checkmark {
  position: absolute;
  top: -15px;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: rgb(206, 203, 203);
  border-radius: 10%;
  border: 1px solid #000;
}

.container input:checked ~ .checkmark {
  background-color: Green;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
}

.container input:checked ~ .checkmark:after {
  display: block;
}

.container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 7px;
  height: 11px;
  border: solid white;
  border-width: 0 3px 3px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.returnButton {
  position: absolute;
  top: 80px;
  left: 10px;
  background-color: #756dd3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.returnButton:hover {
  background-color: #555;
}

.submitButton {
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
}

.submitButton:hover {
  background-color: #45a049;
}

.addRemoveButton {
  margin-left: 5px;
}

.header1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}
</style>
