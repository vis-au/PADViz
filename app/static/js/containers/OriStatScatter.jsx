import {connect} from 'react-redux';

import OriStatScatter from '../components/OriStatScatter';
import { setHover } from '../redux/actions/index'

const mapStateToProps = (state, ownProps) => ({
    hover: state.hover,
    indexes: state.indexes
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    setHover: (hover) => dispatch(setHover(hover))
})

export default connect(mapStateToProps, mapDispatchToProps)(OriStatScatter);

