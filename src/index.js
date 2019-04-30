import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from 'styled-components'
import { Reset } from 'styled-reset'
import { THEME, GlobalStyles } from '../src/modules/styles'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <ThemeProvider theme={THEME}>
    <React.Fragment>
      <Reset />
      <GlobalStyles />
      <App />
    </React.Fragment>
  </ThemeProvider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
