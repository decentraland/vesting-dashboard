import { LoginModal } from 'decentraland-ui'
import { connection } from 'decentraland-connect'
import { toModalOptionType, toProviderType } from './utils'

function WalletSelector(props) {
  const { open, onClose, onConnect } = props

  const handleOnConnect = (loginType) => {
    const providerType = toProviderType(loginType)
    onConnect(providerType)
  }

  const renderLoginModalOption = (provider) => {
    const loginType = toModalOptionType(provider)

    return loginType ? (
      <LoginModal.Option key={loginType} type={loginType} onClick={() => handleOnConnect(loginType)} />
    ) : null
  }

  return (
    <LoginModal open={open} onClose={onClose}>
      {connection.getAvailableProviders().map(renderLoginModalOption)}
    </LoginModal>
  )
}

export default WalletSelector
