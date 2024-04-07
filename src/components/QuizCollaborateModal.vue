<template>
  <div class="modal">
    <div class="modal-content">
      <span class="close" @click="close">&times;</span>
      <h2 id="header">Edit collaborators</h2>
      <div class="collaborate-section">
        <div class="add-user-section">
          <h3 id="header2">Add User to Quiz</h3>
          <input type="text" v-model="username" placeholder="Enter username" />
          <button class="button-class" @click="addToQuiz">Add User</button>
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
      <button class="collaborate-button" @click="shareQuiz">Collaborate on Quiz!</button>
    </div>
    <ComponentPopup
      v-if="showErrorPopup"
      :error-message="popupMessage"
      :font-color="fontColor"
      @popup-closed="hideErrorPopup"
    />
  </div>
</template>

<script setup lang="ts">
import ComponentPopup from '@/components/ComponentPopup.vue'
import { defineProps, ref, onMounted } from 'vue'
import { getUserByUsername } from '@/api/userHooks'
import { addUserToQuiz, getUsersByQuizId, deleteUserFromQuiz } from '@/api/quizHooks'
import { useUserStore } from '@/stores/userStore'

const props = defineProps({
  quizId: Number
})

const username = ref('')
const collaborators = ref<{ id: number; username: string }[]>([])
const showErrorPopup = ref(false)
const popupMessage = ref('')
const fontColor = ref('')
const userStore = useUserStore()

const emit = defineEmits<{
  (e: 'close'): void
}>()

/**
 * Emit the 'close' event.
 */
const close = () => {
  emit('close')
}

/**
 * Add a user to the quiz as a collaborator.
 */
const addToQuiz = async () => {
  if (
    username.value === '' ||
    username.value === userStore.getUserName ||
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
  popupMessage.value = `User added successfully!`
  showErrorPopup.value = true
  fontColor.value = 'green'

  fetchCollaborators()
  username.value = ''
}

/**
 * Fetch the list of collaborators for the quiz.
 */
const fetchCollaborators = async () => {
  const username = userStore.getUserName || ''
  const fetchedCollaborators = await getUsersByQuizId(props.quizId ?? 0)
  if (fetchedCollaborators !== null) {
    collaborators.value = fetchedCollaborators
      .filter((collaborator) => collaborator.username !== username) // Filter out the session username
      .map((collaborator) => ({ id: collaborator.id, username: collaborator.username }))
  }
}

/**
 * Share the quiz link by copying it to the clipboard.
 */
const shareQuiz = () => {
  const url = window.location.href
  navigator.clipboard
    .writeText(url)
    .then(() => {
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

/**
 * Delete a collaborator from the quiz.
 * @param userId - The ID of the user to be deleted.
 */
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

/**
 * Hide the error popup.
 */
const hideErrorPopup = () => {
  showErrorPopup.value = false
}

onMounted(() => {
  fetchCollaborators()
})
</script>

<style scoped>
#header {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

#header2 {
  margin-bottom: 10px;
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 99999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8);
}

.modal-content {
  background-color: #fefefe;
  border: 1px solid #888;
  border-radius: 8px;
  padding: 20px;
  max-width: 80%;
  width: 500px; /* Change the width as needed */
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
  flex-direction: column;
  gap: 20px;
}

.add-user-section,
.collaborators-section {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
}

.add-user-section h3,
.collaborators-section h3 {
  margin-top: 0;
}

.add-user-section input[type='text'] {
  width: calc(100% - 80px);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.add-user-section button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.add-user-section button:hover {
  background-color: #0056b3;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.collaborators-section ul {
  padding: 0;
  margin: 0;
}

.collaborators-section li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.collaborators-section li:last-child {
  border-bottom: none;
}

.collaborators-section button {
  padding: 5px 10px;
  border-radius: 50%;
  background-color: #ff0000;
  color: #fff;
  border: none;
  cursor: pointer;
}

.collaborators-section button:hover {
  background-color: #cc0000;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button-wrapper button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
}

.button-wrapper button:hover {
  background-color: #0056b3;
}

.button-class {
  margin-top: 10px;
}

.collaborate-button {
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  margin-top: 10px;
}

.collaborate-button:hover {
  background-color: #0056b3;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

@media screen and (max-width: 600px) {
  .modal-content {
    width: 90%;
  }
}

@media screen and (max-width: 400px) {
  .modal-content {
    width: 95%;
  }
}
</style>
