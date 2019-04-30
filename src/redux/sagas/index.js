import { all } from 'redux-saga/effects'
import { walletsWatcher } from './wallets'

export function* rootSaga() {
  yield all([ walletsWatcher() ])
}
