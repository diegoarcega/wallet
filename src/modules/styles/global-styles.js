import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  html, body, #root { height: 100%; }
  body {
    background: linear-gradient(to left top, #0A090E 10%, #191927 100%);
    font-family: 'Quicksand';
    font-weight: 100;
  }
`
