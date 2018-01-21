import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import createHistory from "history/createHashHistory";
import configureStore from "./modules/store";

import "./index.css";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";

const history = createHistory();
const store = configureStore(history);
const app = <App />;
const router = <ConnectedRouter history={history}>{app}</ConnectedRouter>;
const provider = <Provider store={store}>{router}</Provider>;

ReactDOM.render(provider, document.getElementById("root"));
registerServiceWorker();
