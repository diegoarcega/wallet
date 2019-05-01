import { userTypes } from '../types'

const INITIAL_STATE = {
  isFetching: false,
  isError: false,
  defaultCurrency: undefined,
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case userTypes.GET_USER_DATA_REQUESTED:
      return { ...state, isFetching: true, isError: false }
    case userTypes.GET_USER_DATA_SUCCESS:
      return { ...state, ...action.payload, isFetching: false, isError: false }
    case userTypes.SET_DEFAULT_CURRENCY_REQUESTED:
      return { ...state, isFetching: true, isError: false }
    case userTypes.SET_DEFAULT_CURRENCY_SUCCESS:
      return { ...state, isFetching: false, isError: false, defaultCurrency: action.payload.defaultCurrency }
    default:
      return state
  }
}
