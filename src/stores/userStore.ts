import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    accessToken: useStorage('accessToken', '', sessionStorage),
    userName: useStorage('userName', '', sessionStorage),
    isLoggedIn: useStorage('isLoggedIn', false, sessionStorage)
  }),
  getters: {
    getAccessToken(): string {
      return this.accessToken
    },
    getUserName(): string {
      return this.userName
    },
    getIsLoggedIn(): boolean {
      return this.isLoggedIn
    }
  },
  actions: {
    setAccessToken(accessToken: string): void {
      this.accessToken = accessToken
      this.isLoggedIn = true
    },
    setUserName(userName: string): void {
      this.userName = userName
    },
    logout(): void {
      this.accessToken = ''
      this.userName = ''
      this.isLoggedIn = false
    }
  }
})
