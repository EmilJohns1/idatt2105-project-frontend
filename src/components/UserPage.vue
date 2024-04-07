<template>
  <div class="user-page">
    <Card class="profile-section">
      <h2 id="header">Your profile</h2>
      <div class="profile-info">
        <img
          :src="user.profilePicture ? user.profilePicture : defaultProfilePicture"
          alt="Profile Picture"
          class="profile-picture"
        />
        <div>
          <p class="email">{{ user.email }}</p>
          <div class="file-input-container">
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              @change="validateImageSize($event)"
            />
            <button @click="uploadProfilePicture">Edit Profile Picture</button>
          </div>
        </div>
      </div>
    </Card>
    <div class="quizzes-recent-activity">
      <Card class="quizzes-section">
        <h2 id="header">Your quizzes</h2>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search quizzes"
          class="search-input"
        />
        <ul class="quiz-list">
          <RouterLink
            v-for="quiz in filteredQuizzesSection"
            :key="quiz.id"
            :to="`/quiz/${quiz.id}-${quiz.title.toLowerCase().replace(/ /g, '-')}/edit`"
            class="router-link-hidden"
          >
            <ImageCard class="quiz-section-card" :quiz="quiz" :item="quiz" />
          </RouterLink>
        </ul>
      </Card>
      <Card class="recent-activity-section">
        <h2 id="header">Recent activity</h2>
        <ul class="activity-list">
          <RouterLink
            class="activity-router"
            v-for="attempt in user.recentActivity"
            :key="attempt.id"
            :to="`/quiz/${attempt.quizId}-${attempt.quizName}/attempt/${attempt.id}`"
          >
            <li class="activity-link">{{ attempt.quizName }} - {{ attempt.date }}</li>
          </RouterLink>
        </ul>
      </Card>
    </div>
    <Card class="comment-card">
      <h2 id="header">Your comments</h2>
      <div class="quizzes-comments-container">
        <div v-if="currentQuizId !== null" class="comment-grid">
          <ImageCard
            class="comments-card"
            v-for="quiz in filteredQuizzes"
            :key="quiz.id"
            :quiz="quiz"
            :item="quiz"
            @selectQuiz="currentQuizId = $event"
          />
          <div class="comment-and-button-container">
            <!-- Display comments for the current quiz -->
            <Card class="comments-card">
              <h3>Comments for Quiz {{ currentQuizId }}</h3>
              <ul v-if="currentQuiz">
                <li v-for="comment in quizComments[currentQuiz.id]" :key="comment.id">
                  <p id="comment-content">{{ comment.content }}</p>
                  <p>Created: {{ formatDate(comment.creationDate) }}</p>
                  <p>Last Modified: {{ formatDate(comment.lastModifiedDate) }}</p>
                </li>
              </ul>
              <p v-else>No quiz selected.</p>
            </Card>
            <div class="button-container">
              <button @click="navigateToPreviousQuiz" class="previous-quiz-button">
                <icon class="icon" name="angle-left"></icon>
              </button>
              <button @click="navigateToNextQuiz" class="next-quiz-button">
                <icon class="icon" name="angle-right"></icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
    <Calendar class="calendar-card" v-if="user.id" :id="user.id" />
  </div>
</template>

<script setup lang="ts">
import Calendar from '@/components/Calendar.vue'
import Card from '@/components/Card.vue'
import ImageCard from '@/components/ImageCard.vue'
import { format } from 'date-fns'
import { ref, onMounted, computed, watch, type Ref } from 'vue'
import { getCommentsByUserId } from '@/api/commentHooks'
import { getQuizByQuizId } from '@/api/quizHooks'
import { getUserByUsername, getQuizzesByUserId, updateProfilePicture } from '@/api/userHooks'
import { uploadFile, deletePicture } from '@/api/imageHooks'
import { useUserStore } from '@/stores/userStore'
import { getAttemptsByUserId } from '@/api/attemptHooks'

interface User {
  id: number | null
  profilePicture: string | null
  email: string
  quizzes: Quiz[]
  recentActivity: Activity[]
}

interface Quiz {
  id: number
  title: string
  quizPictureUrl: string
}

