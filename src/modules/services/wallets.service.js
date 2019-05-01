import { api, mockedRequest } from './api'
import { formatCurrency } from '../../utils'

function calculateAmountTo(amount, currencyRate, amountInDestination) {
  return parseFloat(((amount * currencyRate) + amountInDestination).toFixed(2))
}

export const getAll = () => {
  const data = [{
    currency: 'CAD',
    amount: 10,
    color: 'red',
  }, {
    currency: 'USD',
    amount: 10,
    color: 'yellow',
  }, {
    currency: 'GBP',
    amount: 10,
    color: 'blue'
  }, {
    currency: 'BRL',
    amount: 10,
    color: 'green'
  }]

  return mockedRequest(data, 1000)
}

export const deposit = ({ currency, amount }) => {
  return mockedRequest({ currency, amount }, 1000)
}

export const exchange = async ({ currencyFrom, currencyTo, amount, amountInDestination }) => {
  const response = await api.get(`/latest?base=${currencyFrom}`)
  const amountTo = calculateAmountTo(amount, response.data.rates[currencyTo], amountInDestination)

  return {
    currencyFrom,
    currencyTo,
    amount,
    amountTo,
  }
}

export const calculateTotal = async ({ defaultCurrency, wallets }) => {
  const defaultWallet = wallets.find(wallet => wallet.currency === defaultCurrency)
  const walletsWithoutDefault = wallets.filter(wallet => wallet.currency !== defaultCurrency)
  let walletsWithRates = []

  for (const wallet of walletsWithoutDefault) {
    const response = await api.get(`/latest?base=${wallet.currency}`)
    walletsWithRates = [...walletsWithRates, { ...wallet, rate: response.data.rates[defaultCurrency] }  ]
  }

  const total = walletsWithRates
    .reduce((accumulator, item) => {
      return calculateAmountTo(item.amount, item.rate, accumulator)
  }, defaultWallet.amount)

  return {
    total,
  }
}