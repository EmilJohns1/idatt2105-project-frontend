<template>
  <div class="sidebar">
    <a class="active" href="#q1">Question 1</a>
    <a href="#q2">Question 2</a>
    <a href="#q3">Question 3</a>
    <a href="#add">Add question</a>
  </div>

  <div class="content">
    <h2 class="header">Question</h2>
    <input type="text" class="choiceInput" v-model="question"><br>

    <h2 class="header">Image or Video</h2>
    <img :src="imageUrl || placeholderImage" id="image" /><br>
    <input accept="image/*" type="file" @change="previewImage" /><br>

    <div class="header qType">Question type
      <select name="QuestionType" id="QuestionType" @change="handleQuestionTypeChange"> 
        <option value="mc">Multiple Choice</option> 
        <option value="tof">Truth or False</option> 
        <option value="fitb">Fill in the blank</option> 
      </select>
    </div>
    <div class="header difficulty">
      Difficulty
      <input type="range" min="1" max="5" value="3" id="difficulty">
    </div>

    <div class="choice" v-if="selectedQuestionType === 'mc'">
      Correct answer:<input type="text" class="choiceInput"><br>
      Wrong answer: <input type="text" class="choiceInput"><br>
      Wrong answer: <input type="text" class="choiceInput"><br>
      Wrong answer: <input type="text" class="choiceInput"><br>
    </div>
    <div class="choice" id="tof" v-if="selectedQuestionType === 'tof'">
      Truth <input type="radio" name="tof"><br>
      False <input type="radio" name="tof"><br>
    </div>
    <div class="choice" v-if="selectedQuestionType === 'fitb'">
      Correct answer: <input type="text" class="choiceInput">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      question: '',
      imageUrl: null,
      placeholderImage: 'src/assets/placeholder-image.jpg',
      selectedQuestionType: 'mc' // Default selection
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
    }
  }
};
</script>

  
  <style scoped>

  .choiceInput{
    width:70%
  }
  #tof{
    margin-left: 22%;
  }
  .choice{
    text-align: left;
    width: 100%;
    margin-top: 100px;
    margin-left: 15%;
    font-size: 20px;
  }
  .qType{
    float: left;
    margin-left: 15%;
  }
  .difficulty{
    float: right;
    margin-right: 15%;
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
  }
  
  @media screen and (max-width: 700px) {
    .sidebar {
      width: 100%;
      height: auto;
      position: relative;
    }
    .sidebar a {float: left;}
    .content {margin-left: 0;}
  }
  
  @media screen and (max-width: 400px) {
    .sidebar a {
      text-align: center;
      float: none;
    }
  }
  </style>
  