import { useCallback } from 'react'

import { Navbar as BaseNavbar, Navbar2 as BaseNavbar2 } from 'decentraland-dapps/dist/containers'

import './Navbar.css'
import { config } from '../../config/config'
import { Props } from './Navbar.types'

const AUTH_URL = config.get('AUTH_URL')

export default function Navbar(props: Props) {
  const handleSignIn = useCallback(() => {
    window.location.replace(`${AUTH_URL}?redirectTo=${window.location.href}`)
  }, [])

  if (props.isNavbar2Enabled) {
    return <BaseNavbar2 {...props} onSignIn={handleSignIn} withNotifications={false} />
  }

  return (
    <>
      <BaseNavbar {...props} onSignIn={handleSignIn} withNotifications={false} />
    </>
  )
}
