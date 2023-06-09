import React from 'react'
import { Header } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

function ShowMore(props) {
  const { onClick } = props
  return (
    <li className="more" style={{ cursor: 'pointer' }} onClick={onClick}>
      <div className="timeline__event">
        <Header sub style={{ fontSize: '11px' }}>
          {t('schedule.show_more')}
        </Header>
      </div>
    </li>
  )
}

export default React.memo(ShowMore)
