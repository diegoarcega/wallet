import { combineReducers } from 'redux'
import walletsReducer from './wallets'

export default () => combineReducers({
  wallets: walletsReducer,
})
