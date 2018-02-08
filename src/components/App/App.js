import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Header from 'components/Header'
import Dashboard from 'components/Dashboard'
import Footer from 'components/Footer'
import './App.css'

class App extends Component {
  static propTypes = {
    loadingMessage: PropTypes.string,
    errorMessage: PropTypes.string,
    isLoaded: PropTypes.bool,
    onConnect: PropTypes.func.isRequired
  }

  componentWillMount() {
    const { onConnect } = this.props
    onConnect()
  }
  render() {
    const { loadingMessage, connectionError, contractError, isBlank, isLoaded } = this.props
    if (loadingMessage) {
      return <div className="app loading">{loadingMessage}</div>
    }
    if (connectionError || contractError) {
      return <div className="app error">Error: {connectionError || contractError}</div>
    }
    if (isBlank) {
      return <div className="app loading">Please provide a contract address</div>
    }

    if (!isLoaded) {
      return null
    }
    return (
      <div className="app">
        <Header />
        <Dashboard />
        <Footer />
      </div>
    )
  }
}

export default App
