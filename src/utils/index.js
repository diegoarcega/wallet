
export function getCurrencyDetails(wallets, currency) {
  return wallets.find(wallet => wallet.currency === currency)
}

export function getExchangeOptions(wallets, disabledCurrency) {
  return wallets.reduce((accumulator, item) => {
    if (disabledCurrency === item.currency) return accumulator
    return [...accumulator, {
      key: item.currency,
      text: item.currency,
      value: item.currency,
    }]
  }, [])
}
