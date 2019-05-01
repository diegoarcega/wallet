import { mockedRequest } from './api'

export const getUserData = () => {
  return mockedRequest({ company: 'Savvy', defaultCurrency: 'USD' }, 1000)
}

export const setDefaultCurrency = ({ currency }) => {
  return mockedRequest({ defaultCurrency:  currency }, 1000)
}
