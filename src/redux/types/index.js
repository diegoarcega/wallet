export const appTypes = {
  BOOT: '@app/BOOT',
}

export const userTypes = {
  GET_USER_DATA_REQUESTED: '@user/GET_USER_DATA_REQUESTED',
  GET_USER_DATA_SUCCESS: '@user/GET_USER_DATA_SUCCESS',
  GET_USER_DATA_FAILURE: '@user/GET_USER_DATA_FAILURE',

  SET_DEFAULT_CURRENCY_REQUESTED: '@user/SET_DEFAULT_CURRENCY_REQUESTED',
  SET_DEFAULT_CURRENCY_SUCCESS: '@user/SET_DEFAULT_CURRENCY_SUCCESS',
  SET_DEFAULT_CURRENCY_FAILURE: '@user/SET_DEFAULT_CURRENCY_FAILURE',
}

export const walletTypes = {
  GET_ALL_REQUESTED: '@wallets/GET_ALL_REQUESTED',
  GET_ALL_SUCCESS: '@wallets/GET_ALL_SUCCESS',
  GET_ALL_FAILURE: '@wallets/GET_ALL_FAILURE',

  DEPOSIT_REQUESTED: '@wallets/DEPOSIT_REQUESTED',
  DEPOSIT_SUCCESS: '@wallets/DEPOSIT_SUCCESS',
  DEPOSIT_FAILURE: '@wallets/DEPOSIT_FAILURE',

  EXCHANGE_REQUESTED: '@wallets/EXCHANGE_REQUESTED',
  EXCHANGE_SUCCESS: '@wallets/EXCHANGE_SUCCESS',
  EXCHANGE_FAILURE: '@wallets/EXCHANGE_FAILURE',

  CALCULATE_TOTAL_REQUESTED: '@wallets/CALCULATE_TOTAL_REQUESTED',
  CALCULATE_TOTAL_SUCCESS: '@wallets/CALCULATE_TOTAL_SUCCESS',
  CALCULATE_TOTAL_FAILURE: '@wallets/CALCULATE_TOTAL_FAILURE',
}
