import {connect} from 'react-redux';

import DiffHeatMap from '../components/DiffHeatMap';
import { setGlobalFilter } from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => {
    return {
        global_indexes: state.global_indexes
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    setGlobalFilter: (indexes) => dispatch(setGlobalFilter(indexes))
})

export default connect( mapStateToProps, mapDispatchToProps )(DiffHeatMap);