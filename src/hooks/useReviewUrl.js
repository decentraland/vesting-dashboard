import { config } from '../config/config'
import { openInNewTab } from '../utils'

export default function useReviewUrl(address) {
  const reviewUrl = `${config.get('REVIEW_CONTRACT_URL')}${address}`
  const onReviewUrlClick = (e) => openInNewTab(reviewUrl, e)

  return { reviewUrl, onReviewUrlClick }
}
