import { AuthIdentity } from '@dcl/crypto'
import { NavbarProps } from 'decentraland-dapps/dist/containers/Navbar/Navbar.types'

export type Props = Partial<NavbarProps> & {
  hasActivity: boolean
  isConnected: boolean
  identity?: AuthIdentity
}

export type MapStateProps = Pick<Props, 'hasActivity' | 'isConnected' | 'identity'>
