import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { fetchContract, fetchTokenContracts } from '../modules/api'
import { useEffect, useState } from 'react'
import { isValidAddress } from '../utils'

function useTokenContracts() {
  const { data: tokenContracts } = useQuery({
    queryKey: [`tokenContracts`],
    queryFn: () => fetchTokenContracts(),
  })

  return { tokenContracts }
}

export default function useContract(address?: string) {
  const { tokenContracts } = useTokenContracts()

  const [paramAddress, setParamAddress] = useState('')

  const location = useLocation()
  useEffect(() => {
    if (location) {
      const addressParam = location.hash.split('#/')[1]
      if (isValidAddress(addressParam)) {
        setParamAddress(addressParam)
      }
    }
  }, [location])

  const contractAddress = paramAddress || address

  const {
    data: contract,
    isLoading,
    error,
    fetchStatus,
  } = useQuery({
    queryKey: [`contract-${contractAddress}`],
    queryFn: () => fetchContract(contractAddress, tokenContracts),
    enabled: !!contractAddress && !!tokenContracts,
  })

  return {
    contract,
    isLoading: isLoading && fetchStatus === 'fetching',
    error,
  }
}
