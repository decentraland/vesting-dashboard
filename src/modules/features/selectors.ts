import {
  getIsFeatureEnabled,
  getLoading,
  hasLoadedInitialFlags,
} from 'decentraland-dapps/dist/modules/features/selectors'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'

import { RootState } from '../reducer'

import { FeatureName } from './types'

export const isLoadingFeatureFlags = (state: RootState) => {
  return getLoading(state)
}

export const getIsNavbar2Enabled = (state: RootState) => {
  if (hasLoadedInitialFlags(state)) {
    return getIsFeatureEnabled(state, ApplicationName.DAPPS, FeatureName.NAVBAR_UI2)
  }
  return false
}
