<template>
  <div class="sidebar">
    <div id="questions">
      <div class="questionButtonDiv" v-for="(q, index) in questions" :key="index" @mouseover="handleOver(index)" @mouseleave="handleLeave(index)">
        <a :href="'#q' + (index + 1)" :class="{ active: index === 0 }" class="questionButton">Question {{ index + 1 }}</a>
        <img src='../assets/Trash-White.png' v-if="isHovered[index]" @click="deleteQuestion(index)" class="deleteButton">
      </div>
    </div>
  <a href="#add" @click="newQuestion()">Add question</a>
  </div>

  <div class="content">

    <header>
  <input class="toggle-menu" id="toggle-menu" type="checkbox" />
  <h2 class="mainHeader">Question</h2>
  <nav>
    <ul>
      <li>Max Points<br>
      <input type="number" id="maxPointsInput" min="0" max="10" v-model="maxPoints"></li>
      <li>Category<br>
      <input type="text" class="categoryInput" v-model="category"></li>
      <li>Difficulty<br>
      <input type="range" min="1" max="5" value="3" id="difficulty"></li>
      <li><button class="blackButton">Import Question</button></li>
      <li><button class="blackButton">Export Question</button><br></li>
    </ul>
  </nav>
  <label class="button-toggle-menu" for="toggle-menu">Options</label>
  <label class="overlay"  for="toggle-menu"></label>
</header>
    <input type="text" class="choiceInput"><br>

    <h2 class="header">Image or Video</h2>
    <img :src="imageUrl || placeholderImage" id="image" /><br>
    <input accept="image/*" type="file" @change="previewImage" /><br>

    <div class="qType header">
      Question type
      <select name="QuestionType" id="QuestionType" @change="handleQuestionTypeChange"> 
        <option value="mc">Multiple Choice</option> 
        <option value="tof">True or False</option> 
        <option value="fitb">Fill in the blank</option> 
      </select>
    </div>

    <div class="choice" v-if="selectedQuestionType === 'mc'">
      Alt 1: <input type="text" class="choiceInput"> <label class="container"><input type="checkbox" checked="checked"><span class="checkmark"></span></label><br>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [{ question: '', imageUrl: null, maxPoints: 1, category: '', selectedQuestionType: 'mc' }],
      currentQuestionIndex: 0,
      question: '',
      imageUrl: null,
      placeholderImage: 'src/assets/placeholder-image.jpg',
      selectedQuestionType: 'mc',
      maxPoints: '1', 
      category: '',
      questionQuantity: 1,
      isHovered: []
    };
  },
  methods: {
    previewImage(event) {
      const file = event.target.files[0];
      if (file) {
        this.imageUrl = URL.createObjectURL(file);
      } else {
        this.imageUrl = null;
      }
    },
    handleQuestionTypeChange(event) {
      this.selectedQuestionType = event.target.value;
    },
    newQuestion() {
      this.questions.push({ question: '', imageUrl: null, maxPoints: 1, category: '', selectedQuestionType: 'mc' });
      this.currentQuestionIndex = this.questions.length - 1;
    },
    handleLeave(index){
      this.isHovered[index] = false;
    },
    handleOver(index){
      this.isHovered[index] = true;
    },
    deleteQuestion(index) {
      console.log(index)
      this.questions.splice(index, 1);
      this.isHovered.splice(index, 1);
    }
  }
};
</script>


  
  <style scoped>
  .deleteButton{
    position: absolute;
    margin-left: 85%;
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
  .mainHeader{
    margin-left: 37%;
  }
  .choiceInput{
    width:50%
  }
  #tof{
    margin-left: 22%;
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
  .sidebar {
    margin: 0;
    padding: 0;
    width: 20%;
    background-color: #f1f1f1;
    position: fixed;
    height: 100%;
    overflow: auto;
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
  
  .content {
    width:80%;
    text-align: center;
    margin-left: 20%;
    padding: 1px 16px;
    height: 1000px;
    overflow-x: hidden;
  }
  
  .maxPoints,
  .category {
    font-size: 20px;
    display: inline-block;
    margin-top: 60px;
    margin-right: 13%; 
    margin-left: 13%;
  }

  .qType {
    clear: both; 
    float: left;
    margin-left: 20%;
    margin-top: 40px; 
  }

  .difficulty {
    float: right;
    margin-right: 15%;
    margin-top: 40px; 
  }

  #maxPointsInput {
    width: 60px;
  }

  .categoryInput {
    width: 150px;
  }

  header {
  height: 50px;
  width: 100%;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-toggle-menu {
  border-radius: 10%;
  cursor: pointer;
  font-size: 20px;
  background-color: #d1cece;
  margin-top: 300px;
  padding: 10px 20px;
}

.toggle-menu {
  appearance: none;

  &:checked {
    ~ nav {
      transform: translateX(90%) translateY(105%);;
    }
  }
}

nav {
  position:absolute, 0 null 0 0;
  background: #ffffff;
  width: 300px;
  transform: translateX(500%) translateY(100%);
  will-change: transform;
  transition: .3s transform linear;
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
@media only screen and (max-width: 700px){
  .sidebar {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background-color: #f1f1f1;
  overflow: auto;
  border-bottom: solid 1px black;
}
  .questionButton{
    width:100%
  }
  .questionButtonDiv{
    width:25%
  }

}
  </style>
  