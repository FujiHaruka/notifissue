import 'semantic-ui-css/semantic.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ModalContextProvider } from './contexts/ModalContext'

ReactDOM.render(
  <ModalContextProvider>
    <App />
  </ModalContextProvider>,
  document.getElementById('root'),
)

serviceWorker.register()
