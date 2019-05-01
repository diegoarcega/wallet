import { takeEvery, call, put, all } from 'redux-saga/effects'
import * as UserApi from '../../modules/services/user.service'
import { userTypes } from '../types'

function* getUserData() {
  const response = yield call(UserApi.getUserData)
  yield put({ type: userTypes.GET_USER_DATA_SUCCESS, payload: response })
}

function* setDefaultCurrency(action) {
  const { currency } = action.payload
  const response = yield call(UserApi.setDefaultCurrency, { currency })
  yield put({ type: userTypes.SET_DEFAULT_CURRENCY_SUCCESS, payload: response })
}


export function* userWatcher() {
  yield all([
    yield takeEvery(userTypes.GET_USER_DATA_REQUESTED, getUserData),
    yield takeEvery(userTypes.SET_DEFAULT_CURRENCY_REQUESTED, setDefaultCurrency),
  ])
}
