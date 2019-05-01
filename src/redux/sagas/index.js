import { all, put, takeEvery } from 'redux-saga/effects'
import { walletsWatcher } from './wallets'
import { userWatcher } from './user'
import { userTypes, walletTypes, appTypes } from '../types'

function* boot() {
  yield put({ type: userTypes.GET_USER_DATA_REQUESTED })
  yield put({ type: walletTypes.GET_ALL_REQUESTED })
}

function* bootWather() {
  yield takeEvery(appTypes.BOOT, boot)
}

export function* rootSaga() {
  yield all([
    bootWather(),
    userWatcher(),
    walletsWatcher(),
  ])
}
