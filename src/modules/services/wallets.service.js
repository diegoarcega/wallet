import { api, mockedRequest } from './api'

export const getAll = () => {
  const data = [{
    currency: 'USD',
    amount: 10,
    color: 'yellow',
  }, {
    currency: 'GBP',
    amount: 10,
    color: 'blue'
  }, {
    currency: 'BRL',
    amount: 0,
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

  function calculateAmountTo(amount, currencyRate, amountInDestination) {
    return parseFloat(((amount * currencyRate) + amountInDestination).toFixed(2))
  }
}