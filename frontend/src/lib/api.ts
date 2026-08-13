import axios from 'axios'
import { getUser } from './auth'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' })

api.interceptors.request.use((config) => {
  const user = getUser()
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.status, err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export default api
