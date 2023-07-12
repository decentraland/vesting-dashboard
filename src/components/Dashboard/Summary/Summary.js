import './Summary.css'
import React from 'react'
import { DATE_FORMAT_LONG, getPreciseDiff } from '../../../utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatDate, formatNumber } from 'decentraland-dapps/dist/lib/utils'
import useReviewUrl from '../../../hooks/useReviewUrl'

function Summary(props) {
  const { address, contract, ticker } = props
  const { symbol, released, start, cliff, vestedAmount, total } = contract

  let percentage = Math.round((released / vestedAmount) * 100)

  if (isNaN(percentage)) {
    percentage = 0
  }

  const vestingCliff = getPreciseDiff(start, cliff)

  const [reviewUrl, handleClick] = useReviewUrl(address)

  return (
    <div id="summary" style={{ textAlign: 'justify' }}>
      {t('summary.text', {
        b: (chunks) => <b>{chunks}</b>,
        br: <br />,
        cliff: t('cliff.duration', { months: vestingCliff.months, days: vestingCliff.days }),
        cliffEnd: formatDate(new Date(cliff * 1000), DATE_FORMAT_LONG),
        nearly: percentage > 0 ? `, ${t('summary.nearly')} ` : ' ',
        percentage: formatNumber(percentage, 0),
        amount: formatNumber(symbol === 'MANA' ? total * ticker : total, 0),
      })}
      <a href={reviewUrl} onClick={handleClick}>
        {t('summary.review_contract')}
      </a>
    </div>
  )
}

export default React.memo(Summary)
