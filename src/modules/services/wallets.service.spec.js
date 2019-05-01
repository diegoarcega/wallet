import {
  calculateAmountTo,
  getAll,
  deposit,
  exchange,
  calculateTotal,
  walletsMockData
} from './wallets.service'

jest.mock('./api', () => {
  return {
    mockedRequest: (data, time) => new Promise((resolve) => {
      setTimeout(() => resolve(data), time)
    }),
    api: {
      get: (param) => {
        if (param === '/latest?base=GBP') {
          return {
            data: {
              rates: {
                'USD': 0.5,
              }
            }
          }
        }

        return {
          data: {
            rates: {
              'GBP': 2,
            }
          }
        }
      }
    },
  }
})

describe('calculateAmountTo()', () => {
  it('should return calculated amountTo given: amount, rate and amountInDestination', () => {
    const amountToBeTransfered = 10.00
    const rate = 2
    const amountInDestination = 100.00
    expect(calculateAmountTo(amountToBeTransfered, rate, amountInDestination)).toEqual(120.00)
  })
})

describe('getAll()', () => {
  it('should return all wallets data', async () => {
    const walletsData = await getAll()
    expect(walletsData).toEqual(walletsMockData)
  })
})

describe('deposit()', () => {
  it('should return the amount and currency of the deposit', async () => {
    const depositData = await deposit({ currency: 'USD', amount: 1 })
    expect(depositData).toEqual({ currency: 'USD', amount: 1 })
  })
})

describe('exchange()', () => {
  it('should calculate the amount to be added to the destination wallet given API rates', async () => {
    const currencyFrom = 'USD'
    const currencyTo = 'GBP'
    const amount = 10
    const amountInDestination = 100
    const exchangedData = await exchange({ currencyFrom, currencyTo, amount, amountInDestination })
    expect(exchangedData.amountTo).toEqual(120)
  })
})

describe('calculateTotal()', () => {
  it('should return the totalised value in the defaultCurrency', async () => {
    const defaultCurrency = 'USD'
    const wallets = [{
      currency: 'GBP',
      amount: 10,
    }, {
      currency: 'USD',
      amount: 10,
    }]

    const total = await calculateTotal({ defaultCurrency, wallets })
    expect(total).toEqual({ total: 15 })
  })
})