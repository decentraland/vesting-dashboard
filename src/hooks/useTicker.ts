import { useQuery } from '@tanstack/react-query'
import { fetchTicker } from '../modules/api'

export default function useTicker() {
  const {
    data: ticker,
    isLoading,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: [`ticker`],
    queryFn: () => fetchTicker('decentraland'),
  })

  return {
    ticker,
    isLoading: isLoading && fetchStatus === 'fetching',
    error,
  }
}