interface Activity {
  id: number
  quizId: number
  quizName: string
  date: string
}

interface Attempt {
  id: string
  title: string
  quizId: string
  attemptTime: string
}

const user: Ref<User> = ref({
  id: null,
  profilePicture: null,
  email: '',
  quizzes: [],
  recentActivity: []
})
const searchQuery = ref('')
const file = ref<File | null>(null) // Define file type
const currentQuizId = ref<string | null>(null) // Define currentQuizId type
const quizComments = ref<{ [key: number]: Comment[] }>({}) // Define quizComments type
const fetchedQuizzes = ref<Quiz[]>([]) // Define fetchedQuizzes type
const currentQuiz = ref<Quiz | null>(null) // Define currentQuiz type
const defaultProfilePicture = '/default_pfp.svg.png'

interface Comment {
  id: number
  content: string
  creationDate: string
  lastModifiedDate: string
}

/**
 * Fetch user data from the API and update the user ref.
 */
const fetchUserData = async () => {
  const userStore = useUserStore()
  const username = userStore.getUserName
  if (username) {
    try {
      const userData = await getUserByUsername(username)
      if (userData) {
        user.value.id = userData.id
        user.value.profilePicture = userData.profilePictureUrl
        user.value.email = userData.username
        const quizzesData = await getQuizzesByUserId(userData.id)
        if (quizzesData) {
          user.value.quizzes = quizzesData.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            quizPictureUrl: quiz.quizPictureUrl
          }))
          await fetchQuizComments()
        } else {
          console.error('Failed to fetch quizzes for the user:', userData.username)
        }
      } else {
        console.error('Failed to fetch user data for username:', username)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
}

/**
 * Fetch recent activity for the user from the API and update the user ref.
 */
const fetchRecentActivity = async () => {
  if (user.value.id) {
    const recentActivityData = await getAttemptsByUserId(user.value.id, 10, 0)
    if (recentActivityData) {
      user.value.recentActivity = recentActivityData.content
        .map((attempt: Attempt) => {
          if (!attempt.attemptTime) {
            return null
          }
          const [datePart, timePart] = attempt.attemptTime.split('T')
          const [year, month, day] = datePart.split('-')
          const [hourMinuteSecond] = timePart.split('.')
          const [hour, minute, second] = hourMinuteSecond.split(':')
          const attemptDate = new Date(
            Number(year),
            Number(month) - 1,
            Number(day),
            Number(hour),
            Number(minute),
            Number(second)
          )
          const formattedDate = `${('0' + attemptDate.getHours()).slice(-2)}:${('0' + attemptDate.getMinutes()).slice(-2)} ${('0' + attemptDate.getDate()).slice(-2)}/${('0' + (attemptDate.getMonth() + 1)).slice(-2)}/${attemptDate.getFullYear()}`

          return {
            id: attempt.id,
            quizName: attempt.title,
            quizId: attempt.quizId,
            date: formattedDate
          }
        })
        .filter(Boolean) as Activity[]
    }
  }
}

/**
 * Uploads a new profile picture for the user.
 */
const uploadProfilePicture = async (): Promise<void> => {
  if (file.value) {
    try {
      // Check if the user already has a profile picture
      if (user.value.profilePicture) {
        const modifiedProfilePictureUrl = user.value.profilePicture.replace(
          'https://',
          'https://quiz-project-fullstack.'
        )

        const deleteSuccess = await deletePicture(modifiedProfilePictureUrl)

        if (!deleteSuccess) {
          console.error('Failed to delete current profile picture.')
          return
        }
      }

      // Upload the new profile picture
      const imageUrl: string | null = await uploadFile(file.value)

      if (imageUrl) {
        // Update the user's profile picture URL
        const success: boolean = await updateProfilePicture(user.value.email, imageUrl)
        if (success) {
          user.value.profilePicture = imageUrl
          window.location.reload()
        } else {
          console.error('Failed to update profile picture.')
        }
      } else {
        console.error('Failed to upload profile picture: Image URL is null.')
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error)
    }
  } else {
    console.warn('No file selected.')
  }
}

