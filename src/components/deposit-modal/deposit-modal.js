import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as walletsActions from '../../redux/actions/wallets'
import { Header, Button, Modal, Input } from 'semantic-ui-react'

const DepositModal = ({ isOpen, onClose, currency, isProcessing, deposit }) => {
  const [amount, setAmount] = useState('')

  const handleAmountChange = (event, { value }) => {
    setAmount(parseFloat(value))
  }

  const onSubmitSuccess = () => {
    onClose()
    setAmount(undefined)
  }

  const handleSubmit = () => {
    deposit({
      amount: parseFloat(amount),
      currency,
    }, onSubmitSuccess)
  }

  return (
  <Modal open={isOpen} onClose={onClose} size="mini" dimmer="blurring">
    <Modal.Header>
      <Header textAlign="center" as="h1" color="green">
        Deposit {currency}
      </Header>
    </Modal.Header>
    <Modal.Content>
      <Input
        size="massive"
        type="number"
        placeholder="0"
        value={amount}
        onChange={handleAmountChange}
        autoFocus
        fluid
      />
    </Modal.Content>
    <Modal.Actions>
      <Button basic disabled={isProcessing} onClick={onClose}>Cancel</Button>
        <Button
          color="green"
          disabled={isProcessing || !amount}
          loading={isProcessing}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
    </Modal.Actions>
  </Modal>)
}

DepositModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currency: PropTypes.string,
  isProcessing: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  deposit: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isProcessing: state.wallets.isProcessing,
})

const mapDispatchToProps = {
  deposit: walletsActions.deposit,
}

export default connect(mapStateToProps, mapDispatchToProps)(DepositModal)
