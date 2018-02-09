import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from 'components/Header'
import Dashboard from 'components/Dashboard'
import Footer from 'components/Footer'
import Input from 'components/Input'
import ChangeBeneficiaryModal from 'components/ChangeBeneficiaryModal'
import { isValidAddress } from 'utils'
import './App.css'

class App extends Component {
  static propTypes = {
    loadingMessage: PropTypes.string,
    errorMessage: PropTypes.string,
    isLoaded: PropTypes.bool,
    onConnect: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      address: this.props.address || localStorage.getItem('address') || null
    }
  }

  componentWillMount() {
    const { onConnect } = this.props
    onConnect()
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address !== this.props.address) {
      const { onConnect } = this.props
      onConnect()
    }
  }

  handleAddressChange = e => {
    const address = e.target.value.trim()
    localStorage.setItem('address', address)
    this.setState({ address })
  }

  handleKeyDown = e => {
    const isEnterKey = e.which === 13 || e.which === 32
    const { onAccess, showPrompt, address } = this.props
    if (
      isEnterKey &&
      showPrompt &&
      this.state.address &&
      isValidAddress(this.state.address) &&
      this.state.address !== address
    ) {
      onAccess(this.state.address)
    }
  }

  renderPrompt() {
    const { isNotFound, address, network } = this.props
    let helpText = 'Press enter to continue'
    if (!this.state.address) {
      helpText = 'Please provide a vesting contract address'
    } else if (!isValidAddress(this.state.address)) {
      helpText = "That's not a valid Ethereum address"
    } else if (isNotFound && this.state.address === address) {
      helpText =
        "There's no vesting contract on that address..." +
        (network && network.name !== 'mainnet' ? "\nMaybe it's because you are on " + network.label + '?' : '')
    }
    return (
      <div className="app">
        <div className="container">
          <div className="decentraland-logo" />
          <h3>Contract Address</h3>
          <Input value={this.state.address} placeholder="0x..." onChange={this.handleAddressChange} />
          <p className="help">{helpText}</p>
        </div>
      </div>
    )
  }

  renderError() {
    const { connectionError } = this.props
    let errorText = 'So this happened: ' + connectionError
    if (connectionError.indexOf('Failed to fetch') !== -1) {
      errorText = <p className="error">Make sure you are connected to the internet.</p>
    }
    if (connectionError.indexOf('Ethereum') !== -1) {
      errorText = (
        <p className="error">
          Make sure you have{' '}
          <a href="https://metamask.io" target="_blank" rel="noreferrer noopener">
            MetaMask
          </a>{' '}
          installed and your account is unlocked.
        </p>
      )
    }
    return (
      <div className="app">
        <div className="container">
          <div className="decentraland-logo" />
          <h3>Uh-oh... something went wrong.</h3>
          {errorText}
        </div>
      </div>
    )
  }

  renderLoading() {
    const { loadingMessage } = this.props
    return (
      <div className="app">
        <div className="container">
          <div className="decentraland-logo" />
          <p className="loading-message">{loadingMessage}</p>
        </div>
      </div>
    )
  }

  render() {
    const { loadingMessage, connectionError, contractError, showPrompt, isLoaded } = this.props
    if (loadingMessage) {
      return this.renderLoading()
    }
    if (connectionError || contractError) {
      return this.renderError()
    }
    if (showPrompt) {
      return this.renderPrompt()
    }

    if (!isLoaded) {
      return null
    }
    return (
      <div className="app">
        <Header />
        <Dashboard />
        <Footer />
        <ChangeBeneficiaryModal />
      </div>
    )
  }
}

export default App