/**
 * Validates the size of the selected image file.
 * @param event - The input event containing the selected file.
 */
const validateImageSize = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0]
  if (selectedFile) {
    const fileSize = selectedFile.size / 1024 // Convert to KB
    const maxSizeKB = 1024 // Max size in KB (1 MB)
    if (fileSize > maxSizeKB) {
      // Show an alert if file size exceeds the maximum limit
      window.alert('File size exceeds the maximum limit. Maximum 1 MB allowed.')
      // Reset the file input to clear the selected file
      target.value = ''
    } else {
      // Update the file variable with the selected file
      file.value = selectedFile
    }
  }
}

/**
 * Formats a date string using date-fns library.
 * @param dateString - The date string to format.
 * @returns The formatted date string.
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'MMMM dd, yyyy HH:mm:ss')
}

/**
 * Fetches comments for the user's quizzes from the API and updates the quizComments ref.
 */
const fetchQuizComments = async (): Promise<void> => {
  if (user.value.id) {
    try {
      const fetchedComments = await getCommentsByUserId(user.value.id)
      if (fetchedComments) {
        // Clear the existing quiz comments
        quizComments.value = {}

        fetchedComments.forEach((comment) => {
          if (!quizComments.value[comment.quizId]) {
            quizComments.value[comment.quizId] = []
          }
          quizComments.value[comment.quizId].push(comment)
        })
        const firstQuizWithComments = Object.keys(quizComments.value)[0]
        if (firstQuizWithComments) {
          currentQuizId.value = firstQuizWithComments
        }
      } else {
        console.error('Failed to fetch comments for the user:', user.value.email)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  } else {
    console.warn('User ID not available.')
  }
}

/**
 * Navigates to the next quiz based on the currentQuizId ref.
 */
const navigateToNextQuiz = (): void => {
  if (currentQuizId.value !== null) {
    const quizIds = Object.keys(quizComments.value)
    const currentIndex = quizIds.indexOf(currentQuizId.value)
    const nextIndex = (currentIndex + 1) % quizIds.length
    currentQuizId.value = quizIds[nextIndex]
  }
}

/**
 * Navigates to the previous quiz based on the currentQuizId ref.
 */
const navigateToPreviousQuiz = (): void => {
  if (currentQuizId.value !== null) {
    const quizIds = Object.keys(quizComments.value)
    const currentIndex = quizIds.indexOf(currentQuizId.value)
    const previousIndex = (currentIndex - 1 + quizIds.length) % quizIds.length
    currentQuizId.value = quizIds[previousIndex]
  }
}

/**
 * Fetches quizzes with comments from the API and updates the fetchedQuizzes ref.
 */
const fetchQuizzesWithComments = async (): Promise<void> => {
  const quizzesToFetch: Set<number> = new Set()

  for (const quizId in quizComments.value) {
    quizzesToFetch.add(parseInt(quizId))
  }

  const fetchedQuizzesData: Quiz[] = []
  for (const quizId of quizzesToFetch) {
    const quiz = await getQuizByQuizId(quizId)
    if (quiz) {
      fetchedQuizzesData.push(quiz)
    }
  }

  fetchedQuizzes.value = [...fetchedQuizzesData]
}

// Define the computed property to return the fetched quizzes
const quizzesWithComments = computed(() => fetchedQuizzes.value)

// Watch for changes in currentQuizId and quizzesWithComments to update currentQuiz
watch([currentQuizId, quizzesWithComments], ([newCurrentQuizId, newQuizzesWithComments]) => {
  if (newCurrentQuizId !== null) {
    const foundQuiz = newQuizzesWithComments.find((quiz) => quiz.id === parseInt(newCurrentQuizId))

    currentQuiz.value = foundQuiz !== undefined ? foundQuiz : null
  } else {
    currentQuiz.value = null
  }
})

// Define a computed property to filter quizzesWithComments based on currentQuizId
const filteredQuizzes = computed(() => {
  if (currentQuizId.value !== null) {
    return quizzesWithComments.value.filter(
      (quiz) => quiz.id === (currentQuizId.value ? parseInt(currentQuizId.value) : null)
    )
  } else {
    return []
  }
})

const filteredQuizzesSection = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return user.value.quizzes.filter((quiz) => quiz.title.toLowerCase().includes(query))
})

