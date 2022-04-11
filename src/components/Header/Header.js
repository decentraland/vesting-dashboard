import { Logo, UserMenu } from 'decentraland-ui'
import React, { useContext, useEffect, useState } from 'react'
import { Container, Grid } from 'semantic-ui-react'
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive'

import { DaoInitiativeContext } from '../../context/DaoInitiativeContext'
import useResponsive from '../../hooks/useResponsive'
import { openInNewTab } from '../../utils'
import DaoInitiativeButton from '../DaoInitiativeButton/DaoInitiativeButton'

import './Header.css'

function signInHandler() {
  if (window.ethereum) {
    window.location.reload()
  } else {
    openInNewTab('https://metamask.io/download/')
  }
}

function Header(props) {
  const { address } = props
  const [isSignedIn, setIsSignedIn] = useState(false)

  const { proposalUrl } = useContext(DaoInitiativeContext)

  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth })

  useEffect(() => {
    if (address) {
      setIsSignedIn(true)
    } else {
      setIsSignedIn(false)
    }
  }, [address])

  return (
    <div className="header">
      <Container style={{ height: 'auto' }}>
        <Grid verticalAlign="middle" style={{ marginLeft: 0, marginRight: 0 }}>
          <Grid.Row>
            <Grid.Column style={{ width: 'fit-content', paddingLeft: 0 }}>
              <Logo />
            </Grid.Column>
            <Grid.Column style={{ padding: 0 }}>
              <h1 className="header-title">Decentraland</h1>
            </Grid.Column>
            <Grid.Column
              floated="right"
              style={{ width: 'fit-content', paddingRight: 0 }}
            >
              {isMobile ? (
                proposalUrl && <DaoInitiativeButton />
              ) : (
                <UserMenu onSignIn={signInHandler} isSignedIn={isSignedIn} />
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    </div>
  )
}

export default React.memo(Header)
