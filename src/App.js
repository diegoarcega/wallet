import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as formatCurrency from 'format-currency'
import { SegmentStyled, Amount, LoaderStyles, TotalStyles } from './app.styles'
import * as walletsActions from './redux/actions/wallets'
import * as userActions from './redux/actions/user'
import { getWallets } from './redux/selectors/wallets'
import { getDefaultCurrency } from './redux/selectors/user'
import { DepositModal } from './components/deposit-modal'
import { ExchangeModal } from './components/exchange-modal'
import { getCurrencyDetails, getExchangeOptions } from './utils'
import {
  Grid,
  Header,
  Divider,
  Button,
  Loader,
  Dropdown,
  Menu,
} from 'semantic-ui-react'

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
  static propTypes = {
    wallets: PropTypes.arrayOf(PropTypes.shape({
      currency: PropTypes.string,
      amount: PropTypes.number,
      color: PropTypes.string,
    })),
    isFetching: PropTypes.bool.isRequired,
    isDepositing: PropTypes.bool.isRequired,
    isError: PropTypes.bool.isRequired,
    total: PropTypes.number,

    defaultCurrency: PropTypes.string,
    isUserFetching: PropTypes.bool.isRequired,

    deposit: PropTypes.func.isRequired,
    exchange: PropTypes.func.isRequired,

    getUserData: PropTypes.func.isRequired,
    setDefaultCurrency: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { getUserData } = this.props
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
    this.setState({ exchangeCurrencyTo: value })
  }

  handleSetDefaultCurrency = (event, { value }) => {
    this.props.setDefaultCurrency({ currency: value})
  }

  render() {
    const { wallets, isFetching, isDepositing, isUserFetching, defaultCurrency, total } = this.props
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
        <Menu stackable inverted secondary floated="right">
          {isUserFetching ?
            <Loader active inline="centered" size="small" style={LoaderStyles} /> :
            <Dropdown
              simple
              item
              floated="right"
              text={`Default Currency:  ${defaultCurrency}`}
              options={getExchangeOptions(wallets, defaultCurrency)}
              onChange={this.handleSetDefaultCurrency}
          />}
        </Menu>
        <Divider hidden clearing />
        <Grid>
          <Grid.Row>
            <Grid.Column>
              {(isUserFetching || isFetching) ? <Loader active inline="centered" /> : <Header as="h1" color="teal" textAlign="center">
                <span style={TotalStyles}>{formatCurrency(total, { code: defaultCurrency })}</span> {defaultCurrency}
              </Header>}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid stackable container stretched columns="3" doubling divided="vertically">
          <Grid.Row>
            {isFetching ? <Loader active style={{ marginTop: '170px' }}/> : wallets.map(currency => (
              <Grid.Column key={currency.currency}>
                <SegmentStyled raised color={currency.color}>
                  <Header as="h4" color={currency.color}>{currency.currency} Wallet</Header>
                  <p><Amount>{formatCurrency(currency.amount, { code: currency.currency })}</Amount> {currency.currency}</p>
                  <div>
                    <Button basic color="blue" onClick={this.openExchangeModal(currency.currency)}>Exchange</Button>
                    <Button basic color="green" onClick={this.openDepositModal(currency.currency)}>Deposit</Button>
                  </div>
                </SegmentStyled>
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
        <DepositModal
          isOpen={isDepositModalOpen}
          isLoading={isDepositing}
          onClose={this.closeModal}
          currency={depositCurrency}
          amount={depositAmount}
          onAmountChange={this.handleDepositMountChange}
          onSubmit={this.handleDeposit}
        />
        <ExchangeModal
          onClose={this.closeModal}
          isOpen={isExchangeModalOpen}
          currencyFrom={exchangeCurrencyFrom}
          amount={exchangeAmount}
          onAmountChange={this.handleExchangeAmountChange}
          isError={isExchangeError}
          onCurrencyToChange={this.handleExchangeCurrencyToChange}
          currencyOptions={getExchangeOptions(wallets, exchangeCurrencyFrom)}
          currencyValue={exchangeCurrencyTo}
          currencyDefaultValue={exchangeCurrencyFrom && getExchangeOptions(wallets, exchangeCurrencyFrom)[0].value}
          isLoading={isExchanging}
          onSubmit={this.handleExchange}
        />
      </React.Fragment>)
  }
}

const mapStateToProps = state => ({
  wallets: getWallets(state),
  isFetching: state.wallets.isFetching,
  isDepositing: state.wallets.isDepositing,
  isError: state.wallets.isError,
  total: state.wallets.total,

  defaultCurrency: getDefaultCurrency(state),
  isUserFetching: state.user.isFetching,
})

const mapDispatchToProps = {
  deposit: walletsActions.deposit,
  exchange: walletsActions.exchange,

  getUserData: userActions.getUserData,
  setDefaultCurrency: userActions.setDefaultCurrency,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
