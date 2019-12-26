import axios from 'axios'
import { getStorage } from './auth'

const service = axios.create({
  // timeout: 10000 // request timeout
})

service.interceptors.request.use(
  config => {
    let token = getStorage('loginData') ? getStorage('loginData').token : null
    config.headers['Authorization'] = token
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service
