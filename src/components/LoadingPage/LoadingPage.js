import { Logo } from 'decentraland-ui'
import React from 'react'
import { Container } from 'semantic-ui-react'

function LoadingPage(props) {
  const { msg } = props

  return (
    <Container className="Loading">
      <Logo />
      <p className="loading-message">{msg}</p>
    </Container>
  )
}

export default React.memo(LoadingPage)
