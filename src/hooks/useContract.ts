import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
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

  const [paramAddress, setParamAddress] = useState()

  const params = useParams()
  useEffect(() => {
    if (params) {
      const addressParam = params[0].slice(1)
      console.log('a', addressParam)
      if (isValidAddress(addressParam)) {
        setParamAddress(addressParam)
      }
    }
  }, [params])

  const contractAddress = paramAddress || address

  console.log('c', contractAddress)

  const {
    data: contract,
    isLoading,
    error,
  } = useQuery({
    queryKey: [`contract-${contractAddress}`],
    queryFn: () => fetchContract(contractAddress, tokenContracts),
    enabled: !!contractAddress && !!tokenContracts,
  })

  console.log('c', contract)

  return {
    contract,
    isLoading,
    error,
  }
}
