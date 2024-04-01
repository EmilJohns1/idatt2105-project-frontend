<template>
  <div class="content">
    <button class="returnButton" @click="returnToQuiz">Return to quiz</button>
    <h2 class="mainHeader">Question</h2>
    <label class="overlay" for="toggle-menu"></label>
    <input type="text" class="choiceInput" v-model="question" /><br />

    <h2 class="header">Image or Video</h2>
    <img :src="imageUrl || placeholderImage" id="image" /><br />
    <input accept="image/*" type="file" @change="previewImage($event)" /><br />

    <div class="qType header">
      Question type
      <select name="QuestionType" id="QuestionType" @change="handleQuestionTypeChange($event)">
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
        ><input type="radio" name="tof" value="true" /><span class="checkmark"></span></label
      ><br />
      False
      <label class="container"
        ><input type="radio" name="tof" value="false" /><span class="checkmark"></span></label
      ><br />
    </div>

    <input class="toggle-menu" id="toggle-menu" type="checkbox" />
    <label class="button-toggle-menu" for="toggle-menu">Options</label>
    <nav>
      <ul>
        <li>
          Max Points<br />
          <input type="number" id="maxPointsInput" min="0" max="10" v-model="maxPoints" />
        </li>
        <li>
          Difficulty<br />
          <input type="range" min="1" max="5" value="3" id="difficulty" />
        </li>
        <li><button class="blackButton">Import Question</button></li>
        <li><button class="blackButton">Export Question</button><br /></li>
      </ul>
    </nav>
    <button class="submitButton" @click="addToQuiz">Add question to quiz</button>
    <Popup
      v-if="popupVisible"
      :error-message="popupMessage"
      :font-color="popupFontColor"
      @popup-closed="popupVisible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  addQuestionToQuiz,
  addAlternativeToQuestion,
  updateTrueOrFalseQuestion
} from '@/api/questionHooks'
import Popup from '@/components/Popup.vue'

const router = useRouter()

const question = ref('')
const imageUrl = ref<string | null>(null)
const placeholderImage = 'public/placeholder-image.jpg'
const selectedQuestionType = ref('mc')
const maxPoints = ref('1')
const alternatives = ref<{ text: string; checked: boolean }[]>([
  { text: '', checked: false },
  { text: '', checked: false }
])

const previewImage = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imageUrl.value = URL.createObjectURL(file)
  } else {
    imageUrl.value = null
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

    popup('Question added to quiz!', 'green')

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
.maxPoints,
.difficulty {
  font-size: 20px;
  display: inline-block;
  margin-top: 60px;
  margin-right: 13%;
  margin-left: 13%;
}
#maxPointsInput {
  width: 60px;
}

.button-toggle-menu {
  position: absolute;
  top: 100px;
  right: 5%;
  border-radius: 10%;
  display: block;
  cursor: pointer;
  font-size: 20px;
  background-color: #d1cece;
  margin-top: 100px;
  padding: 10px 20px;
}

.toggle-menu {
  appearance: none;

  &:checked {
    ~ nav {
      display: block;
    }
  }
}

nav {
  position: absolute;
  top: 120px;
  right: 0px;
  margin-top: 150px;
  display: none;
  align-items: center;
  justify-content: center;
  position:
    absolute,
    0 null 0 0;
  background: #ffffff;
  width: 230px;
  z-index: 1;
  border-left: solid black 1px;

  ul {
    list-style: none;
    padding: 20px 0;
    margin: 0;
    height: 100%;

    li {
      padding: 10px 20px;
    }
  }
}

/* custom checkmarks */
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
</style>
