import {connect} from 'react-redux';

import OriHeatMap from '../components/OriHeatMap';
import { setIndexes, setHover, setTime, setHMIdx } from '../redux/actions/index'


const mapStateToProps = (state, ownProps) => {
    return {
        hover: state.hover,
        indexes: state.indexes,
        selectedIndexes: state.selectedIndexes
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    setIndexes : (indexes) => dispatch(setIndexes(indexes)),
    setHover: (hover) => dispatch(setHover(hover)),
    setTime: (time) => dispatch(setTime(time)),
    setHMIdx: (idx) => dispatch(setHMIdx(idx))
})

export default connect( mapStateToProps, mapDispatchToProps )(OriHeatMap);