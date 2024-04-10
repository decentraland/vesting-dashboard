import { Logo } from 'decentraland-ui'
import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Container } from 'semantic-ui-react'

function ErrorPage({ connectionError }) {
  return (
    <Container className="Error">
      <Logo />
      <h3>{t('helper.error_page.message')}</h3>
      <p>{connectionError}</p>
    </Container>
  )
}

export default React.memo(ErrorPage)
