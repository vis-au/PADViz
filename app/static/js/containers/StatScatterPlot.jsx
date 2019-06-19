import {connect} from 'react-redux';

import { setStatXY, setGlobalHover } from '../redux/actions/index';
import StatScatterPlot from '../components/StatScatterPlot';

const mapStateToProps = (state, ownProps) => ({
    statxy: state.statxy,
    global_indexes: state.global_indexes,
    global_hover: state.global_hover,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setStatXY: (arr) => dispatch(setStatXY(arr)),
    setGlobalHover: (indexes) => dispatch(setGlobalHover(indexes)),
})

export default connect(mapStateToProps, mapDispatchToProps)(StatScatterPlot);
