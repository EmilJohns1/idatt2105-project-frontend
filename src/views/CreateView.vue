<template>
  <div class="sidebar">
    <div id="questions">
      <div class="questionButtonDiv" v-for="(q, index) in questions" :key="index" @mouseover="handleOver(index)" @mouseleave="handleLeave(index)">
        <a :href="'#q' + (index + 1)" :class="{ active: index === 0 }" class="questionButton">Question {{ index + 1 }}</a>
        <img src='../assets/Trash-White.png'  v-if="shouldShow(index)"  @click="deleteQuestion(index)" class="deleteButton">
      </div>
    </div>
  <a id="add" @click="newQuestion()">Add question</a>
  </div>

  <div class="content">
  <h2 class="mainHeader">Question</h2>
  <label class="overlay"  for="toggle-menu"></label>
    <input type="text" class="choiceInput" v-model="question"><br>

    <h2 class="header">Image or Video</h2>
    <img :src="imageUrl || placeholderImage" id="image" /><br>
    <input accept="image/*" type="file" @change="previewImage($event)" /><br>

    <div class="qType header">
      Question type
      <select name="QuestionType" id="QuestionType" @change="handleQuestionTypeChange($event)"> 
        <option value="mc">Multiple Choice</option> 
        <option value="tof">True or False</option> 
        <option value="fitb">Fill in the blank</option> 
      </select>
    </div>

    <div class="choice" v-if="selectedQuestionType === 'mc'">
      Alt 1: <input type="text" class="choiceInput"> <label class="container"><input type="checkbox" checked><span class="checkmark"></span></label><br>
      Alt 2: <input type="text" class="choiceInput"> <label class="container"><input type="checkbox"><span class="checkmark"></span></label><br>
      Alt 3: <input type="text" class="choiceInput"> <label class="container"><input type="checkbox"><span class="checkmark"></span></label><br>
      Alt 4: <input type="text" class="choiceInput"> <label class="container"><input type="checkbox"><span class="checkmark"></span></label><br>
    </div>
    <div class="choice" id="tof" v-if="selectedQuestionType === 'tof'">
      Answer:<br>
      True&nbsp; <label class="container"><input type="radio" name="tof" checked><span class="checkmark"></span></label><br>
      False <label class="container"><input type="radio" name="tof"><span class="checkmark"></span></label><br>
    </div>
    <div class="choice" v-if="selectedQuestionType === 'fitb'">
      Answer: <input type="text" class="choiceInput">
    </div>
    <input class="toggle-menu" id="toggle-menu" type="checkbox" />
    <label class="button-toggle-menu" for="toggle-menu">Options</label>
  <nav>
    <ul>
      <li>Max Points<br>
      <input type="number" id="maxPointsInput" min="0" max="10" v-model="maxPoints"></li>
      <li>Difficulty<br>
      <input type="range" min="1" max="5" value="3" id="difficulty"></li>
      <li><button class="blackButton">Import Question</button></li>
      <li><button class="blackButton">Export Question</button><br></li>
    </ul>
  </nav>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';

interface Question {
  question: string;
  imageUrl: string | null;
  maxPoints: number;
  selectedQuestionType: string;
}

const questions = ref<Question[]>([{ question: '', imageUrl: null, maxPoints: 1, selectedQuestionType: 'mc' }]);
const currentQuestionIndex = ref(0);
const question = ref('');
const imageUrl = ref<string | null>(null);
const placeholderImage = 'src/assets/placeholder-image.jpg';
const selectedQuestionType = ref('mc');
const maxPoints = ref('1');
const isHovered = ref<boolean[]>([]);

const previewImage = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
  } else {
    imageUrl.value = null;
  }
};

const handleQuestionTypeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedQuestionType.value = target.value;
};

const newQuestion = () => {
  questions.value.push({ question: '', imageUrl: null, maxPoints: 1, selectedQuestionType: 'mc' });
  currentQuestionIndex.value = questions.value.length - 1;
};

