import {connect} from 'react-redux';

import { setLineMax, setGlobalHover } from '../redux/actions/index';
import MultipleLines from '../components/MultipleLines';

const mapStateToProps = (state, ownProps) => ({
    // lineIndexes: state.lineIndexes,
    lineMax: state.lineMax,
    global_indexes: state.global_indexes,
    global_hover: state.global_hover,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    // setHoverLines: (indexes) => dispatch(setHoverLines(indexes)),
    setLineMax: (max) => dispatch(setLineMax(max)),
    setGlobalHover: (indexes) => dispatch(setGlobalHover(indexes)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MultipleLines);