import {connect} from 'react-redux';

import AmpHeatMap from '../components/_AmpHeatMap';
import { setIndexes, setClickHm, setHover, setTime, setHMIdx } from '../redux/actions/index'


const mapStateToProps = (state, ownProps) => {
    return {
        hover: state.hover,
        clickHm: state.clickHm,
        indexes: state.indexes,
        selectedIndexes: state.selectedIndexes
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    setIndexes : (indexes) => dispatch(setIndexes(indexes)),
    setClickHm: (name) => dispatch(setClickHm(name)),
    setHover: (hover) => dispatch(setHover(hover)),
    setTime: (time) => dispatch(setTime(time)),
    setHMIdx: (idx) => dispatch(setHMIdx(idx))
})

export default connect( mapStateToProps, mapDispatchToProps )(AmpHeatMap);