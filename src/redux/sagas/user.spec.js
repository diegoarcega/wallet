import { put, call } from 'redux-saga/effects'
import * as UserApi from '../../modules/services/user.service'
import { getUserData, setDefaultCurrency } from './user'
import { userTypes, walletTypes } from '../types'

describe('getUserData()', () => {
  it('should call api and then dispatch success action', () => {
    const generator = getUserData()

    expect(generator.next().value)
      .toEqual(call(UserApi.getUserData))

    expect(generator.next().value)
      .toEqual(put({ type: userTypes.GET_USER_DATA_SUCCESS, payload: undefined }))
  })

  it('should handle exception and dispatch FAILURE action', () => {
    const generator = getUserData()

    expect(generator.next().value)
    .toEqual(call(UserApi.getUserData))

    expect(generator.throw('my awesome error').value)
      .toEqual(put({ type: userTypes.GET_USER_DATA_FAILURE, payload: 'my awesome error' }))
  })
})

describe('setDefaultCurrency()', () => {
  const action = { payload: { currency: 'USD' } }

  it('should call api, dispatch success and calculateTotal actions', () => {
    const generator = setDefaultCurrency(action)

    expect(generator.next().value)
      .toEqual(call(UserApi.setDefaultCurrency, action.payload))

    expect(generator.next().value)
      .toEqual(put({ type: userTypes.SET_DEFAULT_CURRENCY_SUCCESS }))

    expect(generator.next().value)
      .toEqual(put({ type: walletTypes.CALCULATE_TOTAL_REQUESTED }))
  })

  it('should handle exception and dispatch FAILURE action', () => {
    const generator = setDefaultCurrency(action)

    expect(generator.next().value)
      .toEqual(call(UserApi.setDefaultCurrency, action.payload))

    const errorMessage = 'my awesome setDefaultCurrency error message'

    expect(generator.throw(errorMessage).value)
      .toEqual(put({ type: userTypes.SET_DEFAULT_CURRENCY_FAILURE, payload: errorMessage }))
  })
})
