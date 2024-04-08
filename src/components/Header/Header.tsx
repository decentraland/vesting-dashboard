import { useCallback } from 'react'

import { Navbar as BaseNavbar } from 'decentraland-dapps/dist/containers'

import './Header.css'
import { config } from '../../config/config'
import { Props } from './Header.types'

const AUTH_URL = config.get('AUTH_URL')

function Header(props: Props) {
  const handleSignIn = useCallback(() => {
    window.location.replace(`${AUTH_URL}?redirectTo=${window.location.href}`)
  }, [])

  return (
    <>
      <BaseNavbar {...props} onSignIn={handleSignIn} />
    </>
  )
}

export default Header
