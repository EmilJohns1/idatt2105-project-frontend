<template>
  <div class="container">
    <RouterLink class="userButton" to="/user">Back to user page</RouterLink>
    <div v-if="quizAttempt.questionAttempts?.length" class="navButtons">
        <button v-if="currentQuestionIndex<quizAttempt.questionAttempts?.length-1" class="nav nxt" @click="next()">next</button>
        <button v-if="currentQuestionIndex>0" class="nav pre" @click="last()">previous</button>
      </div>
    <div id="header">{{ currentQuestionAttempt.questionText }}</div>
    <img id="image" :src="currentQuestionAttempt.mediaUrl || '/default.jpg'" />
    <div class="button-container">
      <template v-if="currentQuestionAttempt.alternatives">
        <button
          v-for="(alternative, index) in currentQuestionAttempt.alternatives"
          :key="index"
          :class="{
              'alt': true,
              'checkedFalse': alternative.wasCorrect !== alternative.wasSelected&&alternative.wasCorrect===false,
              'uncheckedFalse': alternative.wasCorrect === alternative.wasSelected&&alternative.wasCorrect===false,
              'checkedCorrect': alternative.wasCorrect === alternative.wasSelected&&alternative.wasCorrect===true,
              'uncheckedCorrect': alternative.wasCorrect !== alternative.wasSelected&&alternative.wasCorrect===true,
            }"
          :id="'button-' + index"
        >
          {{ alternative.alternativeText }}
          <div v-if="alternative.wasSelected" class="upright">
  {{ alternative.wasCorrect ? '+' : '-' }} {{ pointsPerAlternative }} score
</div>

        </button>
      </template>

      <template v-else-if="currentQuestionAttempt.correctAnswer!==undefined">
        <div id="tof-container">
          <button :class="{
              'alt': true,
              'checkedFalse': currentQuestionAttempt.correctAnswer ===false&&currentQuestionAttempt.userAnswer===true,
              'uncheckedFalse':currentQuestionAttempt.correctAnswer ===false&&currentQuestionAttempt.userAnswer===false,
              'checkedCorrect': currentQuestionAttempt.correctAnswer ===true&&currentQuestionAttempt.userAnswer===true,
              'uncheckedCorrect': currentQuestionAttempt.correctAnswer ===true&&currentQuestionAttempt.userAnswer===false,
            }" id="trueButton">
            True
            <div  v-if="currentQuestionAttempt.userAnswer===true" class="upright">
              {{ currentQuestionAttempt.correctAnswer ? '+' : '-' }} {{ currentQuestionAttempt.points }} score
            </div>
          </button>

          <button :class="{
              'alt': true,
              'checkedFalse': currentQuestionAttempt.correctAnswer ===true&&currentQuestionAttempt.userAnswer===false,
              'uncheckedFalse':currentQuestionAttempt.correctAnswer ===true&&currentQuestionAttempt.userAnswer===true,
              'checkedCorrect': currentQuestionAttempt.correctAnswer ===false&&currentQuestionAttempt.userAnswer===false,
              'uncheckedCorrect': currentQuestionAttempt.correctAnswer ===false&&currentQuestionAttempt.userAnswer===true,
            }" id="falseButton">
            False
            <div v-if="currentQuestionAttempt.userAnswer===false" class="upright"></div>
          </button>
        </div>
      </template>
    </div>
  </div>
  <div class="score-display"> Score:
      {{ score }} / {{ quizAttempt.score }}
    </div>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import type { AlternativeRecord } from '@/types/AlternativeRecord'
import type { QuestionAttempt } from '@/types/QuestionAttempt'
import { getQuizAttemptById } from '@/api/quizHooks'

const router = useRouter()
let currentQuestionIndex = 0
let pointsPerAlternative=0
let score=0

const quizAttempt = ref({
  score: 0,
  quizId: 0,
  questionAttempts: null as QuestionAttempt[] | null
})

const currentQuestionAttempt = ref<QuestionAttempt>({
  type: "truth or false",
  questionText: 'Loading...',
  mediaUrl: '/default.jpg',
  points: 0
})

