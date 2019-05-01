import { all } from 'redux-saga/effects'
import { walletsWatcher } from './wallets'
import { userWatcher } from './user'

export function* rootSaga() {
  yield all([
    userWatcher(),
    walletsWatcher(),
  ])
}
