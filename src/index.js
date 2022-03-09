import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { createHashHistory } from 'history'
import configureStore from './modules/store'

import App from "./components/App";
import { Router, Route } from "react-router";
import { IntlProvider } from "react-intl";
import i18n_en from "./i18n/en.json";

import "./index.css";

const history = createHashHistory(window.history);
const store = configureStore(history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter store={store} history={history}>
      <Router history={history}>
        <Route path="*">
          <IntlProvider locale="en" messages={i18n_en}>
            <App />
          </IntlProvider>
        </Route>
      </Router>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);
