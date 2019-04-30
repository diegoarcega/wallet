import { takeEvery, call, put, all } from 'redux-saga/effects'
import * as WalletsApi from '../../modules/services/wallets.service'
import { walletTypes } from '../types'

function* getAll() {
  const response = yield call(WalletsApi.getAll)
  yield put({ type: walletTypes.GET_ALL_SUCCESS, payload: response })
}

function* deposit(action) {
  const { amount, currency } = action.payload
  const response = yield call(WalletsApi.deposit, { amount, currency })
  yield put({ type: walletTypes.DEPOSIT_SUCCESS, payload: response })
}

export function* walletsWatcher() {
  yield all([
    yield takeEvery(walletTypes.GET_ALL_REQUESTED, getAll),
    yield takeEvery(walletTypes.DEPOSIT_REQUESTED, deposit),
  ])
}
