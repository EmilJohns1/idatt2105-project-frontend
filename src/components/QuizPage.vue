<template>
  <QuizFrontPage v-if="frontPage" :quizId="quizId" @start-quiz="startQuiz" />
  <div v-else>
    <div class="container">
      <div id="header">{{ currentQuestion.questionText }}</div>
      <img id="image" :src="currentQuestion.mediaUrl || '/default.jpg'" />
      <div class="button-container">
        <button
          v-for="(alternative, index) in currentQuestion.alternatives"
          :key="index"
          class="alt"
          @click="() => clicked(index)"
          :id="'button-' + index"
          :class="{ clicked: clickedArray.includes(index) }"
        >
          {{ alternative.alternativeText }}
          <div class="upright"></div>
        </button>

        <div id="tof-container" v-if="currentQuestion.alternatives === null">
          <button @click="() => trueClicked()" class="alt" id="trueButton">
            True
            <div class="upright"></div>
          </button>

          <button @click="() => falseClicked()" :class="{ alt: true }" id="falseButton">
            False
            <div class="upright"></div>
          </button>
        </div>
      </div>
      <button class="submit" @click="toggleButtonState">
        {{ buttonText }}
      </button>
    </div>

    <div class="score-display">
      {{ scoreDisplay.scoreText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import QuizFrontPage from '@/components/QuizFrontPage.vue'
import { useRouter } from 'vue-router'
import type { Question } from '@/types/Question'
import type { Alternative } from '@/types/Alternative'
import type { AlternativeRecord } from '@/types/AlternativeRecord'
import type { QuestionAttempt } from '@/types/QuestionAttempt'
import { ref, onMounted, computed } from 'vue'
import { getUserByUsername } from '@/api/userHooks'
import { useUserStore } from '@/stores/userStore'
import { getQuestionsFromQuizId, registerQuizAttempt } from '@/api/quizHooks'
import checkedCorrect from '@/assets/responsebackgrounds/correct_marked.jpg'
import uncheckedCorrect from '@/assets/responsebackgrounds/correct_unmarked.jpg'
import checkedFalse from '@/assets/responsebackgrounds/false_checked.jpg'
import uncheckedFalse from '@/assets/responsebackgrounds/unchecked_false.jpg'

const router = useRouter()
const userStore = useUserStore()
const quizId = parseInt(router.currentRoute.value.params.quiz_id as string)
const buttonState = ref<'submit' | 'next'>('submit')
const scoreDisplay = ref({
  scoreText: 'Score: 0'
})

const buttonText = computed(() => {
  return buttonState.value === 'submit' ? 'Submit Answer' : 'Next Question ->'
})

const currentQuestion = ref({
  questionText: 'Loading...',
  mediaUrl: '/default.jpg',
  points: 0,
  alternatives: null as Alternative[] | null,
  correctAnswer: null as boolean | null
})

let questions: Question[] | null = []
let currentQuestionIndex = -1
let questionAttempts: QuestionAttempt[] = []
let numberOfCorrect = 0
let pointsPerQuestion = 0
let currentScore = 0
let maxScore = 0
let tofClicked = true

const quizAttemptRequest = {
  score: 0,
  userId: 0,
  quizId: quizId,
  questionAttempts: questionAttempts
}

const clickedArray: number[] = [] // Array to store clicked alternative indexes'
const frontPage = ref(true)

const startQuiz = () => {
  frontPage.value = false
  fetchQuestions()
  console.log("check")
}

const toggleButtonState = async () => {
  if (buttonState.value === 'submit') {
    await submit()
    buttonState.value = 'next'
  } else {
    nextQuestion()
    buttonState.value = 'submit'
  }
}

const trueClicked = async () => {
  const trueButton = document.getElementById('trueButton')
  const falseButton = document.getElementById('falseButton')
  if (falseButton && trueButton) {
    tofClicked = true
    falseButton.style.backgroundColor = '#756dd3'
    trueButton.style.backgroundColor = '#4c4694'
  }
}
const falseClicked = async () => {
  const trueButton = document.getElementById('trueButton')
  const falseButton = document.getElementById('falseButton')
  if (falseButton && trueButton) {
    tofClicked = false
    trueButton.style.backgroundColor = '#756dd3'
    falseButton.style.backgroundColor = '#4c4694'
  }
}

const clicked = async (index: number) => {
  if (questions && currentQuestion.value.alternatives) {
    const alternativeIndex = clickedArray.indexOf(index)

    const alternative = currentQuestion.value.alternatives[index]
    alternative.clicked = !alternative.clicked
    console.log(currentQuestion.value.alternatives)
    if (alternativeIndex === -1) {
      clickedArray.push(index)
    } else {
      clickedArray.splice(alternativeIndex, 1)
    }
    console.log(clickedArray)
    updateClickedClass()
  }
}

const updateClickedClass = () => {
  const buttons = document.querySelectorAll('.alt')
  buttons.forEach((button, index) => {
    if (clickedArray.includes(index)) {
      button.classList.add('clicked')
    } else {
      button.classList.remove('clicked')
    }
  })
}

const fetchQuestions = async () => {
  console.log("start")
  const username = userStore.getUserName
  if (username) {
    const userData = await getUserByUsername(username)
    quizAttemptRequest.userId = userData.id
  }

  questions = await getQuestionsFromQuizId(quizId)
  nextQuestion()
}
const nextQuestion = async () => {
  if (questions && currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++
    showQuestion(currentQuestionIndex)

    clickedArray.length = 0
    if (currentQuestion.value?.alternatives) {
      currentQuestion.value.alternatives.forEach((alternative) => {
        if (alternative) {
          alternative.clicked = false
        }
      })
    }
    updateClickedClass()

    const buttons = document.querySelectorAll('.alt')
    buttons.forEach((button) => {
      if (button instanceof HTMLElement) {
        button.style.backgroundImage = ''
        button.style.opacity = ''
        button.style.borderColor = ''
        button.style.backgroundColor = ''
        const uprightDiv = button.querySelector('.upright') as HTMLElement | null
        if (uprightDiv) {
          uprightDiv.style.display = 'none'
          uprightDiv.innerText = ''
        }
      }
    })
  } else {
    scoreDisplay.value.scoreText =
      'Score: ' +
      Math.floor(currentScore * 100) / 100 +
      ' / ' +
      Math.floor(maxScore * 100) / 100
    const container = document.querySelector('.container')
    const scoreDisplayElement = document.querySelector('.score-display')

    if (container instanceof HTMLElement && scoreDisplayElement instanceof HTMLElement) {
      container.style.display = 'none'
      scoreDisplayElement.style.left = '45%'
    }
  }
}

const submit = async () => {
  if (currentQuestion.value.correctAnswer === null) {
    const alternativeAttempts = [] as AlternativeRecord[]
    currentQuestion.value.alternatives?.forEach((alternative) => {
      const alternativeAttempt = {
        alternativeText: alternative.alternativeText,
        wasCorrect: alternative.correct,
        wasSelected: alternative.clicked
      }
      alternativeAttempts.push(alternativeAttempt)
    })
    const questionAttempt = {
      type: 'multiple_choice',
      questionText: currentQuestion.value?.questionText ?? '',
      mediaUrl: currentQuestion.value?.mediaUrl ?? '',
      points: currentQuestion.value?.points,
      alternatives: alternativeAttempts
    }

    pointsPerQuestion = Math.floor((currentQuestion.value.points / numberOfCorrect) * 100) / 100
    maxScore += Math.floor(pointsPerQuestion * numberOfCorrect * 100) / 100
    let pointsForQuestion = 0

    questionAttempt.alternatives.forEach((alternative, index) => {
      console.log(alternative)
      const button = document.getElementById(`button-${index}`)

      if (!button) {
        console.error(`Button with id 'button-${index}' not found`)
        return
      }

      const uprightDiv = button.querySelector('.upright') as HTMLElement | null

      if (!uprightDiv) {
        console.error(`Upright div not found in button 'button-${index}'`)
        return
      }

      button.style.backgroundSize = 'cover'
      if (alternative.wasSelected && alternative.wasCorrect) {
        //multiple choice
        button.style.backgroundImage = `url(${checkedCorrect})`
        button.style.borderColor = '#1a912a'
        uprightDiv.style.display = 'block'
        uprightDiv.innerText = '+ ' + pointsPerQuestion + ' score'
        pointsForQuestion += Math.floor(pointsPerQuestion * 100) / 100
      } else if (alternative.wasSelected && !alternative.wasCorrect) {
        button.style.backgroundImage = `url(${checkedFalse})`
        button.style.borderColor = '#911a1a'
        uprightDiv.style.display = 'block'
        uprightDiv.innerText = '- ' + pointsPerQuestion + ' score'
        pointsForQuestion -= Math.floor(pointsPerQuestion * 100) / 100
      } else if (!alternative.wasSelected && !alternative.wasCorrect) {
        button.style.backgroundImage = `url(${uncheckedFalse})`
        button.style.opacity = '0.5'
      } else if (!alternative.wasSelected && alternative.wasCorrect) {
        button.style.backgroundImage = `url(${uncheckedCorrect})`
        button.style.opacity = '0.5'
      }
    })
    if (pointsForQuestion > 0) {
      currentScore += Math.floor(pointsForQuestion * 100) / 100
    }
    quizAttemptRequest.score += currentQuestion.value.points
    questionAttempt.points = currentQuestion.value.points

    questionAttempts.push(questionAttempt)
  } else if (currentQuestion.value.correctAnswer !== null) {
    //true or false
    const questionAttempt = {
      type: 'true_or_false',
      questionText: currentQuestion.value?.questionText ?? '',
      mediaUrl: currentQuestion.value?.mediaUrl ?? '',
      points: currentQuestion.value?.points,
      correctAnswer: currentQuestion.value?.correctAnswer,
      userAnswer: tofClicked
    }
    maxScore += Math.floor(questionAttempt.points)
    if (questionAttempt.correctAnswer === tofClicked) {
      currentScore += Math.floor(questionAttempt.points)
    }
    const trueButton = document.getElementById('trueButton')
    const falseButton = document.getElementById('falseButton')
    if (trueButton && falseButton) {
      falseButton.style.backgroundSize = 'cover'
      trueButton.style.backgroundSize = 'cover'
      if (questionAttempt.correctAnswer === tofClicked && tofClicked === true) {
        const trueUpright = trueButton.querySelector('.upright') as HTMLElement | null
        trueButton.style.backgroundImage = `url(${checkedCorrect})`
        trueButton.style.borderColor = '#1a912a'
        falseButton.style.backgroundImage = `url(${uncheckedFalse})`
        falseButton.style.opacity = '0.5'
        if (trueUpright) {
          trueUpright.style.display = 'block'
          trueUpright.innerText = '+ ' + questionAttempt.points + ' score'
        }
      } else if (questionAttempt.correctAnswer === tofClicked && tofClicked === false) {
        const falseUpright = falseButton.querySelector('.upright') as HTMLElement | null
        falseButton.style.backgroundImage = `url(${checkedCorrect})`
        falseButton.style.borderColor = '#1a912a'
        trueButton.style.backgroundImage = `url(${uncheckedFalse})`
        trueButton.style.opacity = '0.5'
        if (falseUpright) {
          falseUpright.style.display = 'block'
          falseUpright.innerText = '+ ' + questionAttempt.points + ' score'
        }
      } else if (questionAttempt.correctAnswer != tofClicked && tofClicked === false) {
        falseButton.style.backgroundImage = `url(${checkedFalse})`
        falseButton.style.borderColor = '#911a1a'
        trueButton.style.backgroundImage = `url(${uncheckedCorrect})`
        trueButton.style.opacity = '0.5'
      } else if (questionAttempt.correctAnswer != tofClicked && tofClicked === true) {
        trueButton.style.backgroundImage = `url(${checkedFalse})`
        trueButton.style.borderColor = '#911a1a'
        falseButton.style.backgroundImage = `url(${uncheckedCorrect})`
        falseButton.style.opacity = '0.5'
      }
    }
    
    quizAttemptRequest.score += currentQuestion.value.points
    questionAttempts.push(questionAttempt)
  }
  console.log(quizAttemptRequest)
  if (questions && currentQuestionIndex >= questions.length - 1) {
    console.log('done!')
    await registerQuizAttempt(quizAttemptRequest)
  }
  numberOfCorrect = 0
  scoreDisplay.value.scoreText = 'Score: ' + Math.floor(currentScore * 100) / 100
}

const showQuestion = (index: number) => {
  if (questions) {
    const question = questions[index]
    if (question.alternatives && question.correctAnswer === undefined) {
      question.alternatives.forEach((alternative) => {
        alternative.clicked = false
        if (alternative.correct) {
          numberOfCorrect++
        }
      })
      currentQuestion.value = {
        questionText: question.questionText,
        mediaUrl: question.mediaUrl || '/default.jpg',
        alternatives: question.alternatives,
        points: question.points,
        correctAnswer: null
      }
    } else if (question.correctAnswer !== undefined) {
      currentQuestion.value = {
        questionText: question.questionText,
        mediaUrl: question.mediaUrl || '/default.jpg',
        points: question.points,
        alternatives: null,
        correctAnswer: question.correctAnswer
      }
    }
    console.log(currentQuestion.value)
  }
  updateClickedClass()
}
</script>

<style scoped>
.score-display {
  position: absolute;
  top: 200px;
  left: 10px;
  font-size: 1.5vw;
  font-weight: bold;
  text-align: left;
  width: 100%;
  max-width: 20ch;
  z-index: 2;
}
.upright {
  position: absolute;
  top: 1px;
  right: 1px;
  background-color: white;
  border-radius: 20px;
  color: black;
  font-size: 1vw;
  padding: 4px 15px 3px 15px;
  display: none;
}

.submit {
  width: 40%;
  margin-left: 20%;
  margin-right: 20%;
  aspect-ratio: 15/1;
  border: none;
  background-color: #000000;
  color: white;
  border-radius: 20px;
  font-size: 1.2vw;
  cursor: pointer;
}
.navButtons {
  width: 60%;
}
.nav {
  width: 80px;
  padding: 10px;
  position: relative;
  font-size: 15px;
  cursor: pointer;
  background-color: #c0c0c0;
}
.pre {
  float: left;
}
.nxt {
  float: right;
}
#image {
  width: 40%;
  aspect-ratio: 5/3;
}
.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 60%;
  text-align: center;
  overflow: hidden;
}

