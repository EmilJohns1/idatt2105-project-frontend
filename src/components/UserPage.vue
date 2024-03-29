<template>
  <div class="user-page">
    <Card class="profile-section">
      <h2 id="header">Your profile</h2>
      <div class="profile-info">
        <img :src="user.profilePicture ?? ''" alt="Profile Picture" class="profile-picture" />
        <div>
          <p class="email">{{ user.email }}</p>
          <div class="file-input-container">
            <input type="file" @change="handleFileChange" accept="image/*" />
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
          <QuizCard
            class="quiz-section-card"
            v-for="quiz in user.quizzes"
            :key="quiz.id"
            :quiz="quiz"
          />
        </ul>
      </Card>
      <Card class="recent-activity-section">
        <h2 id="header">Recent activity</h2>
        <ul class="activity-list">
          <li v-for="attempt in user.recentActivity" :key="attempt.id" class="activity-item">
            {{ attempt.quizName }} - {{ attempt.date }}
          </li>
        </ul>
      </Card>
    </div>
    <Card>
      <h2 id="header">Your comments</h2>
      <div class="quizzes-comments-container">
        <div v-if="currentQuizId !== null" class="comment-grid">
          <QuizCard
            class="quiz-card"
            v-for="quiz in filteredQuizzes"
            :key="quiz.id"
            :quiz="quiz"
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
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import QuizCard from '@/components/QuizCard.vue'
import { format } from 'date-fns'
import { ref, onMounted, computed, watch, type Ref } from 'vue'
import { getCommentsByUserId } from '@/api/commentHooks'
import { getQuizByQuizId } from '@/api/quizHooks'
import {
  getUserByUsername,
  getQuizzesByUserId,
  uploadFile,
  updateProfilePicture
} from '@/api/userHooks'

interface User {
  id: number | null;
  profilePicture: string | null;
  email: string;
  quizzes: Quiz[];
  recentActivity: Activity[];
}

interface Quiz {
  id: number;
  title: string;
  quizPictureUrl: string;
}

interface Activity {
  id: number;
  quizName: string;
  date: string;
}

const user: Ref<User> = ref({
  id: null,
  profilePicture: null,
  email: '',
  quizzes: [],
  recentActivity: [
    { id: 1, quizName: 'Quiz 1', date: '2024-03-27' },
    { id: 2, quizName: 'Quiz 2', date: '2024-03-26' }
  ]
})
const searchQuery = ref('')
const file = ref<File | null>(null) // Define file type
const currentQuizId = ref<string | null>(null); // Define currentQuizId type
const quizComments = ref<{ [key: number]: Comment[] }>({}) // Define quizComments type
const fetchedQuizzes = ref<Quiz[]>([]) // Define fetchedQuizzes type
const currentQuiz = ref<Quiz | null>(null) // Define currentQuiz type

interface Comment {
  id: number;
  content: string;
  creationDate: string;
  lastModifiedDate: string;
}

const fetchUserData = async () => {
  const username = sessionStorage.getItem('user')
  if (username) {
    try {
      const userData = await getUserByUsername(username)
      if (userData) {
        user.value.id = userData.id
        user.value.profilePicture = userData.profilePictureUrl
        user.value.email = userData.username
        console.log('User data:', user.value)
        const quizzesData = await getQuizzesByUserId(userData.id)
        if (quizzesData) {
          user.value.quizzes = quizzesData.map((quiz) => ({
            id: quiz.id,
            title: quiz.title,
            quizPictureUrl: quiz.quizPictureUrl
          }))
          console.log('Quizzes:', user.value.quizzes)
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

const handleFileChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    file.value = target.files[0];
  }
}

const uploadProfilePicture = async (): Promise<void> => {
  if (file.value) {
    try {
      const imageUrl: string | null = await uploadFile(file.value);
      console.log('Uploaded profile picture:', imageUrl);

      if (imageUrl) {
        const success: boolean = await updateProfilePicture(user.value.email, imageUrl);
        if (success) {
          user.value.profilePicture = imageUrl;
          console.log('Profile picture updated successfully.');
        } else {
          console.error('Failed to update profile picture.');
        }
      } else {
        console.error('Failed to upload profile picture: Image URL is null.');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  } else {
    console.warn('No file selected.');
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, 'MMMM dd, yyyy HH:mm:ss')
}

const fetchQuizComments = async (): Promise<void> => {
  if (user.value.id) {
    try {
      const fetchedComments = await getCommentsByUserId(user.value.id)
      console.log('Fetched comments:', fetchedComments)
      if (fetchedComments) {
        // Clear the existing quiz comments
        quizComments.value = {}

        fetchedComments.forEach((comment) => {
          if (!quizComments.value[comment.quizId]) {
            quizComments.value[comment.quizId] = []
          }
          quizComments.value[comment.quizId].push(comment)
        })
        console.log('Quiz comments:', quizComments.value)
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

const navigateToNextQuiz = (): void => {
  if (currentQuizId.value !== null) {
    const quizIds = Object.keys(quizComments.value)
    const currentIndex = quizIds.indexOf(currentQuizId.value)
    const nextIndex = (currentIndex + 1) % quizIds.length
    currentQuizId.value = quizIds[nextIndex]
    console.log('Navigated to next quiz:', currentQuizId.value)
  }
}

const navigateToPreviousQuiz = (): void => {
  if (currentQuizId.value !== null) {
    const quizIds = Object.keys(quizComments.value)
    const currentIndex = quizIds.indexOf(currentQuizId.value)
    const previousIndex = (currentIndex - 1 + quizIds.length) % quizIds.length
    currentQuizId.value = quizIds[previousIndex]
    console.log('Navigated to previous quiz:', currentQuizId.value)
  }
}

const fetchQuizzesWithComments = async (): Promise<void> => {
  const quizzesToFetch: Set<number> = new Set();

  for (const quizId in quizComments.value) {
    quizzesToFetch.add(parseInt(quizId));
  }

  const fetchedQuizzesData: Quiz[] = [];
  for (const quizId of quizzesToFetch) {
    const quiz = await getQuizByQuizId(quizId);
    if (quiz) {
      fetchedQuizzesData.push(quiz);
    }
  }

  fetchedQuizzes.value = [...fetchedQuizzesData];
}

// Define the computed property to return the fetched quizzes
const quizzesWithComments = computed(() => fetchedQuizzes.value)

// Watch for changes in currentQuizId and quizzesWithComments to update currentQuiz
watch([currentQuizId, quizzesWithComments], ([newCurrentQuizId, newQuizzesWithComments]) => {
  if (newCurrentQuizId !== null) {
    const foundQuiz = newQuizzesWithComments.find(
      (quiz) => quiz.id === parseInt(newCurrentQuizId)
    );

    currentQuiz.value = foundQuiz !== undefined ? foundQuiz : null;
  } else {
    currentQuiz.value = null;
  }
});

// Define a computed property to filter quizzesWithComments based on currentQuizId
const filteredQuizzes = computed(() => {
  if (currentQuizId.value !== null) {
    return quizzesWithComments.value.filter((quiz) => quiz.id === (currentQuizId.value ? parseInt(currentQuizId.value) : null))
  } else {
    return []
  }
})

onMounted(async () => {
  await fetchUserData()
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
}

.quiz-list,
.activity-list {
  list-style: none;
  padding: 0;
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
}

.comments-card {
  max-height: 400px;
  min-height: 400px;
  overflow-y: auto;
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
</style>
