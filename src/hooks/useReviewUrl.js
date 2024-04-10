import { openInNewTab } from '../utils'

export default function useReviewUrl(address) {
  const reviewUrl = `${import.meta.env.VITE_REACT_APP_REVIEW_CONTRACT_URL}${address}`
  const onReviewUrlClick = (e) => openInNewTab(reviewUrl, e)

  return { reviewUrl, onReviewUrlClick }
}
