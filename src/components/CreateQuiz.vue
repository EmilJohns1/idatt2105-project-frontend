<template>
    <div class="container">
      <h1 id="header">Create new quiz</h1>
      <form @submit.prevent="">
        <h2>Title</h2>
        <input v-model="title" type="text" required class="input-field" />
        <h2>Description</h2>
        <textarea v-model="description" type="text" class="input-field description"></textarea>
        <h2>Display image</h2>
        <img :src="imageUrl || placeholderImage" id="image" /><br>
        <input accept="image/*" type="file" @change="previewImage" /><br>
        <h3>Category</h3>
        <select name="category" id="category" > 
        <option value="mc">test 1</option> 
        <option value="tof">test 2</option> 
        <option value="fitb">test 3</option> 
      </select>
        <h3>Add tags</h3>
        <div class="tags-input"> 
      <ul id="tags"></ul> 
      <input type="text" id="input-tag" 
          placeholder="Enter tag (e.g. difficult)" /> 
  </div> 
        <div class="button-container">
          <button type="submit" class="submit-button">Create quiz</button>
        </div>
      </form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  
  const imageUrl = ref<string | null>(null);
  const placeholderImage = 'src/assets/placeholder-image.jpg';
  const title = ref('');
  const description = ref('');
  
  const previewImage = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      imageUrl.value = URL.createObjectURL(file);
    } else {
      imageUrl.value = null;
    }
  };


  const tags = ref<HTMLElement | null>(null);
  const input = ref<HTMLInputElement | null>(null);

onMounted(() => {
  tags.value = document.getElementById('tags');
  input.value = document.getElementById('input-tag') as HTMLInputElement;

  if (!tags.value || !input.value) {
    throw new Error('Could not find tags or input elements in the DOM');
  }

  input.value.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const tag = document.createElement('li');
      const tagContent = input.value!.value.trim();

      if (tagContent !== '') {
        tag.innerText = tagContent;
        tag.innerHTML += '<button class="delete-button">X</button>';
        tags.value?.appendChild(tag);
        input.value!.value = '';
      }
    }
  });

  tags.value.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('delete-button')) {
      const parent = target.parentNode as HTMLElement;
      parent.removeChild(target); // remove the button itself
      parent.remove(); // remove the whole tag
    }
  });
});
  </script>
  
  

<style scoped>
#category{
  min-width: 150px;
}
h3{
  margin-top: 20px;
}
.description{
  height: 100px;
  resize:none
}
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100%;
  margin-top: 40px;
}
#image{
    width: 320px;
    height: 200px;
}
#header {
  font-size: 3rem;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.button-container {
  margin-top: 10px;
  display: grid;
  grid-template-rows: 1fr;
  grid-gap: 5px;
}

.additional-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  width: 100%;
}

.submit-button,
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

.submit-button:hover,
.additional-button:hover {
  background-color: #333;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
form{
  width: 470px;
}
</style>