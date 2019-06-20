import {connect} from 'react-redux';

import DiffHeatMap from '../components/DiffHeatMap';
import { setGlobalFilter, setHMCell } from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => {
    return {
        global_indexes: state.global_indexes,
        hmcell: state.hmcell,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    setGlobalFilter: (indexes) => dispatch(setGlobalFilter(indexes)),
    setHMCell: (i) => dispatch(setHMCell(i))
})

export default connect( mapStateToProps, mapDispatchToProps )(DiffHeatMap);