.alt {
  flex: 0 0 calc(40% - 20px);
  box-sizing: border-box;
  background-position: center;
  aspect-ratio: 3/1;
  margin: 10px;
  border: none;
  background-color: #756dd3;
  border: solid 5px #756dd3;
  color: #ffffff;
  font-size: 1.3vw;
  border-radius: 20px;
  cursor: pointer;
  max-width: 40ch;
  overflow: hidden;
  position: relative;
  word-break: break-all;
}
.alt.clicked {
  background-color: #4c4694;
}
.alt:hover:not(.clicked) {
  background-color: #6c65b6;
}
.error-message {
  color: red;
  margin-bottom: 10px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-top: 20px;
  width: 100%;
}

#header {
  font-size: 1.5vw;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
  max-width: 120ch;
  overflow-wrap: break-word;
}
#tof-container {
  display: flex;
  text-align: center;
  justify-content: center;
  width: 100%;
}

@media (max-width: 750px) {
  #image {
    width: 70%;
  }
  .button-container {
    width: 90%;
    text-align: center;
  }
  .alt {
    aspect-ratio: 2/1;
    max-width: 60ch;
    font-size: 2vw;
  }
  .submit {
    font-size: 2vw;
  }
  .score-display {
    font-size: 2vw;
  }

  #header {
    font-size: 20px;
    margin-bottom: 20px;
    text-align: center;
    width: 100%;
    max-width: 40ch;
    overflow-wrap: break-word;
  }
}
</style>