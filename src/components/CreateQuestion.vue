<template>
  <div class="content">
    <button class="returnButton" @click="returnToQuiz">Return to quiz</button>
    <h2 class="header1">{{ editMode ? 'Edit Question' : 'Add Question' }}</h2>
    <h2 class="mainHeader">Question Text</h2>
    <label class="overlay" for="toggle-menu"></label>
    <input type="text" class="choiceInput inputField" v-model="question" /><br />

    <h2 class="header">Image or Video</h2>
    <img :src="imageUrl || placeholderImage" id="image" /><br />
    <input accept="image/*" type="file" id="file" name="file" @change="onFileChange" class="inputfile" /><label for="file">Choose a file</label><br />

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
        <input type="text" class="choiceInput inputField alt" :placeholder="generatePlaceholder(index)" v-model="alternativeObj.text" />
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
      <div id="tofAnswers">
      <label class="tofLabel" for="true">True</label>
      <label class="container"
        ><input type="radio" name="tof" id="true" value="true" v-model="selectedTofOption" /><span
          class="checkmark"
        ></span></label><br />

      <label class="tofLabel" for="false">False</label>
      <label class="container"
        ><input type="radio" name="tof" id="false" value="false" v-model="selectedTofOption" /><span
          class="checkmark"
        ></span></label
      >
      </div>
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

/**
 * Preview uploaded image.
 * 
 * @param {Event} event - The input change event.
 */
const previewImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  }
}

/**
 * Handle file input change.
 * 
 * @param {Event} event - The input change event.
 */
const onFileChange = (event: Event) => {
  validateImageSize(event)
  previewImage(event)
}

/**
 * Validate if the uploaded file is an image.
 * 
 * @param {File} file - The uploaded file.
 * @returns {boolean} - True if the file is a valid image; otherwise, false.
 */
const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Generate a placeholder for the alternative input based on its index.
 * 
 * @param {number} index - The index of the alternative.
 * @returns {string} - The generated placeholder text.
 */
const generatePlaceholder = (index: number): string => {
  return `Alternative ${index + 1}`;
}

/**
 * Validate the size of the uploaded image.
 * 
 * @param {Event} event - The input change event.
 */
const validateImageSize = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]

  if (selectedFile) {
    const fileSize = selectedFile.size / 1024 // Convert to KB
    const maxSizeKB = 1024 * 3 // Max size in KB (3 MB)

    if (!validateImageFile(selectedFile)) {
      window.alert('Invalid file type. Please select a PNG, JPG, or JPEG file.')
      target.value = ''
    } else if (fileSize > maxSizeKB) {
      window.alert('File size exceeds the maximum limit. Maximum 3 MB allowed.')
      target.value = ''
    } else {
      file.value = selectedFile
    }
  }
}

/**
 * Upload the selected picture.
 */
