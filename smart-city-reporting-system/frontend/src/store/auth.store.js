import { defineStore } from 'pinia'
import authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async login(credentials) {
      this.isLoading = true
      try {
        const response = await authService.login(credentials)
        this.token = response.data.token
        this.user = response.data.user
        localStorage.setItem('token', response.data.token)
        return { success: true }
      } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Login failed' }
      } finally {
        this.isLoading = false
      }
    },
    
    async logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
    
    async fetchProfile() {
      if (!this.token) return
      try {
        const response = await authService.getProfile()
        this.user = response.data
      } catch (error) {
        this.logout()
      }
    }
  }
})