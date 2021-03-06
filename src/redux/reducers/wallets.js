import { walletTypes } from '../types'

const INITIAL_STATE = {
  isProcessing: false,
  isFetching: false,
  isError: false,
  wallets: [],
  total: null,
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // wallets
    case walletTypes.GET_ALL_REQUESTED:
      return { ...state, isFetching: true, isError: false }
    case walletTypes.GET_ALL_SUCCESS:
      return { ...state, wallets: action.payload, isFetching: false }
    case walletTypes.GET_ALL_FAILURE:
      return { ...state, isError: true, isFetching: false }

    // deposit
    case walletTypes.DEPOSIT_REQUESTED:
      return { ...state, isError: false, isProcessing: true }
    case walletTypes.DEPOSIT_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        wallets: state.wallets.reduce((accumulator, item) => {
          if (item.currency === action.payload.currency) {
            item.amount += action.payload.amount
          }
          return [...accumulator, item]
        }, []),
      }
    case walletTypes.DEPOSIT_FAILURE:
      return { ...state, isError: true, isProcessing: false }

    // exchange
    case walletTypes.EXCHANGE_REQUESTED:
      return { ...state, isProcessing: true }
    case walletTypes.EXCHANGE_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        wallets: state.wallets.reduce((accumulator, item) => {
          if (item.currency === action.payload.currencyFrom) {
            item.amount -= action.payload.amount
          }

          if (item.currency === action.payload.currencyTo) {
            item.amount = action.payload.amountTo
          }
          return [...accumulator, item]
        }, [])
      }

    // total
    case walletTypes.CALCULATE_TOTAL_REQUESTED:
      return { ...state, isProcessing: true }
    case walletTypes.CALCULATE_TOTAL_SUCCESS:
      return {
        ...state,
        isProcessing: false,
        total: action.payload.total,
      }
    default:
      return state
  }
}
