import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as walletsActions from './redux/actions/wallets'
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
} from 'semantic-ui-react'

const SegmentStyled = styled(Segment)`
  && { background: #e1fffd; }
`

const Amount = styled.span`
  font-size: 15px;
`

class App extends React.Component {
  state = {
    isDepositModalOpen: false,
    depositAmount: 0,
    depositCurrency: 'USD',
    isDepositing: false,
    isDepositSuccess: false,

    isExchangeModalOpen: false,
    exchangeAmount: 1,
    exchangeCurrency: 'USD',
    isExchanging: false,
    isExchangeSuccess: false,
  }

  componentDidMount() {
    const { getAllWallets } = this.props
    getAllWallets()
  }

  // deposit
  closeDepositModal = () => this.setState({ isDepositModalOpen: false })
  openDepositModal = currency => () => this.setState({
    isDepositModalOpen: true,
    depositCurrency: currency,
  })
  handleDepositMountChange = (event, { name, value }) => this.setState({ depositAmount: value })
  handleDeposit = () => {
    const { depositCurrency, depositAmount } = this.state

    this.props.deposit({
      amount: parseInt(depositAmount, 10),
      currency: depositCurrency,
    }, this.closeDepositModal)
  }

  // exchange
  closeExchangeModal = () => this.setState({ isExchangeModalOpen: false })
  openExchangeModal = currency => () => this.setState({
    isExchangeModalOpen: true,
    exchangeCurrencyFrom: currency,
  })
  handleExchangeAmountChange = event => this.setState({ exchangeAmount: event.target.value })
  handleExchange = () => {
    const {
      exchangeCurrencyFrom,
      exchangeCurrencyTo,
      exchangeAmount
    } = this.state

    this.props.exchange({
      amount: parseInt(exchangeAmount, 10),
      currencyFrom: exchangeCurrencyFrom,
      currencyTo: exchangeCurrencyTo,
    })
  }
  handleExchangeCurrencyToChange = (event, { name, value }) => {
    this.setState({ exchangeCurrencyTo: value })
  }

  render() {
    const { wallets, isFetching, isDepositing } = this.props
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

    const exchangeOptions = wallets.map(option => ({
      key: option.currency,
      text: option.currency,
      value: option.currency,
    }))

    return (
      <React.Fragment>
        <Grid columns="equal" container>
          <Grid.Row>
            <Grid.Column>
              <Divider />
              <Button basic inverted>Change default currency</Button>
              {isFetching ? <Loader active inline size="small" style={{ float: 'right', marginRight: '60px' }}/> : <Header as="h1" color="teal" floated="right">
                20.000.00 USD
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
          onClose={this.closeDepositModal}
          size="mini"
          dimmer="blurring"
        >
          <Modal.Header><Header textAlign="center" as="h1" color="green">Deposit {depositCurrency}</Header></Modal.Header>
          <Modal.Content>
            <Input
              size="massive"
              type="number"
              placeholder="0"
              value={depositAmount}
              onChange={this.handleDepositMountChange}
              autoFocus
              fluid
            />
          </Modal.Content>
          <Modal.Actions>
            <Button basic disabled={isDepositing} onClick={this.closeDepositModal}>Cancel</Button>
            <Button color="green" disabled={isDepositing} loading={isDepositing} onClick={this.handleDeposit}>Confirm</Button>
          </Modal.Actions>
        </Modal>
        <Modal
          open={isExchangeModalOpen}
          onClose={this.closeExchangeModal}
          size="mini"
          dimmer="blurring"
        >
          <Modal.Header><Header textAlign="center" as="h1" color="green">Exchange {exchangeCurrencyFrom}</Header></Modal.Header>
          <Modal.Content>
            <p>Exchange your currency between wallets</p>
            <Input
              size="massive"
              type="number"
              placeholder="0"
              value={exchangeAmount}
              onChange={this.handleExchangeAmountChange}
              autoFocus
              fluid
            />
            <Dropdown
              placeholder="Select the wallet"
              onChange={this.handleExchangeCurrencyToChange}
              options={exchangeOptions}
              value={exchangeCurrencyTo}
              fluid
              selection
            />
          </Modal.Content>
          <Modal.Actions>
            <Button basic disabled={isExchanging} onClick={this.closeExchangeModal}>Cancel</Button>
            <Button color="green" disabled={isExchanging} loading={isExchanging} onClick={this.handleExchange}>Confirm</Button>
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
})

const mapDispatchToProps = {
  getAllWallets: walletsActions.getAll,
  deposit: walletsActions.deposit,
  exchange: walletsActions.exchange,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
