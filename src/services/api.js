import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth endpoints
export const login = (email) => api.post('/auth/login', { email })
export const getLoginEmails = () => api.get('/auth/login-emails')
export const getProfile = () => api.get('/auth/profile')

// Employee endpoints
export const getEmployees = () => api.get('/employees')
export const getEmployee = (id) => api.get(`/employees/${id}`)

// Leave endpoints
export const getLeaveRequests = (params) => api.get('/leaves', { params })
export const createLeaveRequest = (data) => api.post('/leaves', data)
export const reviewLeaveRequest = (id, status, comment) => 
  api.put(`/leaves/${id}/review`, { status, review_comment: comment })

// Audit endpoints
export const getAuditLogs = () => api.get('/audit/logs')

export default api