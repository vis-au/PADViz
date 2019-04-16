import {connect} from 'react-redux';

import { setHover } from '../redux/actions/index'
import S2AmpScatter from '../components/S2AmpScatter';

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes,
    time: state.time,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHover: (hover) => dispatch(setHover(hover))
})

export default connect(mapStateToProps, mapDispatchToProps)(S2AmpScatter);

