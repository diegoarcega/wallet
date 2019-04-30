import axios from 'axios'
import config from '../../config'

export const api = axios.create({
  // baseURL: config.apiBaseUrl,
  baseURL: 'https://api.exchangeratesapi.io/',
})
