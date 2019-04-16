import {connect} from 'react-redux';

import { setIndexes, setHover, setTime } from '../redux/actions/index'
import S2HeatMap from '../components/tmp/HeatMapS2';


const mapStateToProps = (state, ownProps) => {
    return {
        hover: state.hover,
        indexes: state.indexes
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    setIndexes : (indexes) => dispatch(setIndexes(indexes)),
    setHover: (hover) => dispatch(setHover(hover)),
    setTime: (time) => dispatch(setTime(time))
})

export default connect( mapStateToProps, mapDispatchToProps )(S2HeatMap);