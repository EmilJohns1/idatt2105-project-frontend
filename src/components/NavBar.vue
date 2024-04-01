<template>
  <ul class="navbar">
    <li id="logo">QuizApp</li>
    <li><RouterLink to="/explore" class="link">Explore</RouterLink></li>
    <li><RouterLink to="/create" class="link">Create</RouterLink></li>
    <li><RouterLink to="/contact" class="link">Contact</RouterLink></li>
    <li><RouterLink to="/faq" class="link">FAQ</RouterLink></li>
    <li class="profile-pic" v-if="isLoggedIn">
      <RouterLink :to="isLoggedIn ? '/user' : '/login'">
        <img
          :src="profilePicture ? profilePicture : defaultProfilePicture"
          class="profile-picture"
          alt="Profile"
        />
      </RouterLink>
    </li>
    <li v-if="isLoggedIn">
      <button @click="logout" class="blackButton button">Logout</button>
    </li>
    <li>
      <RouterLink to="/signup" class="purpleButton button" v-if="!isLoggedIn">Sign up</RouterLink>
    </li>
    <li>
      <RouterLink to="/login" class="blackButton button" v-if="!isLoggedIn">Login</RouterLink>
    </li>
  </ul>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { getUserByUsername } from '@/api/userHooks'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { useApiStore } from '@/stores/apiStore'
import { oauth2 } from '@/api/axiosConfig'

const userStore = useUserStore()
const apiStore = useApiStore()

const isLoggedIn = computed(() => userStore.getIsLoggedIn)
const profilePicture = ref('')
const defaultProfilePicture = '/default_pfp.svg.png'

const fetchUserProfilePicture = async () => {
  console.log('fetchUserProfilePicture: isLoggedIn.value: ' + isLoggedIn.value)
  if (isLoggedIn.value) {
    while (!userStore.getUserName) {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    const userName = userStore.getUserName
    const user = await getUserByUsername(userName)
    profilePicture.value = user.profilePictureUrl
  }
}
watch(isLoggedIn, fetchUserProfilePicture)

const logout = () => {
  oauth2.post('/oauth2/revoke', {
    token: userStore.getAccessToken
  })
  const clientId = apiStore.clientId
  const authUrl =
    apiStore.getBackendUrl +
    `/connect/logout?client_id=${clientId}&id_token_hint=${userStore.getIdToken}&post_logout_redirect_uri=${apiStore.getBaseUrl}`
  userStore.logout()
  sessionStorage.clear()
  window.location.href = authUrl
}

onMounted(() => {
  fetchUserProfilePicture()
})
</script>

<style scoped>
.profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: auto;
  position: relative;
  align-self: flex-end;
  border: 1px solid black;
}

.profile-pic {
  display: flex;
  float: right;
}

ul {
  position: fixed;
  top: 0;
  width: 100%;
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #ffffff;
}

#logo {
  float: left;
  font-size: 35px;
  margin-right: 5%;
  margin-left: 2%;
  cursor: default;
}

.link {
  color: rgb(0, 0, 0);
}

li a {
  float: left;
  display: block;
  text-align: center;
  margin: 0px, 2px, 0px, 2px;
  padding: 10px 10px;
  text-decoration: none;
}

li a:hover {
  text-decoration: underline;
}
.navbar {
  min-width: 400px;
  border-bottom: solid 1px black;
}
.link {
  top: 50%;
}
.button {
  font-size: 15px;
  float: right;
  display: flex;
  padding: 10px;
  margin-top: 10px;
  margin-right: 10px;
}
@media (max-width: 750px) {
  #logo {
    display: none;
  }
  li a {
    padding: 5px 2px;
  }
  .button {
    font-size: 13px;
    float: right;
    display: flex;
    padding: 8px;
    margin-top: 10px;
  }
  .purpleButton {
    margin-right: 20px;
  }
}
</style>
