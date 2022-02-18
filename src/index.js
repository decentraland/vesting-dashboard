import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { createHashHistory } from 'history'
import configureStore from './modules/store'

import App from "./components/App";
import unregisterServiceWorker from "./registerServiceWorker";
import { Router, Route } from "react-router";

import "./index.css";

window.ethereum.enable().then(() => {
  const history = createHashHistory(window.history)
  const store = configureStore(history)
  ReactDOM.render(
    <Provider store={store}>
      <ConnectedRouter store={store} history={history}>
        <Router history={history}>
          <Route path="*">
            <App />
          </Route>
        </Router>
      </ConnectedRouter>
    </Provider>,
    document.getElementById('root')
  )
  unregisterServiceWorker()
})