const uploadPicture = async (): Promise<void> => {
  if (file.value) {
    try {
      if (originalPictureUrl.value) {
        const deleteSuccess = await deletePicture(originalPictureUrl.value)

        if (!deleteSuccess) {
          console.error('Failed to delete current profile picture.')
          return
        }
      }

      imageUrl.value = await uploadFile(file.value)

      if (imageUrl.value) {
        const modifiedImageUrl = imageUrl.value.replace(
          'https://s3.eu-north-1.amazonaws.com/quiz-project-fullstack/',
          'https://quiz-project-fullstack.s3.eu-north-1.amazonaws.com/'
        )
        imageUrl.value = modifiedImageUrl
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

/**
 * Handle change in question type.
 * 
 * @param {Event} event - The select change event.
 */
const handleQuestionTypeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedQuestionType.value = target.value
}

/**
 * Return to the quiz edit page.
 */
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

/**
 * Get the question type based on the selected question type.
 * 
 * @returns {string} - The question type.
 */
const getQuestionType = () => {
  if (selectedQuestionType.value === 'mc') {
    return 'multiple_choice'
  } else if (selectedQuestionType.value === 'tof') {
    return 'true_or_false'
  }
}

/**
 * Validate user inputs.
 * 
 * @returns {boolean} - True if all inputs are valid; otherwise, false.
 */
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

/**
 * Add the question to the quiz.
 */
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

    const addedQuestion = await addQuestionToQuiz(questionData)

    if (selectedQuestionType.value === 'mc') {
      for (const alternative of alternatives.value) {
        await addAlternativeToQuestion({
          questionId: addedQuestion.id,
          alternativeText: alternative.text,
          correct: alternative.checked
        })
      }
    } else if (selectedQuestionType.value === 'tof') {
      const tofInput = document.querySelector('input[name="tof"]:checked')
      const isCorrect = (tofInput as HTMLInputElement)?.value === 'true'
      await updateTrueOrFalseQuestion(addedQuestion.id, isCorrect)
    }

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

/**
 * Add an alternative to the question.
 */
const addAlternative = () => {
  if (alternatives.value.length < 4) {
    alternatives.value.push({ text: '', checked: false })
  }
}

/**
 * Remove an alternative from the question.
 */
const removeAlternative = () => {
  if (alternatives.value.length > 2) {
    alternatives.value.pop()
  }
}

/**
 * Display a popup message.
 * 
 * @param {string} message - The message to display.
 * @param {string} fontColor - The color of the message font.
 */
const popup = (message: string, fontColor: string) => {
  popupVisible.value = true
  popupMessage.value = message
  popupFontColor.value = fontColor
}

const popupVisible = ref(false)
const popupMessage = ref('')
const popupFontColor = ref('')

/**
 * Save the changes made to the question.
 */
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

    const formattedAlternatives = alternatives.value.map((alternative) => {
      return {
        alternativeText: alternative.text,
        correct: alternative.checked,
        id: alternative.id 
      }
    })

    if (selectedQuestionType.value === 'mc') {
      await updateQuestionAlternatives(updatedQuestion.id, formattedAlternatives)
    } else if (selectedQuestionType.value === 'tof') {
      const isCorrect = selectedTofOption.value === 'true'
      await updateTrueOrFalseQuestion(updatedQuestion.id, isCorrect)
    }

    popup('Question updated!', 'green')

    setTimeout(() => {
      returnToQuiz()
    }, 1000)
  } catch (error) {
    console.error('Error adding/updating question:', error)
  }
}

/**
 * Fetch and populate the question data for editing.
 */
onMounted(async () => {
  const params = router.currentRoute.value.params
  if (params.question_id) {
    editMode.value = true
    try {
      questionData.value = await getQuestionByQuestionId(Number(params.question_id))
      question.value = questionData.value.questionText
      imageUrl.value = questionData.value.mediaUrl
      originalPictureUrl.value = questionData.value.mediaUrl
      maxPoints.value = String(questionData.value.points)

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
    } catch (error) {
      console.error('Error fetching question data:', error)
    }
  }
})
</script>


<style scoped>
.inputField{
  width: 50%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 0;
  box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
  border-radius: 0.5em;
}
.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
.inputfile + label {
  font-size: 1em;
  font-weight: 700;
  display: inline-block;
  color: white;
  background-color: #000000;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px 10px;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;
}

.inputfile:focus + label,
.inputfile + label:hover {
  background-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
.inputfile + label {
  cursor: pointer; /* "hand" cursor */
}

.alt {
  margin-right: 10px;
}

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
  max-width: 90%;
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

#QuestionType{
  background-color: white;
  padding:10px;
  border: #000 solid 1px;
  border-radius: 10px;
}

#maxPoints {
  font-size: 20px;
  display: inline-block;
  width: fit-content;
  accent-color: #756dd3;
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
  background-color: #000000;
  border-radius: 10px;
  border: solid black 1px;
  color: white;
  cursor: pointer;
  padding: 5px;
}
.tofLabel{
  width:70px;
  display: inline-block;
}
#tofAnswers{
  margin-top: 10px;
  margin-left: 27px;
}
.header1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}
@media (max-width: 750px) {
  .returnButton {
    top: 60px;
    left: 5px;
  }
  .inputField{
    width: 80%;
  }
  .choice, .qType{
    margin-left: 10px;
  }
}
</style>
