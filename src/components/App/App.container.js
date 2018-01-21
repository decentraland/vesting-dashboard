import { connect } from "react-redux";
import { connect as connectToEthereum } from "modules/ethereum/actions";
import { isLoading as isConnecting, getError as getConnectionError } from "modules/ethereum/selectors";
import {
  isLoading as isFetchingContract,
  getError as getFetchContractError,
  getContract
} from "modules/contract/selectors";
import App from "./App";

export const mapState = state => {
  let loadingMessage = null;
  let errorMessage = getConnectionError(state) || getFetchContractError(state);
  const contract = getContract(state);

  if (isConnecting(state)) {
    loadingMessage = "Connecting";
  } else if (isFetchingContract(state)) {
    loadingMessage = "Loading data";
  }
  console.log(isFetchingContract(state));
  return {
    loadingMessage,
    errorMessage,
    isLoaded: !!contract
  };
};

export const mapDispatch = dispatch => ({
  onConnect: () => dispatch(connectToEthereum())
});

export default connect(mapState, mapDispatch)(App);
