import {connect} from 'react-redux';

import OriHeatMap from '../components/OriHeatMap';
import { setPos } from '../redux/actions/index'


const mapStateToProps = (state, ownProps) => {
    return {
        clickPos: state.clickPos
    }
}
const mapDispatchToProps = (dispatch, ownProps) => ({
    // setClickPos: (time, amp, count) => dispatch(setClickPos(time, amp, count))
    // getClickPos(time, amp, count ) {
    //     dispatch(getClickPos(time, amp, count))
    // }
    setPos : (pos) => dispatch(setPos(pos))
})

export default connect( mapStateToProps, mapDispatchToProps )(OriHeatMap);