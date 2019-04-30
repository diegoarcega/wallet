import React from 'react'
import styled from 'styled-components'
import { Grid, Segment, Header, Divider, Button } from 'semantic-ui-react'

const SegmentStyled = styled(Segment)`
  && { background: #e1fffd; }
`

const Amount = styled.span`
  font-size: 15px;
`

function App() {
  return (<Grid columns="equal" container>
    <Grid.Row>
      <Grid.Column>
        <Divider />
        <Header as="h1" color="teal" floated="right">20.000.00 USD</Header>
      </Grid.Column>
    </Grid.Row>
  <Grid.Row>
    <Grid.Column>
      <SegmentStyled raised color='red'>
        <Header as="h4" color="red">GBP Wallet</Header>
        <p><Amount>1.000.00</Amount> GBP</p>
        <div><Button basic color="blue">Exchange</Button></div>
      </SegmentStyled>
    </Grid.Column>
    <Grid.Column>
      <SegmentStyled raised color='violet'>
        <Header as="h4" color="violet">USD Wallet</Header>
        <p><Amount>1.000.00</Amount> USD</p>
        <div><Button basic color="blue">Exchange</Button></div>
      </SegmentStyled>
    </Grid.Column>
    <Grid.Column>
      <SegmentStyled raised color='green'>
        <Header as="h4" color="green">BRL Wallet</Header>
        <p><Amount>1.000.00</Amount> BRL</p>
        <div><Button basic color="blue">Exchange</Button></div>
      </SegmentStyled>
    </Grid.Column>
  </Grid.Row>
</Grid>)
}

export default App;
