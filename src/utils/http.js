// Packaging axios
// Instantiation, Request Interceptor, Response Interceptor

import axios from 'axios'
import { getToken } from './token'
import { history } from './history'
const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})
// Add request interceptor
http.interceptors.request.use((config) => {
  // if not login add token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Add response intercepter
http.interceptors.response.use((response) => {
  // do something for response.data
  return response.data
}, (error) => {
  // do something for response.error
  if (error.response.status === 401) {
    // jump back to login reactRouter in default state od not support routing jump outisde of components
    // Manually achieved
    history.push('/login')
  }
  return Promise.reject(error)
})

export { http }