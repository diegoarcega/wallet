import { walletTypes } from '../types'

const INITIAL_STATE = {
  isLoading: false,
  isError: false,
  wallets: [{
    currency: 'USD',
    amount: 0,
    color: 'yellow',
  }],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case walletTypes.GET_ALL_REQUESTED:
      return { ...state, isLoading: true, isError: false }
    case walletTypes.GET_ALL_SUCCESS:
      return { ...state, wallets: action.payload, isLoading: false }
    case walletTypes.GET_ALL_FAILURE:
      return { ...state, isError: true, isLoading: false }
    case walletTypes.DEPOSIT_REQUESTED:
      return { ...state, isLoading: true, isError: false }
    case walletTypes.DEPOSIT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        wallets: state.wallets.reduce((accumulator, item) => {
          if (item.currency === action.payload.currency) {
            item.amount += action.payload.amount
          }
          return [...accumulator, item]
        }, []),
      }
    case walletTypes.DEPOSIT_FAILURE:
      return { ...state, isError: true, isLoading: false }
    default:
      return state
  }
}
