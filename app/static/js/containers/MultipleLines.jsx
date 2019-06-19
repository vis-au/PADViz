import {connect} from 'react-redux';

import { setHoverLines, setLineMax } from '../redux/actions/index';
import MultipleLines from '../components/MultipleLines';

const mapStateToProps = (state, ownProps) => ({
    lineIndexes: state.lineIndexes,
    lineMax: state.lineMax
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHoverLines: (indexes) => dispatch(setHoverLines(indexes)),
    setLineMax: (max) => dispatch(setLineMax(max))
})

export default connect(mapStateToProps, mapDispatchToProps)(MultipleLines);