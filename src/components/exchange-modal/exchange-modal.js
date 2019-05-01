import React from 'react'
import {
  Header,
  Button,
  Modal,
  Input,
  Dropdown,
  Form,
  Label,
} from 'semantic-ui-react'

export default (props) => {
  const {
    amount,
    isOpen,
    isLoading,
    isError,
    onClose,
    onAmountChange,
    onSubmit,
    onCurrencyToChange,
    currencyFrom,
    currencyOptions,
    currencyValue,
    currencyDefaultValue
  } = props

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="tiny"
      dimmer="blurring"
    >
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
            onChange={onAmountChange}
            autoFocus
            error={isError}
            labelPosition="right"
            fluid
            label={<Dropdown
              onChange={onCurrencyToChange}
              options={currencyOptions}
              value={currencyValue}
              defaultValue={currencyDefaultValue}
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
        <Button basic disabled={isLoading} onClick={onClose}>Cancel</Button>
        <Button
          color="green"
          disabled={isLoading || isError || !amount}
          loading={isLoading}
          onClick={onSubmit}>
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  )
}