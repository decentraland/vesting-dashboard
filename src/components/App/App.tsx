import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../Navbar'
import Dashboard from '../Dashboard'
import Footer from '../Footer'
import { isValidAddress } from '../../utils'
import LandingPage from '../LandingPage/LandingPage'
import ErrorPage from '../ErrorPage/ErrorPage'
import LoadingPage from '../LoadingPage/LoadingPage'
import useContract from '../../hooks/useContract'

import './App.css'

function App({ network, isConnecting }) {
  const [address, setAddress] = useState()

  const { contract, error: contractError, isLoading: isLoadingContract } = useContract(address)
  const navigate = useNavigate()

  // useEffect(() => {
  //   // onConnect()
  //   document.addEventListener('keydown', handleKeyDown)
  // }, [])

  // const handleKeyDown = (e) => {
  //   const isEnterKey = e.which === 13 || e.which === 32
  //   if (isEnterKey && showPrompt && address && isValidAddress(address) && address !== address) {
  //     onConnect(address)
  //   }
  // }

  const handleAddressChange = (e) => {
    const address = e.target.value.trim()
    if (isValidAddress(address)) {
      setAddress(address)
      navigate(address)
    }
  }

  if (isConnecting || isLoadingContract) {
    return (
      <div className="app start">
        <LoadingPage msg={isConnecting ? 'Loading...' : 'Loading data...'} />
      </div>
    )
  }

  if (contractError) {
    return (
      <div className="app start">
        <ErrorPage connectionError={contractError} />
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="app start">
        <LandingPage
          stateAddress={address}
          address={address}
          network={network}
          onAddressChange={(e) => handleAddressChange(e)}
        />
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar />
      <Dashboard contractAddress={contract.address} />
      <Footer />
    </div>
  )
}

export default App
