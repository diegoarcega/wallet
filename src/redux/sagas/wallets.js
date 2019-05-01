import { takeEvery, call, put, all } from 'redux-saga/effects'
import * as WalletsApi from '../../modules/services/wallets.service'
import { walletTypes } from '../types'

function* getAll() {
  const response = yield call(WalletsApi.getAll)
  yield put({ type: walletTypes.GET_ALL_SUCCESS, payload: response })
}

function* deposit(action) {
  const { amount, currency, callback } = action.payload
  const response = yield call(WalletsApi.deposit, { amount, currency })
  callback && callback()
  yield put({ type: walletTypes.DEPOSIT_SUCCESS, payload: response })
}

function* exchange(action) {
  const { amount, currencyFrom, currencyTo, callback, amountInDestination } = action.payload
  const response = yield call(WalletsApi.exchange, { currencyFrom, currencyTo, amount, amountInDestination })
  callback && callback()
  yield put({ type: walletTypes.EXCHANGE_SUCCESS, payload: response })
}

export function* walletsWatcher() {
  yield all([
    yield takeEvery(walletTypes.GET_ALL_REQUESTED, getAll),
    yield takeEvery(walletTypes.DEPOSIT_REQUESTED, deposit),
    yield takeEvery(walletTypes.EXCHANGE_REQUESTED, exchange),
  ])
}
