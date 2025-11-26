import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors - but NOT for password change which returns 401 for wrong password
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't auto-logout on 401 - let individual components handle errors
    // This prevents logout when password change fails due to wrong current password
    return Promise.reject(error)
  }
)

export default api
