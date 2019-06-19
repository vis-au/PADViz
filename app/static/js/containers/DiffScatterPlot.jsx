import {connect} from 'react-redux';

import DiffScatterPlot from '../components/DiffScatterPlot';
import { setDiffXY, setGlobalHover } from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => ({
    diffxy: state.diffxy,
    global_indexes: state.global_indexes,
    global_hover: state.global_hover,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setDiffXY: (arr) => dispatch(setDiffXY(arr)),
    setGlobalHover: (indexes) => dispatch(setGlobalHover(indexes)),
})

export default connect(mapStateToProps, mapDispatchToProps)(DiffScatterPlot);
