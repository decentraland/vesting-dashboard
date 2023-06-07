import { useState } from 'react'
import { LoginModal, LoginModalOptionType } from 'decentraland-ui'
import { openInNewTab } from '../../utils'

function WalletSelector(props) {
  const { open, onClose } = props
  const [isLoading, setIsLoading] = useState(false)

  const metamaskHandler = () => {
    if (window.ethereum) {
      setIsLoading(true)
      window.ethereum
        .enable()
        .then(() => {
          window.location.reload()
        })
        .catch(() => {
          setIsLoading(false)
        })
    } else {
      openInNewTab('https://metamask.io/download/')
    }
  }

  return (
    <LoginModal open={open} onClose={onClose} loading={isLoading}>
      <LoginModal.Option type={LoginModalOptionType.METAMASK} onClick={metamaskHandler} />
    </LoginModal>
  )
}

export default WalletSelector