onMounted(async () => {
  await fetchUserData()
  await fetchRecentActivity()
  await fetchQuizComments()
  await fetchQuizzesWithComments()
})
</script>

<style scoped>
#header {
  font-size: 2rem;
  margin-bottom: 20px;
}

.user-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.profile-section {
  border-bottom: 1px solid #ccc;
  padding: 40px;
  margin-bottom: 20px;
}

.profile-section h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.profile-info {
  display: flex;
  align-items: center;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-right: 20px;
  border: 1px solid #333;
}

.email {
  font-size: 24px;
  font-family: 'Luckiest Guy', cursive;
}

.quizzes-recent-activity {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
  margin-bottom: 60px;
}

.quizzes-section {
  display: grid;
  align-items: center;
  width: 100%;
}

.recent-activity-section {
  flex: 1;
}

h3 {
  font-size: 24px;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  max-width: 300px;
  align-content: center;
  margin-left: auto;
  margin-right: auto;
}

.activity-list {
  list-style: none;
  padding: 0;
}

.activity-link {
  text-decoration: none;
  color: #333;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.activity-router {
  text-decoration: none;
}

.quiz-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.quiz-item,
.activity-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.quiz-item:hover,
.activity-item:hover {
  background-color: #f0f0f0;
}

.file-input-container {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.file-input-container input[type='file'] {
  margin-bottom: 5px;
}

.comment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.comment-and-button-container {
  display: flex;
  align-items: center;
}
.button-container {
  display: flex;
  margin-left: 10px;
  margin-right: -10px;
  gap: 2px;
}

.next-quiz-button,
.previous-quiz-button {
  background: none;
  border: 0.5px solid #ccc;
  border-radius: 5px;
  padding: 5px;
}

.next-quiz-button icon,
.previous-quiz-button icon {
  vertical-align: middle;
}

#comment-content {
  font-size: 16px;
  font-family: 'Luckiest Guy', cursive;
  overflow-wrap: anywhere;
}

.comment-card {
  padding: 40px;
}

.comments-card {
  max-height: 240px;
  min-height: 240px;
  overflow-y: auto;
}

.comments-card:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.quiz-section-card {
  max-width: 300px;
  max-height: 400px;
}

.quiz-card {
  max-width: 300px;
  max-height: 400px;
  border: 2px solid #818181;
  border-radius: 8px;
}

.profile-section {
  margin-top: 40px;
  margin-bottom: 60px;
}

.icon {
  font-size: 24px;
  color: #000000;
}

.calendar-card {
  margin-top: 60px;
  padding: 40px;
}

.router-link-hidden {
  display: block;
  text-decoration: none;
  color: inherit;
}
@media (max-width: 750px) {
  .quizzes-section {
    display: grid;
    align-items: baseline;
    overflow-x: scroll;
    width: 100%;
    padding: 10px;
  }
  .quizzes-recent-activity {
    grid-template-columns: 1fr;
    gap: 20px;
    max-height: 100%;
    margin-bottom: 60px;
  }
  .recent-activity-section {
    height: 300px;
    overflow-y: scroll;
    padding: 10px;
  }
  .quiz-list {
    grid-auto-flow: column;
    padding-left: 0px;
    overflow-x: scroll;
  }
  .quiz-card {
    max-width: 100%;
    width: 200px;
    height: 200px;
  }
  .comment-grid {
    display: grid;
    place-items: center;
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .comments-card {
    width: 80%;
    height: 200px;
    max-height: 80%;
    min-height: 240px;
    overflow-y: auto;
  }
  .comment-and-button-container {
    display: flex;
    align-items: center;
    width: 100%;
    flex-direction: column;
  }
  .profile-section {
    padding: 3px;
  }
  .profile-picture {
    width: 75px;
    height: 75px;
    margin-right: 5px;
  }
  .email {
    font-size: 17px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .comment-card {
    padding: 10px;
  }
  .calendar-card {
    padding: 10px;
  }
  .user-page {
    padding: 0px;
  }
}
</style>
