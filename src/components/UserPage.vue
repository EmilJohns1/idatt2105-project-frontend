<template>
  <div class="user-page">
    <Card class="profile-section">
      <h2>Your profile</h2>
      <div class="profile-info">
        <img :src="user.profilePicture" alt="Profile Picture" class="profile-picture" />
        <p class="email">{{ user.email }}</p>
      </div>
    </Card>

    <div class="quizzes-recent-activity">
      <Card class="quizzes-section">
        <h3>Your quizzes</h3>
        <input type="text" v-model="searchQuery" placeholder="Search quizzes" class="search-input" />
        <ul class="quiz-list">
          <li v-for="quiz in user.quizzes" :key="quiz.id" class="quiz-item">{{ quiz.name }}</li>
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
import Card from '@/components/Card.vue'; // Import the Card component

export default {
  name: 'UserPage',
  components: {
    Card, // Register the Card component
  },
  data() {
    return {
      user: {
        profilePicture: '/path/to/profile-picture.jpg',
        email: 'user@example.com',
        quizzes: [
          { id: 1, name: 'Quiz 1' },
          { id: 2, name: 'Quiz 2' },
          // Add more quizzes as needed
        ],
        recentActivity: [
          { id: 1, quizName: 'Quiz 1', date: '2024-03-27' },
          { id: 2, quizName: 'Quiz 2', date: '2024-03-26' },
          // Add more recent activity entries as needed
        ],
      },
      searchQuery: '',
    };
  },
};
</script>

<style scoped>
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
}

.email {
  font-size: 16px;
}

.quizzes-recent-activity {
  display: flex;
  gap: 20px;
}

.quizzes-section, .recent-activity-section {
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
</style>
