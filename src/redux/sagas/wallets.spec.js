import { put, call, select } from 'redux-saga/effects'
import * as WalletsApi from '../../modules/services/wallets.service'
import { getAll, deposit, exchange, calculateTotal } from './wallets'
import { walletTypes } from '../types'
import { getDefaultCurrency } from '../selectors/user'
import { getWallets } from '../selectors/wallets'

jest.mock('../../modules/services/api', () => {
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

describe('getAll()', () => {
  it('should call api and then dispatch success action and calculate totals', () => {
    const generator = getAll()

    expect(generator.next().value)
      .toEqual(call(WalletsApi.getAll))

    expect(generator.next().value)
      .toEqual(put({ type: walletTypes.GET_ALL_SUCCESS }))

    expect(generator.next().value)
      .toEqual(put({ type: walletTypes.CALCULATE_TOTAL_REQUESTED }))
  })

  it('should handle exception and dispatch FAILURE action', () => {
    const generator = getAll()

    expect(generator.next().value)
      .toEqual(call(WalletsApi.getAll))

    const errorMessage = 'my awesome getAll error'
    expect(generator.throw(errorMessage).value)
      .toEqual(put({ type: walletTypes.GET_ALL_FAILURE, payload: errorMessage }))
  })
})

describe('deposit()', () => {
  const action = {
    payload: {
      amount: 10,
      currency: 'USD',
      callback: jest.fn(),
    }
  }

  it('should call api and then dispatch success action, call callback, calculate totals', () => {
    const generator = deposit(action)

    expect(generator.next().value)
      .toEqual(call(WalletsApi.deposit, {
        currency: action.payload.currency,
        amount: action.payload.amount,
      }))

    expect(generator.next().value)
      .toEqual(put({ type: walletTypes.DEPOSIT_SUCCESS }))

    expect(generator.next().value)
      .toEqual(put({ type: walletTypes.CALCULATE_TOTAL_REQUESTED }))

    expect(action.payload.callback).toHaveBeenCalled()
  })

  it('should handle exception and dispatch FAILURE action', () => {
    const generator = deposit(action)

    expect(generator.next().value)
      .toEqual(call(WalletsApi.deposit, {
        currency: action.payload.currency,
        amount: action.payload.amount,
      }))

    const errorMessage = 'my awesome deposit error'
    expect(generator.throw(errorMessage).value)
      .toEqual(put({ type: walletTypes.DEPOSIT_FAILURE, payload: errorMessage }))
  })
})

describe('exchange()', () => {
  const action = {
    payload: {
      amount: 1,
      currencyFrom: 'GBP',
      currencyTo: 'USD',
      amountInDestination: 0,
      callback: jest.fn(),
    }
  }

  it('should call api and then dispatch success action, call callback', () => {
    const generator = exchange(action)

    expect(generator.next().value)
      .toEqual(call(WalletsApi.exchange, {
        ...action.payload,
        callback: undefined,
      }))

    expect(generator.next().value)
      .toEqual(put({ type: walletTypes.EXCHANGE_SUCCESS }))

    expect(action.payload.callback).toHaveBeenCalled()
  })

  it('should handle exception and dispatch FAILURE action', () => {
    const generator = exchange(action)

    expect(generator.next().value)
      .toEqual(call(WalletsApi.exchange, {
        ...action.payload,
        callback: undefined,
      }))

    const errorMessage = 'my awesome exchange error'
    expect(generator.throw(errorMessage).value)
      .toEqual(put({ type: walletTypes.EXCHANGE_FAILURE, payload: errorMessage }))
  })
})

describe('calculateTotal()', () => {
  it('should calculte the total amount in every wallet converted to the defaultCurrency', () => {
    const generator = calculateTotal()

    expect(generator.next().value)
      .toEqual(select(getDefaultCurrency))

    expect(generator.next().value)
      .toEqual(select(getWallets))

    expect(generator.next().value)
      .toEqual(call(WalletsApi.calculateTotal, {
        getDefaultCurrency: undefined,
        wallets: undefined,
      }))

    expect(generator.next().value)
      .toEqual(put({ type: walletTypes.CALCULATE_TOTAL_SUCCESS }))
  })

  it('should handle exception and dispatch FAILURE action', () => {
    const generator = calculateTotal()
    generator.next()

    const errorMessage = 'my awesome calculateTotal error'
    expect(generator.throw(errorMessage).value)
      .toEqual(put({ type: walletTypes.CALCULATE_TOTAL_FAILURE, payload: errorMessage }))
  })
})

