import { combineReducers } from 'redux'
import walletsReducer from './wallets'
import userReducer from './user'

export default () => combineReducers({
  user: userReducer,
  wallets: walletsReducer,
})