const findPoints = async (alternatives:AlternativeRecord[]) => {
  let correctAlternatives = 0
  alternatives.forEach(alternative => {
    if(alternative.wasCorrect){
      correctAlternatives++
    }
    pointsPerAlternative=Math.floor(currentQuestionAttempt.value.points/correctAlternatives*100)/100
  });
}

const next = async () => {
  if(quizAttempt.value.questionAttempts){
  currentQuestionIndex++
  currentQuestionAttempt.value = quizAttempt.value.questionAttempts[currentQuestionIndex]
  if(currentQuestionAttempt.value.alternatives){
  findPoints(currentQuestionAttempt.value.alternatives)}
}}
const last = async () => {
  if(quizAttempt.value.questionAttempts){
  currentQuestionIndex--
  currentQuestionAttempt.value = quizAttempt.value.questionAttempts[currentQuestionIndex]
  if(currentQuestionAttempt.value.alternatives){
  findPoints(currentQuestionAttempt.value.alternatives)}
}}

const fetchQuizAttempt = async () => {
  const quizAttemptId = parseInt(router.currentRoute.value.params.quizattempt_id as string)
  const quizAttemptData = await getQuizAttemptById(quizAttemptId)
  if(quizAttemptData){
  quizAttempt.value.score = quizAttemptData.score
  quizAttempt.value.quizId = quizAttemptData.quizId
  quizAttempt.value.questionAttempts = quizAttemptData.questionAttempts
  if (quizAttempt.value.questionAttempts) {
    currentQuestionAttempt.value = quizAttempt.value.questionAttempts[currentQuestionIndex]
    if(currentQuestionAttempt.value.alternatives){
  findPoints(currentQuestionAttempt.value.alternatives)}
  }
  
  quizAttempt.value.questionAttempts.forEach(attempt => {
    if(attempt.userAnswer === undefined&&attempt.alternatives){
      let alternativePoints = 0
      let pointsForQuestion=0
      let correctAlternatives = 0
      attempt.alternatives.forEach(alternative => {
        if(alternative.wasCorrect){
          correctAlternatives++
        }
      alternativePoints=Math.floor(currentQuestionAttempt.value.points/correctAlternatives*100)/100
      });
      attempt.alternatives.forEach(alternative => {
        if(alternative.wasCorrect&&alternative.wasSelected){
          pointsForQuestion+=alternativePoints
        } else if(alternative.wasCorrect==false&&alternative.wasSelected){
          pointsForQuestion-=alternativePoints
        }
      });
      if(pointsForQuestion>0){
        score+=pointsForQuestion
      }
    }
    else if(attempt.userAnswer!==undefined){
      if(attempt.userAnswer===attempt.correctAnswer){
        score+=attempt.points
      }
    }
  });
}}

onMounted(fetchQuizAttempt)
</script>
  <style scoped>
  .checkedCorrect{
    background-image: url("../assets/responsebackgrounds/correct_marked.jpg");/* assets */
    background-size: cover;
    border-color: #1a912a !important;; 
    opacity: 1;
  }
  .checkedFalse{
    background-image: url("../assets/responsebackgrounds/false_checked.jpg");/* assets */
    background-size: cover;
    border-color: #911a1a !important;;
    opacity: 1
  }
  .uncheckedCorrect{
    background-image: url("../assets/responsebackgrounds/correct_unmarked.jpg");/* assets */
    background-size: cover;
    opacity: 0.5;
  }
  .uncheckedFalse{
    background-image: url("../assets/responsebackgrounds/unchecked_false.jpg");/* assets */
    background-size: cover;
    opacity: 0.5;
  }
  .userButton {
    position: absolute;
    top:68px;
    left:0px;
    padding:10px;
    background-color: rgb(218, 218, 218);
    color: #363636;
  }
  .score-display {
    position: absolute;
    top: 300px;
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
    padding-bottom: 10px;
  }
  .nav {
    width: 8vw;
    padding: 10px;
    position: relative;
    font-size: 1vw;
    cursor: pointer;
    background-color: black;
    border-radius: 10px;
    border: solid 2px black;
    color: white;
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
  
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
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
    .userButton {
    position: absolute;
    top:700px;
    left:unset;
  }
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
    .nav{
      font-size: 2vw;
      width: 16vw;
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