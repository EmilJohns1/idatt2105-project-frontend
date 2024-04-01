<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2 id="header">Edit collaborators</h2>
      <div class="collaborate-section">
        <div class="add-user-section">
          <h3>Add User to Quiz</h3>
          <input type="text" v-model="username" placeholder="Enter username" />
          <button @click="addToQuiz">Add User</button>
        </div>
        <div class="collaborators-section">
          <h3>Collaborators</h3>
          <ul>
            <li v-for="collaborator in collaborators" :key="collaborator.id">
              {{ collaborator.username }}
              <button @click="deleteCollaborator(collaborator.id)">X</button>
            </li>
          </ul>
        </div>
      </div>
      <button @click="shareQuiz">Collaborate on Quiz!</button>
    </div>
    <Popup
      v-if="showErrorPopup"
      :error-message="popupMessage"
      :font-color="fontColor"
      @popup-closed="hideErrorPopup"
    />
  </div>
</template>

<script setup lang="ts">
import Popup from '@/components/Popup.vue'
import { defineProps, ref, onMounted } from 'vue'
import { getUserByUsername } from '@/api/userHooks'
import { addUserToQuiz, getUsersByQuizId, deleteUserFromQuiz } from '@/api/quizHooks'

const props = defineProps({
  quizId: Number
})

const username = ref('')
const collaborators = ref<{ id: number; username: string }[]>([])
const showErrorPopup = ref(false)
const popupMessage = ref('')
const fontColor = ref('')

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => {
  emit('close')
}

const addToQuiz = async () => {
  if (
    username.value === '' ||
    username.value === sessionStorage.getItem('user') ||
    collaborators.value.some((collaborator) => collaborator.username === username.value)
  ) {
    popupMessage.value = 'Please enter a valid username'
    showErrorPopup.value = true
    fontColor.value = 'red'
    return
  }
  const user = await getUserByUsername(username.value)
  if (!user) {
    popupMessage.value = "This user doesn't exist"
    showErrorPopup.value = true
    fontColor.value = 'red'
    return
  }

  if (collaborators.value.length >= 5) {
    popupMessage.value = "You can't add more than 5 collaborators"
    showErrorPopup.value = true
    fontColor.value = 'red'
    return
  }

  await addUserToQuiz(props.quizId ?? 0, user.id)

  fetchCollaborators()
  username.value = ''
}

const fetchCollaborators = async () => {
  const sessionUsername = sessionStorage.getItem('user') || '' // Get the username from sessionStorage
  const fetchedCollaborators = await getUsersByQuizId(props.quizId ?? 0)
  if (fetchedCollaborators !== null) {
    collaborators.value = fetchedCollaborators
      .filter((collaborator) => collaborator.username !== sessionUsername) // Filter out the session username
      .map((collaborator) => ({ id: collaborator.id, username: collaborator.username }))
  }
}

const shareQuiz = () => {
  const url = window.location.href
  navigator.clipboard
    .writeText(url)
    .then(() => {
      console.log('URL copied to clipboard:', url)
      popupMessage.value = `Link Copied! Send the link to your friends to collaborate!`
      showErrorPopup.value = true
      fontColor.value = 'green'
    })
    .catch((error) => {
      console.error('Failed to copy URL to clipboard:', error)
      popupMessage.value = 'Failed to copy URL to clipboard'
      showErrorPopup.value = true
      fontColor.value = 'red'
    })
}

const deleteCollaborator = async (userId: number) => {
  const confirmed = confirm('Are you sure you want to delete this collaborator?')
  if (confirmed) {
    await deleteUserFromQuiz(props.quizId ?? 0, userId)
    fetchCollaborators()
    popupMessage.value = `Collaborator deleted successfully!`
    showErrorPopup.value = true
    fontColor.value = 'green'
  } else {
    popupMessage.value = `Collaborator deletion cancelled`
    showErrorPopup.value = true
    fontColor.value = 'red'
  }
}

const hideErrorPopup = () => {
  showErrorPopup.value = false
}

onMounted(() => {
  fetchCollaborators()
  console.log('mounted')
})
</script>

<style scoped>
#header {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 99999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.8);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 50%;
  border-radius: 8px;
  padding-bottom: 5%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.collaborate-section {
  display: flex;
  justify-content: space-between;
}

.add-user-section {
  width: 45%;
}

.collaborators-section {
  width: 45%;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
