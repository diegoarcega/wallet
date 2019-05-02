import { takeEvery, call, put, all, select } from 'redux-saga/effects'
import * as WalletsApi from '../../modules/services/wallets.service'
import { walletTypes } from '../types'
import { getDefaultCurrency } from '../selectors/user'
import { getWallets } from '../selectors/wallets'

export function* getAll() {
  try {
    const response = yield call(WalletsApi.getAll)
    yield put({ type: walletTypes.GET_ALL_SUCCESS, payload: response })
    yield put({ type: walletTypes.CALCULATE_TOTAL_REQUESTED })
  } catch (error) {
    yield put({ type: walletTypes.GET_ALL_FAILURE, payload: error })
  }
}

export function* deposit(action) {
  try {
    const { amount, currency, callback } = action.payload
    const response = yield call(WalletsApi.deposit, { amount, currency })
    yield put({ type: walletTypes.DEPOSIT_SUCCESS, payload: response })
    callback && callback()
    yield put({ type: walletTypes.CALCULATE_TOTAL_REQUESTED })
  } catch (error) {
    yield put({ type: walletTypes.DEPOSIT_FAILURE, payload: error })
  }
}

export function* exchange(action) {
  try {
    const { amount, currencyFrom, currencyTo, callback, amountInDestination } = action.payload
    const response = yield call(WalletsApi.exchange, { currencyFrom, currencyTo, amount, amountInDestination })
    callback && callback()
    yield put({ type: walletTypes.EXCHANGE_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: walletTypes.EXCHANGE_FAILURE, payload: error })
  }
}

export function* calculateTotal() {
  try {
    const defaultCurrency = yield select(getDefaultCurrency)
    const wallets = yield select(getWallets)
    const response = yield call(WalletsApi.calculateTotal, { defaultCurrency, wallets })
    yield put({ type: walletTypes.CALCULATE_TOTAL_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: walletTypes.CALCULATE_TOTAL_FAILURE, payload: error })
  }
}

export function* walletsWatcher() {
  yield all([
    yield takeEvery(walletTypes.GET_ALL_REQUESTED, getAll),
    yield takeEvery(walletTypes.DEPOSIT_REQUESTED, deposit),
    yield takeEvery(walletTypes.EXCHANGE_REQUESTED, exchange),
    yield takeEvery(walletTypes.CALCULATE_TOTAL_REQUESTED, calculateTotal),
  ])
}
