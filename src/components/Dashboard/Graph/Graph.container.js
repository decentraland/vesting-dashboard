import { connect } from 'react-redux'
import { getSchedule } from 'modules/contract/selectors'
import Graph from "./Graph";

export const mapState = (state) => {
  return {
    schedule: getSchedule(state),
  };
};

export const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(Graph);
