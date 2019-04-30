import { api } from './api'

export const wait = (data, time) => new Promise((resolve) => {
  setTimeout(() => resolve(data), time)
})

export const getAll = () => {
  const data = [{
    currency: 'USD',
    amount: 100,
    color: 'yellow',
  }, {
    currency: 'GBP',
    amount: 1,
    color: 'blue'
  }, {
    currency: 'BRL',
    amount: 0,
    color: 'green'
  }]

  return wait(data, 1000)
}

export const deposit = ({ currency, amount }) => {
  return wait({ currency, amount }, 1000)
}

export const exchange = async ({ currencyFrom, currencyTo, amount }) => {
  const response = await api.get(`/latest?base=${currencyFrom}`)
  return {
    currencyFrom,
    currencyTo,
    amount,
    amountTo: (amount * response.data.rates[currencyTo]).toFixed(2),
  }
}