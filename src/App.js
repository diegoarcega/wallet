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
  }

  componentDidMount() {
    const { getAllWallets } = this.props
    getAllWallets()
  }

  closeDepositModal = () => this.setState({ isDepositModalOpen: false })

  toggleDepositModal = currency => () => this.setState({
    isDepositModalOpen: true,
    depositCurrency: currency,
  })

  handleDepositMountChange = event => this.setState({ depositAmount: event.target.value })

  handleDeposit = () => {
    const { depositCurrency, depositAmount } = this.state

    this.props.deposit({
      amount: parseInt(depositAmount, 10),
      currency: depositCurrency,
    }, this.closeDepositModal)
  }

  render() {
    const { wallets, isFetching, isDepositing, isDepositSuccess } = this.props
    const { isDepositModalOpen, depositCurrency } = this.state

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
                    <Button basic color="blue">Exchange</Button>
                    <Button basic color="green" onClick={this.toggleDepositModal(currency.currency)}>Deposit</Button>
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
            {isDepositSuccess && <Header as="h1" color="green">Deposit completed!</Header>}
            <Input
              size="massive"
              type="number"
              placeholder="0"
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
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
