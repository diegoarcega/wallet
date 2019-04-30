import { walletTypes } from '../types'

const INITIAL_STATE = {
  isDepositing: false,
  isFetching: false,
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
      return { ...state, isFetching: true, isError: false }
    case walletTypes.GET_ALL_SUCCESS:
      return { ...state, wallets: action.payload, isFetching: false }
    case walletTypes.GET_ALL_FAILURE:
      return { ...state, isError: true, isFetching: false }
    case walletTypes.DEPOSIT_REQUESTED:
      return { ...state, isError: false, isDepositing: true }
    case walletTypes.DEPOSIT_SUCCESS:
      return {
        ...state,
        isDepositing: false,
        wallets: state.wallets.reduce((accumulator, item) => {
          if (item.currency === action.payload.currency) {
            item.amount += action.payload.amount
          }
          return [...accumulator, item]
        }, []),
      }
    case walletTypes.DEPOSIT_FAILURE:
      return { ...state, isError: true, isDepositing: false }
    default:
      return state
  }
}
