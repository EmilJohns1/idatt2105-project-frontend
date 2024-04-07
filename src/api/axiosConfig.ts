import axios from 'axios'
import { useUserStore } from '@/stores/userStore'
import router from '@/router'

const baseURL = 'https://localhost:8443' // Adjust this to our backend API URL

const api = axios.create({
  baseURL: baseURL + '/api',
  timeout: 10000 // Adjust timeout as needed
})

const oauth2 = axios.create({
  baseURL: baseURL,
  timeout: 5000
})

api.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    const token = userStore.getAccessToken
    if (token) {
      if (userStore.tokenIsExpired()) {
        userStore.logout()
        router.push('/login')
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

/* oauth2.interceptors.request.use(function (config) {
  const userStore = useUserStore();
  const token = userStore.getAccessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
}); */

export { api, oauth2 }
