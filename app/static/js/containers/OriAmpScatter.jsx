import {connect} from 'react-redux';

import OriAmpScatter from '../components/OriAmpScatter';
import { setHover } from '../redux/actions/index'

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes,
    time: state.time,
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHover: (hover) => dispatch(setHover(hover))
})

export default connect(mapStateToProps, mapDispatchToProps)(OriAmpScatter);

