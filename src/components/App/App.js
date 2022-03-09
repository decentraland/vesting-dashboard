import React, { Component } from 'react'
import "./App.css";
import PropTypes from "prop-types";
import Header from "components/Header";
import Dashboard from "components/Dashboard";
import Footer from "components/Footer";
import ChangeBeneficiaryModal from "components/ChangeBeneficiaryModal";
import { isValidAddress } from "utils";
import DaoInitiativeContextProvider from "../../context/DaoInitiativeContext";
import LandingPage from "../LandingPage/LandingPage";
import ErrorPage from "../ErrorPage/ErrorPage";
import LoadingPage from "../LoadingPage/LoadingPage";

class App extends Component {
  static propTypes = {
    loadingMessage: PropTypes.string,
    errorMessage: PropTypes.string,
    isLoaded: PropTypes.bool,
    onConnect: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      address: this.props.address || localStorage.getItem("address") || null,
    };
  }

  componentWillMount() {
    const { onConnect } = this.props;
    onConnect();
    document.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      const { onConnect } = this.props;
      onConnect();
    }
  }

  handleAddressChange = (e) => {
    const address = e.target.value.trim();
    localStorage.setItem("address", address);
    this.setState({ address });
  };

  handleKeyDown = (e) => {
    const isEnterKey = e.which === 13 || e.which === 32;
    const { onAccess, showPrompt, address } = this.props;
    if (
      isEnterKey &&
      showPrompt &&
      this.state.address &&
      isValidAddress(this.state.address) &&
      this.state.address !== address
    ) {
      onAccess(this.state.address);
    }
  };

  renderPrompt() {
    const { isNotFound, address, network } = this.props;
    const landingProps = { isNotFound, address, network, handleAddressChange: (e) => this.handleAddressChange(e) };
    return (
      <div className="app start">
        <LandingPage stateAddress={this.state.address} {...landingProps} />
      </div>
    );
  }

  renderError() {
    const { connectionError } = this.props;

    return (
      <div className="app start">
        <ErrorPage connectionError={connectionError} />
      </div>
    );
  }

  renderLoading() {
    const { loadingMessage } = this.props;
    return (
      <div className="app start">
        <LoadingPage msg={loadingMessage} />
      </div>
    );
  }

  render() {
    const { loadingMessage, connectionError, contractError, showPrompt, isLoaded } = this.props;
    if (loadingMessage) {
      return this.renderLoading();
    }
    if (connectionError || contractError) {
      return this.renderError();
    }
    if (showPrompt) {
      return this.renderPrompt();
    }

    if (!isLoaded) {
      return null;
    }
    return (
      <div className="app">
        <DaoInitiativeContextProvider>
          <Header />
          <Dashboard />
          <Footer />
          {/* <ChangeBeneficiaryModal /> */}
        </DaoInitiativeContextProvider>
      </div>
    );
  }
}

export default App
