import React, { Component } from "react";
import PropTypes from "prop-types";
import Header from "components/Header";
import Dashboard from "components/Dashboard";
import Footer from "components/Footer";
import "./App.css";

class App extends Component {
  static propTypes = {
    loadingMessage: PropTypes.string,
    errorMessage: PropTypes.string,
    onConnect: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { onConnect } = this.props;
    onConnect();
  }
  render() {
    const { loadingMessage, errorMessage } = this.props;
    if (loadingMessage) {
      return <div className="app loading">{loadingMessage}&hellip;</div>;
    }
    if (errorMessage) {
      return <div className="app error">{errorMessage}</div>;
    }
    return (
      <div className="app">
        <Header />
        <Dashboard />
        <Footer />
      </div>
    );
  }
}

export default App;
