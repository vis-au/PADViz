import {connect} from 'react-redux';

import { setIndexes, setHover, setTime, setHMIdx } from '../redux/actions/index'
import Col3HeatMap from '../components/Col3HeatMap';


const mapStateToProps = (state, ownProps) => {
    return {
        hover: state.hover,
        indexes: state.indexes
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    setIndexes : (indexes) => dispatch(setIndexes(indexes)),
    setHover: (hover) => dispatch(setHover(hover)),
    setTime: (time) => dispatch(setTime(time)),
    setHMIdx: (idx) => dispatch(setHMIdx(idx))
})

export default connect( mapStateToProps, mapDispatchToProps )(Col3HeatMap);