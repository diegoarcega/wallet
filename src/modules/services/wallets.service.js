// import { api } from './api'
export const wait = (data, time) => new Promise((resolve) => {
  setTimeout(() => resolve(data), time)
})

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

  return wait(data, 1000)
}

export const deposit = ({ currency, amount }) => {
  return wait({ currency, amount }, 1000)
}