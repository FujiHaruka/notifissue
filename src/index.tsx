import 'semantic-ui-css/semantic.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { ModalContextProvider } from './hooks/useModalContext'
import { ObserverContextProvider } from './hooks/useObserverContext'

ReactDOM.render(
  <ModalContextProvider>
    <ObserverContextProvider>
      <App />
    </ObserverContextProvider>
  </ModalContextProvider>,
  document.getElementById('root'),
)

serviceWorker.register()
