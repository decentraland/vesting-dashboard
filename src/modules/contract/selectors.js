import { createSelector } from "reselect";

export const getState = state => state.app.contract;
export const getContract = state => getState(state).data;
export const getDuration = state => getContract(state).duration;
export const getCliff = state => getContract(state).duration;
export const getStart = state => getContract(state).start;
export const getBeneficiary = state => getContract(state).beneficiary;
export const getVestedAmount = state => getContract(state).vestedAmount;
export const getReleasableAmount = state => getContract(state).releasableAmount;
export const getReleasedAmount = state => getContract(state).released;
export const isRevoked = state => getContract(state).revoked;
export const isRevocabled = state => getContract(state).isRevocabled;
export const isLoaded = state => getContract(state) != null;
export const isLoading = state => getState(state).loading;
export const getError = state => getState(state).error;
