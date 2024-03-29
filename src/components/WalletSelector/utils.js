import { ProviderType } from '@dcl/schemas/dist/dapps/provider-type'
import { LoginModalOptionType } from 'decentraland-ui/dist/components/LoginModal/LoginModal'
import { isCucumberProvider, isCoinbaseProvider, isDapperProvider } from 'decentraland-dapps/dist/lib/eth'
const { METAMASK, DAPPER, SAMSUNG, FORTMATIC, COINBASE, WALLET_CONNECT, WALLET_LINK, METAMASK_MOBILE } =
  LoginModalOptionType
export function toModalOptionType(providerType) {
  switch (providerType) {
    case ProviderType.METAMASK_MOBILE:
      return METAMASK_MOBILE
    case ProviderType.INJECTED:
      if (isCucumberProvider()) {
        return SAMSUNG
      } else if (isCoinbaseProvider()) {
        return COINBASE
      } else if (isDapperProvider()) {
        return DAPPER
      } else {
        return METAMASK
      }
    case ProviderType.FORTMATIC:
      return FORTMATIC
    case ProviderType.WALLET_CONNECT:
      return WALLET_CONNECT
    case ProviderType.WALLET_LINK:
      return WALLET_LINK
    default:
      console.warn(`Invalid provider type ${providerType}`)
      return
  }
}

export function toProviderType(modalOptionType) {
  switch (modalOptionType) {
    case METAMASK_MOBILE:
      return ProviderType.WALLET_CONNECT
    case METAMASK:
    case COINBASE:
    case DAPPER:
    case SAMSUNG:
      return ProviderType.INJECTED
    case FORTMATIC:
      return ProviderType.FORTMATIC
    case WALLET_CONNECT:
      return ProviderType.WALLET_CONNECT
    case WALLET_LINK:
      return ProviderType.WALLET_LINK
    default:
      throw new Error(`Invalid login type ${modalOptionType}`)
  }
}
