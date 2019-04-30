import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as walletsActions from './redux/actions/wallets'
import { Grid, Segment, Header, Divider, Button } from 'semantic-ui-react'

const SegmentStyled = styled(Segment)`
  && { background: #e1fffd; }
`

const Amount = styled.span`
  font-size: 15px;
`

class App extends React.Component {
  componentDidMount() {
    const { getAllWallets } = this.props
    getAllWallets()
  }

  HandleDeposit = currency => () => {
    this.props.deposit({
      amount: 10,
      currency,
    })
  }

  render() {
    const { wallets } = this.props

    return (<Grid columns="equal" container>
      <Grid.Row>
        <Grid.Column>
          <Divider />
          <Button basic inverted>Change default currency</Button>
          <Header as="h1" color="teal" floated="right">20.000.00 USD</Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        {wallets.map(currency => (
          <Grid.Column key={currency.currency}>
            <SegmentStyled raised color={currency.color}>
              <Header as="h4" color={currency.color}>{currency.currency} Wallet</Header>
              <p><Amount>{currency.amount}</Amount> {currency.currency}</p>
              <div>
                <Button basic color="blue">Exchange</Button>
                <Button basic color="green" onClick={this.HandleDeposit(currency.currency)}>Deposit</Button>
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
  </Grid>)
  }
}

const mapStateToProps = state => ({
  wallets: state.wallets.wallets,
  isLoading: state.wallets.isLoading,
  isError: state.wallets.isError,
})

const mapDispatchToProps = {
  getAllWallets: walletsActions.getAll,
  deposit: walletsActions.deposit,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
