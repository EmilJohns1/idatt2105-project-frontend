<template>
  <div class="user-page">
    <Card class="profile-section">
      <h2 id="header">Your profile</h2>
      <div class="profile-info">
        <img :src="user.profilePicture" alt="Profile Picture" class="profile-picture" />
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
        <h3>Your quizzes</h3>
        <input type="text" v-model="searchQuery" placeholder="Search quizzes" class="search-input" />
        <ul class="quiz-list">
          <QuizCard id="quiz-card" v-for="quiz in user.quizzes" :key="quiz.id" :quiz="quiz" />
        </ul>
      </Card>

      <Card class="recent-activity-section">
        <h3>Recent activity</h3>
        <ul class="activity-list">
          <li v-for="attempt in user.recentActivity" :key="attempt.id" class="activity-item">
            {{ attempt.quizName }} - {{ attempt.date }}
          </li>
        </ul>
      </Card>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card.vue';
import QuizCard from '@/components/QuizCard.vue';
import { ref } from 'vue';
import { getUserByUsername, getQuizzesByUserId, uploadFile, updateProfilePicture } from '@/api/userHooks';


export default {
  name: 'UserPage',
  components: {
    Card, // Register the Card component
    QuizCard, // Register the QuizCard component
  },
  data() {
    return {
      user: {
        profilePicture: null,
        email: '',
        quizzes: [
          { id: 1, name: 'Quiz 1', imageUrl: 'quiz1.jpg' },
          { id: 2, name: 'Quiz 2', imageUrl: 'quiz2.jpg' },
          // Add more quizzes as needed
        ],
        recentActivity: [
          { id: 1, quizName: 'Quiz 1', date: '2024-03-27' },
          { id: 2, quizName: 'Quiz 2', date: '2024-03-26' },
          // Add more recent activity entries as needed
        ],
      },
      searchQuery: '',
      file: null,
    };
  },
  async mounted() {
    const username = sessionStorage.getItem('user')
    if (username) {
      try {
        // Get user by username
        const userData = await getUserByUsername(username)
        if (userData) {
          this.user.profilePicture = userData.profilePictureUrl
          this.user.email = userData.username
          // Get quizzes by user ID
          const quizzesData = await getQuizzesByUserId(userData.id)
          console.log(quizzesData)
          if (quizzesData) {
            this.user.quizzes = quizzesData.map(quiz => ({
              id: quiz.id,
              name: quiz.title, // Assuming the quiz title corresponds to its name
              imageUrl: quiz.quizPictureUrl // Assuming the quiz picture URL is provided
            }))
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
  },
  methods: {
    handleFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadProfilePicture() {
      if (this.file) {
        try {
          const imageUrl = await uploadFile(this.file);
          console.log('Uploaded profile picture:', imageUrl);

          const success = await updateProfilePicture(this.user.email, imageUrl); 
          if (success) {
            // Update the profile picture directly with the returned image URL
            this.user.profilePicture = imageUrl;
            console.log('Profile picture updated successfully.');
          } else {
            console.error('Failed to update profile picture.');
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
        }
      } else {
        console.warn('No file selected.');
      }
    },
  },
};
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
  padding-bottom: 20px;
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
  display: flex;
  gap: 20px;
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

.quiz-list, .activity-list {
  list-style: none;
  padding: 0;
}

.quiz-item, .activity-item {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}

.quiz-item:hover, .activity-item:hover {
  background-color: #f0f0f0;
}

.file-input-container {
  margin-top: 10px; /* Adjust as needed */
  display: flex;
  flex-direction: column;
  align-items: start;
}

.file-input-container input[type="file"] {
  margin-bottom: 5px;
}
</style>
