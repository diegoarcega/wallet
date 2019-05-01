import { api, mockedRequest } from './api'

export function calculateAmountTo(amount, currencyRate, amountInDestination) {
  return parseFloat(((amount * currencyRate) + amountInDestination).toFixed(2))
}

export const walletsMockData = [{
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

export const getAll = () =>  mockedRequest(walletsMockData, 1000)

export const deposit = ({ currency, amount }) => mockedRequest({ currency, amount }, 1000)

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