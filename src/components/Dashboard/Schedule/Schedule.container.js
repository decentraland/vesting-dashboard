import { connect } from "react-redux";
import { getSchedule } from "modules/contract/selectors";
import Schedule from "./Schedule";

export const mapState = state => {
  return {
    schedule: getSchedule(state)
  };
};

export const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(Schedule);
