import { connect } from "react-redux";
import { release } from "modules/contract/actions";
import { getContract } from "modules/contract/selectors";
import Details from "./Details";

export const mapState = state => {
  return {
    contract: getContract(state)
  };
};

export const mapDispatch = dispatch => ({
  onRelease: () => dispatch(release())
});

export default connect(mapState, mapDispatch)(Details);
