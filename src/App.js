import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import * as formatCurrency from 'format-currency'
import { SegmentStyled, Amount, LoaderStyles, TotalStyles } from './app.styles'
import * as userActions from './redux/actions/user'
import * as appActions from './redux/actions/app'
import { getWallets } from './redux/selectors/wallets'
import { getDefaultCurrency } from './redux/selectors/user'
import { DepositModal } from './components/deposit-modal'
import { ExchangeModal } from './components/exchange-modal'
import { getExchangeOptions } from './utils'
import { Grid, Header, Divider, Button, Loader, Dropdown, Menu } from 'semantic-ui-react'

const INITIAL_STATE = {
  isDepositModalOpen: false,
  isExchangeModalOpen: false,
}

class App extends Component {
  state = INITIAL_STATE
  static propTypes = {
    wallets: PropTypes.arrayOf(PropTypes.shape({
      currency: PropTypes.string,
      amount: PropTypes.number,
      color: PropTypes.string,
    })),
    isFetching: PropTypes.bool.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    total: PropTypes.number,

    defaultCurrency: PropTypes.string,
    isUserFetching: PropTypes.bool.isRequired,

    bootApp: PropTypes.func.isRequired,
    setDefaultCurrency: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.bootApp()
  }

  closeModal = () => this.setState(INITIAL_STATE)

  openDepositModal = currency => () => {
    this.setState({
      isDepositModalOpen: true,
      depositCurrency: currency,
    })
  }

  openExchangeModal = currency => () => this.setState({
    isExchangeModalOpen: true,
    exchangeCurrencyFrom: currency,
  })

  handleSetDefaultCurrency = (event, { value }) => {
    this.props.setDefaultCurrency({ currency: value})
  }

  render() {
    const { wallets, isFetching, isUserFetching, defaultCurrency, total, isProcessing } = this.props
    const { isDepositModalOpen, depositCurrency, isExchangeModalOpen, exchangeCurrencyFrom } = this.state
    const isTotalLoading = isUserFetching || isProcessing || isFetching

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
              {isTotalLoading ? <Loader active inline="centered" /> : <Header as="h1" color="teal" textAlign="center">
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
          currency={depositCurrency}
          isOpen={isDepositModalOpen}
          onClose={this.closeModal}
        />
        <ExchangeModal
          onClose={this.closeModal}
          isOpen={isExchangeModalOpen}
          currencyFrom={exchangeCurrencyFrom}
        />
      </React.Fragment>)
  }
}

const mapStateToProps = state => ({
  wallets: getWallets(state),
  isFetching: state.wallets.isFetching,
  isProcessing: state.wallets.isProcessing,
  total: state.wallets.total,

  defaultCurrency: getDefaultCurrency(state),
  isUserFetching: state.user.isFetching,
})

const mapDispatchToProps = {
  bootApp: appActions.boot,
  setDefaultCurrency: userActions.setDefaultCurrency,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
