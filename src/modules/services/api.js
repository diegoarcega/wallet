import axios from 'axios'
import config from '../../config'

export const api = axios.create({
  baseURL: config.apiBaseUrl,
})

export const mockedRequest = (data, time) => new Promise((resolve) => {
  setTimeout(() => resolve(data), time)
})
