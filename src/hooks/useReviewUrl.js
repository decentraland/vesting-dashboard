import { useMemo } from 'react'
import { openInNewTab } from '../utils'

export default function useReviewUrl(address) {
  const reviewUrl = useMemo(() => `${process.env.REACT_APP_REVIEW_CONTRACT_URL}${address}`, [address])
  const clickHandler = (e) => openInNewTab(reviewUrl, e)

  return [reviewUrl, clickHandler]
}
