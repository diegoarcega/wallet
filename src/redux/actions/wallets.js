import { walletTypes } from '../types'

export const getAll = () => ({
  type: walletTypes.GET_ALL_REQUESTED
})

export const deposit = ({ amount, currency }, callback) => ({
  type: walletTypes.DEPOSIT_REQUESTED,
  payload: { amount, currency, callback },
})

export const exchange = ({ amount, currencyFrom, currencyTo, amountInDestination }, callback) => ({
  type: walletTypes.EXCHANGE_REQUESTED,
  payload: { amount, currencyFrom, currencyTo, amountInDestination, callback },
})

export const calculateTotal = ({ defaultCurrency, wallets }) => ({
  type: walletTypes.CALCULATE_TOTAL_REQUESTED,
  payload: { defaultCurrency, wallets },
})