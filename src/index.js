import 'babel-polyfill'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router'
import { Provider } from 'react-redux'
import TranslationProvider from 'decentraland-dapps/dist/providers/TranslationProvider'
import WalletProvider from 'decentraland-dapps/dist/providers/WalletProvider'
import { createHashHistory } from 'history'

import { initStore } from './modules/store'
import App from './components/App'

import './index.css'
import 'decentraland-ui/lib/styles.css'

const history = createHashHistory(window.history)

ReactDOM.render(
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
  </Provider>,
  document.getElementById('root')
)
