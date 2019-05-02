import { takeEvery, call, put, all } from 'redux-saga/effects'
import * as UserApi from '../../modules/services/user.service'
import { userTypes, walletTypes } from '../types'

export function* getUserData() {
  try {
    const response = yield call(UserApi.getUserData)
    yield put({ type: userTypes.GET_USER_DATA_SUCCESS, payload: response })
  } catch (error) {
    yield put({ type: userTypes.GET_USER_DATA_FAILURE, payload: error })
  }
}

export function* setDefaultCurrency(action) {
  try {
    const { currency } = action.payload
    const response = yield call(UserApi.setDefaultCurrency, { currency })
    yield put({ type: userTypes.SET_DEFAULT_CURRENCY_SUCCESS, payload: response })
    yield put({ type: walletTypes.CALCULATE_TOTAL_REQUESTED })
  } catch (error) {
    yield put({ type: userTypes.SET_DEFAULT_CURRENCY_FAILURE, payload: error })
  }
}


export function* userWatcher() {
  yield all([
    yield takeEvery(userTypes.GET_USER_DATA_REQUESTED, getUserData),
    yield takeEvery(userTypes.SET_DEFAULT_CURRENCY_REQUESTED, setDefaultCurrency),
  ])
}
