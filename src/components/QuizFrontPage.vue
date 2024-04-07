<template>
  <div class="frontpage-container">
    <div class="quiz" v-if="quiz">
      <div class="category">Category: {{ quiz.categoryName }}</div>
      <div class="quiz-header">
        <section class="header-section">
          <div class="content-area">
            <div class="quiz-image">
              <img
                :src="quiz.quizPictureUrl ? quiz.quizPictureUrl : defaultPicture"
                alt="Quiz Image"
                class="quiz-image"
              />
            </div>
            <div class="separator"></div>
            <div class="details">
              <div class="quizText">
                <h2 id="header2">{{ quiz.title }}</h2>
                <p class="description">{{ quiz.description }}</p>
              </div>
              <div class="author">
                <img
                  :src="author.profilePictureUrl ? author.profilePictureUrl : defaultProfilePicture"
                  alt="Author Image"
                  class="author-image"
                />
                <span>Author: {{ author.username ? author.username : 'Unknown' }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="last-modified-and-tags">
        <div class="last-modified">Last Modified: {{ formatLastModifiedDateHeader() }}</div>
        <div class="tags">
          <span v-for="(tag, index) in quiz.tags" :key="index" class="tag">{{ tag.tagName }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <div class="start-quiz-button">
      <button class="start-button" @click="startQuiz">Start Quiz!</button>
    </div>
    <div class="card-container questions" v-if="questions">
      <h3>Questions:</h3>
      <Card v-for="(question, index) in questions" :key="index" class="card">
        <div class="question">
          <p>{{ question.questionText }}</p>
        </div>
      </Card>
    </div>
    <div class="card-container comments">
      <h3>Comments:</h3>
      <Card v-for="(comment, index) in comments" :key="index">
        <div class="comment-grid">
          <div class="author-info">
            <img
              :src="
                comment.user && comment.user.profilePictureUrl
                  ? comment.user.profilePictureUrl
                  : defaultProfilePicture
              "
              alt="Author Image"
              class="comment-image"
            />
            <span class="author-name">{{
              comment.user && comment.user.username ? comment.user.username : 'Unknown'
            }}</span>
          </div>
          <div class="last-modified">
            Last Modified: {{ formatLastModifiedDateComment(comment.lastModifiedDate) }}
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </Card>
      <div class="pagination" v-if="comments.totalPages">
        <button @click="fetchComments(comments.number - 1)" :disabled="comments.number === 0">
          Previous
        </button>
        <span>{{ comments.number + 1 }} / {{ comments.totalPages }}</span>
        <button
          @click="fetchComments(comments.number + 1)"
          :disabled="comments.number === comments.totalPages - 1"
        >
          Next
        </button>
      </div>
      <div class="comment-post-section" v-if="userStore.getIsLoggedIn">
        <h4>Post a Comment:</h4>
        <textarea
          v-model="newComment"
          rows="4"
          cols="50"
          class="comment-input"
          maxlength="255"
        ></textarea>
        <button @click="postComment" class="post-button">Post</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { ref, onMounted, defineEmits } from 'vue'
import { getAllQuestionsByQuizId } from '@/api/questionHooks'
import { getQuizByQuizId } from '@/api/quizHooks'
import { getUserByUserId, getUserByUsername } from '@/api/userHooks'
import { getCommentsByQuizId, addCommentToQuiz } from '@/api/commentHooks'
import { useUserStore } from '@/stores/userStore'
import { format } from 'date-fns'

const props = defineProps<{
  quizId: number
}>()

const quiz = ref<any>(null)
const defaultPicture = '/default.jpg'
const defaultProfilePicture = '/default_pfp.svg.png'
const author = ref<any>(null)
const questions = ref<any[]>([])
const comments = ref<any>({
  content: [],
  number: 0,
  totalPages: 0
})
const userStore = useUserStore()
const newComment = ref<string>('')

interface Comment {
  id: number
  content: string
  creationDate: string
  lastModifiedDate: string
  quizId: number
  userId: number
  user: User
}

interface User {
  id: number
  username: string
  profilePictureUrl: string
}

const emit = defineEmits<{
  (e: 'start-quiz'): void
}>()

/**
 * Emit a 'start-quiz' event.
 */
const startQuiz = () => {
  emit('start-quiz')
}

/**
 * Fetch quiz data based on the provided quizId prop.
 */
const fetchQuiz = async () => {
  const quizData = await getQuizByQuizId(props.quizId)
  if (quizData) {
    quiz.value = quizData
  }
}

/**
 * Fetch the author's data using the authorId from the quiz data.
 */
const fetchAuthor = async () => {
  if (quiz.value && quiz.value.authorId) {
    const authorData = await getUserByUserId(quiz.value.authorId)
    if (authorData) {
      author.value = authorData
    }
  }
}

/**
 * Fetch questions related to the quiz.
 */
const fetchQuestions = async () => {
  const questionsData = await getAllQuestionsByQuizId(props.quizId)
  if (questionsData) {
    questions.value = questionsData
  }
}

/**
 * Fetch comments related to the quiz.
 * @param page - The page number for pagination.
 */
const fetchComments = async (page: number) => {
  const size = 10
  const sort = ['lastModifiedDate,desc']
  const pagination = {
    page,
    size,
    sort
  }
  const response = await getCommentsByQuizId(props.quizId, pagination)
  if (response) {
    // @ts-ignore
    const commentsData: any[] = response.content
    for (const comment of commentsData) {
      const user = await getUserByUserId(comment.userId)
      if (user) {
        comment.user = user
      }
    }
    // @ts-ignore
    comments.value = commentsData as Comment[]
    // @ts-ignore
    comments.value.totalPages = parseInt(response.totalPages, 10)
    // @ts-ignore
    comments.value.number = parseInt(response.number, 10)
  }
}

onMounted(async () => {
  await fetchQuiz()
  await fetchAuthor()
  await fetchQuestions()
  await fetchComments(0)
})

/**
 * Post a new comment for the quiz.
 */
const postComment = async () => {
  if (newComment.value.trim() === '') {
    return
  }
  const username = userStore.getUserName
  if (!username) {
    return
  }
  const user = await getUserByUsername(username)
  if (!user) {
    return
  }
  const commentData = {
    content: newComment.value,
    userId: user.id,
    quizId: props.quizId
  }
  try {
    await addCommentToQuiz(commentData)

    await fetchComments(comments.value.number)

    newComment.value = ''
  } catch (error) {
    console.error('Error adding comment:', error)
    window.location.reload()
  }
}

/**
 * Format the last modified date of a comment.
 * @param dateString - The date string to format.
 * @returns Formatted date string.
 */
const formatLastModifiedDateComment = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

/**
 * Format the last modified date of the quiz.
 * @returns Formatted date string.
 */
const formatLastModifiedDateHeader = (): string => {
  if (quiz.value && quiz.value.lastModifiedDate) {
    const date = new Date(quiz.value.lastModifiedDate)
    return format(date, 'MMMM dd, yyyy')
  }
  return ''
}
</script>

<style scoped>
.frontpage-container {
  display: grid;
  place-items: center;
  width: 50%;
  max-width: 100%;
  margin: 0 auto;
  padding: 1.5rem 2rem 1rem 2rem;
}

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

.category {
  font-size: 14px;
  padding-bottom: 0.25rem;
  padding-top: 0.5rem;
  font-weight: 500;
}

.tags {
  font-size: 1rem;
  padding-bottom: 1rem;
  text-align: end;
  max-width: fit-content;
}

.tag {
  background-color: #f0f0f0;
  border-radius: 4px;
  padding: 4px 8px;
  margin-right: 4px;
  font-size: 12px;
}

.quiz {
  width: -webkit-fill-available;
}

.quiz-header {
  display: flex;
  justify-content: start;
  gap: 20px;
  background-color: #fff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.quizText {
  max-height: 200px;
  overflow-y: auto;
}

.header-section {
  display: flex;
  flex-direction: row;
  align-items: center;
}

#header2{
  overflow-wrap: anywhere;
}

.content-area {
  display: flex;
  flex-direction: row;
  align-items: end;
}

.quiz-image img {
  max-height: 175px;
  width: auto;
  margin-right: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.separator {
  height: 200px;
  width: 1px;
  background-color: #ccc;
  margin-left: 10px;
  margin-right: 30px;
}

.details {
  flex-grow: 1;
}

.author-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 0.5rem;
  vertical-align: text-bottom;
  border: 1px solid #333;
}

.last-modified {
  font-size: 14px;
  text-align: start;
  max-width: fit-content;
}

.last-modified-and-tags {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 0.25rem;
}

.card-container {
  margin-top: 2rem;
  width: -webkit-fill-available;
  justify-self: flex-start;
}

.card-container h3 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card-container p {
  font-size: 1.2rem;
  overflow-wrap: anywhere;
}

.description {
  overflow-wrap: anywhere;
}

.card {
  padding: 0.75rem;
  margin: 0rem;
  margin-bottom: 0.5rem;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  background-color: #c9c9c9;
}

.pagination {
  margin-top: 1rem;
}

.comment-post-section {
  margin-top: 2rem;
  margin-bottom: 4rem;
}

.comment-input {
  max-width: max-content;
  max-height: 200px; /* Set your desired max height */
  overflow-y: auto; /* Enable vertical scrollbar if content exceeds max height */
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.post-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-left: 1rem;
}

.post-button:hover {
  background-color: #0056b3;
}

.comment-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid #333;
}

.comment-grid {
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto;
  gap: 10px;
  justify-content: start;
}

.author-info {
  grid-row: 1;
  grid-column: 1;
  width: fit-content;
}

.last-modified {
  grid-row: 2;
  grid-column: 1;
}

.comment-content {
  grid-row: span 2;
  grid-column: 2;
  border-left: 1px solid #ccc;
  padding-left: 0.75rem;
}

.start-quiz-button {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.start-button {
  padding: 10px 20px;
  font-size: 1.5rem;
  background-color: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.start-button:hover {
  background-color: darkgreen;
}
@media (max-width: 850px) {
  .quiz-header {
    max-height: 600px;
    display: flex;
    justify-content: start;
    gap: 20px;
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  .content-area {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .separator {
    display: none;
  }
  .quizText {
    width: 100%;
  }
  .frontpage-container {
    width: 100%;
    padding: 5px;
  }
  .quiz-image img {
    max-height: 150px;
  }
}
</style>
