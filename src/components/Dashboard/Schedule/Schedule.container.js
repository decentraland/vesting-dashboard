import { connect } from "react-redux";
import { getContract } from "modules/contract/selectors";
import Schedule from "./Schedule";

export const mapState = (state) => {
  return {
    contract: getContract(state),
  };
};

export const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(Schedule);
