import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getWallets } from '../../redux/selectors/wallets'
import * as walletsActions from '../../redux/actions/wallets'
import { getCurrencyDetails, getExchangeOptions } from '../../utils'
import {
  Header,
  Button,
  Modal,
  Input,
  Dropdown,
  Form,
  Label,
} from 'semantic-ui-react'

const ExchangeModal = props => {
  const { isOpen, isProcessing, currencyFrom, onClose, wallets, exchange } = props

  const initialCurrencyTo = getExchangeOptions(wallets, currencyFrom).length && getExchangeOptions(wallets, currencyFrom)[0].value
  const [currencyTo, setCurrencyTo] = useState(initialCurrencyTo)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    setCurrencyTo(initialCurrencyTo)
  }, [wallets, currencyFrom, initialCurrencyTo])

  const handleAmountChange = (event, { value }) => {
    setAmount(parseFloat(value))
  }

  const handleCurrencyToChange = (event, { value }) => {
    setCurrencyTo(value)
  }

  const handleSubmitSuccess = () => {
    onClose()
    setAmount()
  }

  const handleSubmit = () => {
    const currencyToValue = currencyTo || getExchangeOptions(wallets, currencyFrom)[0].value

    exchange({
      amount: parseFloat(amount),
      currencyFrom,
      currencyTo: currencyToValue,
      amountInDestination: getCurrencyDetails(wallets, currencyToValue).amount
    }, handleSubmitSuccess)
  }

  const isError = amount > (getCurrencyDetails(wallets, currencyFrom) && getCurrencyDetails(wallets, currencyFrom).amount)

  return (
    <Modal open={isOpen} onClose={onClose} size="tiny" dimmer="blurring">
      <Modal.Header>
        <Header textAlign="center" as="h1" color="green">
          Exchange {currencyFrom}
        </Header>
      </Modal.Header>
      <Modal.Content>
        <p>Exchange your currency between wallets</p>
        <Form.Field>
          <Input
            size="massive"
            type="number"
            placeholder="0"
            value={amount}
            onChange={handleAmountChange}
            autoFocus
            error={isError}
            labelPosition="right"
            fluid
            label={<Dropdown
              onChange={handleCurrencyToChange}
              options={getExchangeOptions(wallets, currencyFrom)}
              value={currencyTo}
              selection
              compact
            />}
          />
          {isError && <Label pointing color="red">
            You can't transfer more than you have in your {currencyFrom} wallet
          </Label>}
        </Form.Field>
      </Modal.Content>
      <Modal.Actions>
        <Button basic disabled={isProcessing} onClick={onClose}>Cancel</Button>
        <Button
          color="green"
          disabled={isProcessing || isError || !amount}
          loading={isProcessing}
          onClick={handleSubmit}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

ExchangeModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currencyFrom: PropTypes.string,
}

const mapStateToProps = state => ({
  wallets: getWallets(state),
  isProcessing: state.wallets.isProcessing,
})

const mapDispatchToProps = {
  exchange: walletsActions.exchange,
}

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeModal)