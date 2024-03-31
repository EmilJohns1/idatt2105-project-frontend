import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    accessToken: useStorage('accessToken', '', sessionStorage),
    userName: useStorage('userName', '', sessionStorage)
  }),
  getters: {
    getAccessToken(): string {
      return this.accessToken
    },
    getUserName(): string {
      return this.userName
    }
  },
  actions: {
    setAccessToken(accessToken: string): void {
      this.accessToken = accessToken
    },
    setUserName(userName: string): void {
      this.userName = userName
    }
  }
})
