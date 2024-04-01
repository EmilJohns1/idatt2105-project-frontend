import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useApiStore = defineStore({
  id: 'apiStore',
  state: () => ({
    clientId: 'frontend-client',
    codeVerifier: useStorage('codeVerifier', '', localStorage),
    baseUrl: 'https://localhost:5173',
    backendUrl: 'https://127.0.0.1:8443'
  }),
  getters: {
    getClientId(): string {
      return this.clientId
    },
    getCodeVerifier(): string {
      return this.codeVerifier
    },
    getBaseUrl(): string {
      return this.baseUrl
    },
    getBackendUrl(): string {
      return this.backendUrl
    }
  },
  actions: {
    setCodeVerifier(codeVerifier: string): void {
      this.codeVerifier = codeVerifier
    }
  }
})
