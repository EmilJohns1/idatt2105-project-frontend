import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore({
  id: 'userStore',
  state: () => ({
    accessToken: useStorage('accessToken', '', sessionStorage),
    userName: useStorage('userName', '', sessionStorage),
    isLoggedIn: useStorage('isLoggedIn', false, sessionStorage),
    idToken: useStorage('idToken', '', sessionStorage),
    timeToLive: useStorage('timeToLive', 0, sessionStorage),
    expiresAt: useStorage('expiresAt', 0, sessionStorage)
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
    },
    getIdToken(): string {
      return this.idToken
    },
    getTimeToLive(): number {
      return this.timeToLive
    },
    getExpiresAt(): number {
      return this.expiresAt
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
    setIdToken(idToken: string): void {
      this.idToken = idToken
    },
    logout(): void {
      this.accessToken = ''
      this.userName = ''
      this.isLoggedIn = false
      this.idToken = ''
    },
    setTimeToLive(timeToLive: number): void {
      this.timeToLive = timeToLive
      this.expiresAt = Date.now() + timeToLive * 1000 - 60000 // Convert seconds to milliseconds, subtract 1 minute for margin of error
    },
    tokenIsExpired(): boolean {
      return Date.now() > this.expiresAt
    }
  }
})
