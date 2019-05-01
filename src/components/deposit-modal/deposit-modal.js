import React from 'react'
import PropTypes from 'prop-types'
import {
  Header,
  Button,
  Modal,
  Input,
  Form,
} from 'semantic-ui-react'

const DepositModal = ({
  isOpen,
  currency,
  amount,
  isLoading,
  onAmountChange,
  onClose,
  onSubmit,
}) => {
  return (<Modal
      open={isOpen}
      onClose={onClose}
      size="mini"
      dimmer="blurring"
    >
    <Modal.Header>
      <Header textAlign="center" as="h1" color="green">
        Deposit {currency}
      </Header>
    </Modal.Header>
    <Modal.Content>
      <Form.Field>
        <Input
          size="massive"
          type="number"
          placeholder="0"
          value={amount}
          onChange={onAmountChange}
          autoFocus
          fluid
        />
      </Form.Field>
    </Modal.Content>
    <Modal.Actions>
      <Button basic disabled={isLoading} onClick={onClose}>Cancel</Button>
      <Button color="green" disabled={isLoading || !amount} loading={isLoading} onClick={onSubmit}>Confirm</Button>
    </Modal.Actions>
  </Modal>)
}

DepositModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  currency: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default DepositModal
