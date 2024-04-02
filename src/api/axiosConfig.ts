import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

const baseURL = 'https://localhost:8443' // Adjust this according to your backend API base URL

const api = axios.create({
  baseURL: baseURL + '/api',
  timeout: 5000 // Adjust timeout as needed
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