const handleLeave = (index: number) => {
  isHovered.value[index] = false;
};

const handleOver = (index: number) => {
  isHovered.value[index] = true;
};

const deleteQuestion = (index: number) => {
  questions.value.splice(index, 1);
  isHovered.value.splice(index, 1);
};

const shouldShow = computed(() => {
  return (index: number) => isHovered.value[index] || window.innerWidth < 750;
});
</script>




  
  <style scoped>
 /*  sidebar */
  .sidebar {
    margin: 0;
    padding: 0;
    width: 20%;
    background-color: #f1f1f1;
    position: fixed;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    border-right: solid 1px black;
  }
  
  .sidebar a {
    display: block;
    color: black;
    padding: 16px;
    text-decoration: none;
  }
   
  .sidebar a.active {
    background-color: #756DD3;
    color: white;
  }
  
  .sidebar a:hover:not(.active) {
    background-color: #555;
    color: white;
  }

  .deleteButton{
    position: absolute;
    right:10px;
    margin-top: 12px;
    cursor:pointer;
    border: none;
    background: none;
  }
  .deleteButton:hover{
    content:url("../assets/Trash-Redder.png")
  }
  .questionButton{
    position: absolute;
    width:100%
  }
  .questionButtonDiv{
    position: relative;
    height: 55px;
  }
  #add{
  cursor: pointer;
  margin-bottom: 80px;
  }

  /* content */
  .choiceInput{
    width:50%
  }
  .choice{
    text-align: left;
    width: 100%;
    margin-top: 100px;
    margin-left: 21%;
    font-size: 20px;
  }
  .header{
    margin-top: 40px;
    font-size: 20px;
  }
  #image{
    width: 500px;
    height: 300px;
  }
  
  .content {
    width:80%;
    text-align: center;
    margin-left: 20%;
    margin-top: 30px;
    padding: 1px 16px;
    overflow-x: hidden;
    overflow-y:scroll;
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
  position: absolute; top:100px; right: 5%;
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
  position: absolute; top:120px;right: 0px;
  margin-top: 150px;
  display: none;
  align-items: center;
  justify-content: center;
  position:absolute, 0 null 0 0;
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
  border: 1px solid #000;;
}

.container input:checked ~ .checkmark {
  background-color: Green;
}

.checkmark:after {
  content: "";
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

/* for slim display */
@media only screen and (max-width: 750px){
  .sidebar {
    all:revert;
  position: absolute;
  top: 34;
  left: 0;
  width: 100%;
  height: 60px;
  border-bottom: solid 1px black;
  display: flex;  
  overflow-y: hidden;
  overflow-x: scroll;
  white-space: nowrap;
}
#questions{
  display: flex;  
  white-space: nowrap;
}
#add{
  width:90px;
  height: 25px;
  padding:13px;
}
.sidebar a {
  all:revert;
  display: flex;  
  flex-wrap: wrap;
    color: black;
    padding: 13px;
    text-decoration: none;
  }
  .questionButton{
    width:100%
  }
  .questionButtonDiv{
    width:115px;
  }
  .deleteButton{
    content:url("../assets/Trash-White-circle.png");
    position: absolute;
    top:-12px;
    left: 0px;
    width: 15px;
  }
  .deleteButton:hover{
    content:url("../assets/Trash-White-circle.png");
  }
  .content{
    width: 100%;
    margin-left: 0%;
    margin-top: 80px;
  }
}
@media only screen and (max-width: 1200px){
  .button-toggle-menu { /* make centered */
    right: 0%;
    top:40px;
    display:inline;
    position: relative;
    margin:auto;
    padding: 10px 20px;
  }
  nav { /* make centered */
    border-top: solid 1px black;
    top:65px;
    background-color: rgba(255, 255, 255);
    position: relative;
    margin:auto;
    margin-top: 0px;
    border-left: none;
  }

}
  </style>
  