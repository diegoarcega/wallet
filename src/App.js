import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as walletsActions from './redux/actions/wallets'
import * as userActions from './redux/actions/user'
import {
  Grid,
  Segment,
  Header,
  Divider,
  Button,
  Modal,
  Input,
  Loader,
  Dropdown,
  Message,
  Form,
  Label,
} from 'semantic-ui-react'

const SegmentStyled = styled(Segment)`
  && { background: #e1fffd; }
`

const Amount = styled.span`
  font-size: 15px;
`

function getCurrencyDetails(wallets, currency) {
  return wallets.find(wallet => wallet.currency === currency)
}

function getExchangeOptions(wallets, disabledCurrency) {
  return wallets.reduce((accumulator, item) => {
    if (disabledCurrency === item.currency) return accumulator
    return [...accumulator, {
      key: item.currency,
      text: item.currency,
      value: item.currency,
    }]
  }, [])
}

const INITIAL_STATE = {
  isDepositModalOpen: false,
  depositAmount: 0,
  depositCurrency: 'USD',
  isDepositing: false,
  isDepositSuccess: false,

  isExchangeModalOpen: false,
  exchangeAmount: 0,
  isExchanging: false,
  isExchangeSuccess: false,
  exchangeCurrencyTo: undefined,
}
class App extends React.Component {
  state = INITIAL_STATE

  componentDidMount() {
    const { getAllWallets, getUserData } = this.props
    getAllWallets()
    getUserData()
  }

  closeModal = () => this.setState(INITIAL_STATE)
  // deposit
  openDepositModal = currency => () => this.setState({
    isDepositModalOpen: true,
    depositCurrency: currency,
  })
  handleDepositMountChange = (event, { value }) => {
    if (value < 0) return
    this.setState({ depositAmount: parseFloat(value) })
  }
  handleDeposit = () => {
    const { depositCurrency, depositAmount } = this.state

    this.props.deposit({
      amount: parseFloat(depositAmount),
      currency: depositCurrency,
    }, this.closeModal)
  }

  // exchange
  openExchangeModal = currency => () => this.setState({
    isExchangeModalOpen: true,
    exchangeCurrencyFrom: currency,
  })
  handleExchangeAmountChange = (event, { value }) => {
    if (value < 0) return
    this.setState({ exchangeAmount: parseFloat(value) })
  }

  handleExchange = () => {
    const { exchange, wallets } = this.props
    const {
      exchangeCurrencyFrom,
      exchangeCurrencyTo,
      exchangeAmount
    } = this.state

    const currencyTo = exchangeCurrencyTo || getExchangeOptions(wallets, exchangeCurrencyFrom)[0].value

    exchange({
      amount: parseFloat(exchangeAmount),
      currencyFrom: exchangeCurrencyFrom,
      currencyTo: currencyTo,
      amountInDestination: getCurrencyDetails(wallets, currencyTo).amount
    }, this.closeModal)
  }
  handleExchangeCurrencyToChange = (event, { value }) => {
    console.log({ value })
    this.setState({ exchangeCurrencyTo: value })
  }

  render() {
    const { wallets, isFetching, isDepositing, isUserFetching, defaultCurrency } = this.props
    const {
      isDepositModalOpen,
      depositCurrency,
      depositAmount,
      isExchangeModalOpen,
      isExchanging,
      exchangeAmount,
      exchangeCurrencyFrom,
      exchangeCurrencyTo,
    } = this.state

    const isExchangeError = exchangeAmount > (getCurrencyDetails(wallets, exchangeCurrencyFrom) && getCurrencyDetails(wallets, exchangeCurrencyFrom).amount)

    return (
      <React.Fragment>
        <Grid columns="equal" container>
          <Grid.Row>
            <Grid.Column>
              <Divider />
              <Button basic inverted>Change default currency</Button>
              {(isFetching || isUserFetching) ? <Loader active inline size="small" style={{ float: 'right', marginRight: '60px' }}/> : <Header as="h1" color="teal" floated="right">
                20.000.00 {defaultCurrency}
              </Header>}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {isFetching ? <Loader active /> : wallets.map(currency => (
              <Grid.Column key={currency.currency}>
                <SegmentStyled raised color={currency.color}>
                  <Header as="h4" color={currency.color}>{currency.currency} Wallet</Header>
                  <p><Amount>{currency.amount}</Amount> {currency.currency}</p>
                  <div>
                    <Button basic color="blue" onClick={this.openExchangeModal(currency.currency)}>Exchange</Button>
                    <Button basic color="green" onClick={this.openDepositModal(currency.currency)}>Deposit</Button>
                  </div>
                </SegmentStyled>
              </Grid.Column>
            ))}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              footer
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal
          open={isDepositModalOpen}
          onClose={this.closeModal}
          size="mini"
          dimmer="blurring"
        >
          <Modal.Header><Header textAlign="center" as="h1" color="green">Deposit {depositCurrency}</Header></Modal.Header>
          <Modal.Content>
            <Form.Field>
              <Input
                size="massive"
                type="number"
                placeholder="0"
                value={depositAmount}
                onChange={this.handleDepositMountChange}
                autoFocus
                fluid
              />
            </Form.Field>
          </Modal.Content>
          <Modal.Actions>
            <Button basic disabled={isDepositing} onClick={this.closeModal}>Cancel</Button>
            <Button color="green" disabled={isDepositing || !depositAmount} loading={isDepositing} onClick={this.handleDeposit}>Confirm</Button>
          </Modal.Actions>
        </Modal>
        <Modal
          open={isExchangeModalOpen}
          onClose={this.closeModal}
          size="tiny"
          dimmer="blurring"
        >
          <Modal.Header><Header textAlign="center" as="h1" color="green">Exchange {exchangeCurrencyFrom}</Header></Modal.Header>
          <Modal.Content>
            <p>Exchange your currency between wallets</p>
            <Form.Field>
                <Input
                size="massive"
                type="number"
                placeholder="0"
                value={exchangeAmount}
                onChange={this.handleExchangeAmountChange}
                autoFocus
                error={isExchangeError}
                labelPosition="right"
                fluid
                label={<Dropdown
                  onChange={this.handleExchangeCurrencyToChange}
                  options={getExchangeOptions(wallets, exchangeCurrencyFrom)}
                  value={exchangeCurrencyTo}
                  defaultValue={getExchangeOptions(wallets, exchangeCurrencyFrom)[0].value}
                  selection
                  compact
                />}
              />
              {isExchangeError && <Label pointing color="red">You can't transfer more than you have in your {exchangeCurrencyFrom} wallet</Label>}
            </Form.Field>
          </Modal.Content>
          <Modal.Actions>
            <Button basic disabled={isExchanging} onClick={this.closeModal}>Cancel</Button>
            <Button color="green" disabled={isExchanging || isExchangeError || !exchangeAmount} loading={isExchanging} onClick={this.handleExchange}>Confirm</Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>)
  }
}

const mapStateToProps = state => ({
  wallets: state.wallets.wallets,
  isFetching: state.wallets.isFetching,
  isDepositing: state.wallets.isDepositing,
  isError: state.wallets.isError,

  defaultCurrency: state.user.defaultCurrency,
  isUserFetching: state.user.isFetching,
})

const mapDispatchToProps = {
  getAllWallets: walletsActions.getAll,
  deposit: walletsActions.deposit,
  exchange: walletsActions.exchange,

  getUserData: userActions.getUserData,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
