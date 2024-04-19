import { getConnectedProvider } from 'decentraland-dapps/dist/lib'
import { Provider } from 'decentraland-dapps/dist/modules/wallet'
import { ethers } from 'ethers'

export function isSameAddress(a, b) {
  return a && b && a.toLowerCase() === b.toLowerCase()
}

export async function getEthProvider(): Promise<ethers.BrowserProvider> {
  const provider: Provider | null = await getConnectedProvider()

  if (!provider) {
    throw new Error('Could not get a valid connected Wallet')
  }

  return new ethers.BrowserProvider(provider)
}
