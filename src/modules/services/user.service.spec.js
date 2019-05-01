import { getUserData, setDefaultCurrency } from './user.service'

describe('getUserData()', () => {
  it('should resolve mocked data', async () => {
    await expect(getUserData()).resolves.toEqual({ company: "Savvy", defaultCurrency: "USD" })
  })
})

describe('setDefaultCurrency()', () => {
  it('should resolve mocked data', async () => {
    await expect(setDefaultCurrency({ currency: 'GBP' })).resolves.toEqual({ defaultCurrency: "GBP" })
  })
})
