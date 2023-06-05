import { LoginModal, LoginModalOptionType } from 'decentraland-ui'
import { openInNewTab } from '../../utils'

function MetaMaskHandler() {
  if (window.ethereum) {
    window.ethereum.enable().then(() => {
      window.location.reload()
    })
  } else {
    openInNewTab('https://metamask.io/download/')
  }
}
function WalletSelector(props) {
  const { open, onClose } = props

  return (
    <LoginModal open={open} onClose={onClose}>
      <LoginModal.Option type={LoginModalOptionType.METAMASK} onClick={MetaMaskHandler} />
    </LoginModal>
  )
}

export default WalletSelector
