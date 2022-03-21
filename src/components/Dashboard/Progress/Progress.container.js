import { connect } from 'react-redux'
import { getContract } from "../../../modules/contract/selectors";
import Progress from "./Progress";

export const mapState = (state) => {
  return {
    contract: getContract(state),
  };
};

export default connect(mapState)(Progress);
