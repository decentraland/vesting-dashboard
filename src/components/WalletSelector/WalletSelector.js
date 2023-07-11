import { LoginModal } from 'decentraland-ui'
// import { connection } from 'decentraland-connect'
// import { toModalOptionType, toProviderType } from './utils'
import { LoginModalOptionType } from 'decentraland-ui/dist/components/LoginModal/LoginModal'
import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'

function WalletSelector(props) {
  const { open, onClose, onConnect } = props

  // TODO: Implement multiple wallet options

  // const handleOnConnect = (loginType) => {
  //   const providerType = toProviderType(loginType)
  //   onConnect(providerType)
  // }

  // const renderLoginModalOption = (provider) => {
  //   const loginType = toModalOptionType(provider)

  //   return loginType ? (
  //     <LoginModal.Option key={loginType} type={loginType} onClick={() => handleOnConnect(loginType)} />
  //   ) : null
  // }

  return (
    <LoginModal open={open} onClose={onClose}>
      {/* {connection.getAvailableProviders().map(renderLoginModalOption)} */}
      <LoginModal.Option type={LoginModalOptionType.METAMASK} onClick={() => onConnect(ProviderType.INJECTED)} />
    </LoginModal>
  )
}

export default WalletSelector
