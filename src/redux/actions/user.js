import { userTypes } from '../types'

export const getUserData = () => ({
  type: userTypes.GET_USER_DATA_REQUESTED
})

export const setDefaultCurrency = ({ currency }) => ({
  type: userTypes.SET_DEFAULT_CURRENCY_REQUESTED,
  payload: { currency },
})
