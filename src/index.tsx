import React from 'react'
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import { createHashHistory } from 'history'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { initStore } from './modules/store'
import App from './components/App'

import './index.css'
import 'decentraland-ui/lib/styles.css'

const queryClient = new QueryClient()
const history = createHashHistory(window.history)
const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/profile' : '/'

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={basename}>
        <Provider store={initStore()}>
          <TranslationProvider locales={['en']}>
            <WalletProvider>
              <Router history={history}>
                <Route path="*">
                  <App />
                </Route>
              </Router>
            </WalletProvider>
          </TranslationProvider>
        </Provider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
