// import { api } from './api'
const wait = (data, time) => new Promise((resolve) => setTimeout(resolve(data), 10000))

export const getAll = () => {
  const data = [{
    currency: 'USD',
    amount: 10000,
    color: 'yellow',
  }, {
    currency: 'GBP',
    amount: 5000,
    color: 'blue'
  }, {
    currency: 'BRL',
    amount: 18700,
    color: 'green'
  }]

  return wait(data, 10000)
}

export const deposit = ({ currency, amount }) => {
  return wait({ currency, amount }, 10000)
}