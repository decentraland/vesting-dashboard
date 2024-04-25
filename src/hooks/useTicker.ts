import { useQuery } from '@tanstack/react-query'
import { fetchTicker } from '../modules/api'

export default function useTicker() {
  const {
    data: ticker,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`ticker`],
    queryFn: () => fetchTicker('decentraland'),
  })

  return {
    ticker,
    isLoading: isLoading,
    error,
  }
}
